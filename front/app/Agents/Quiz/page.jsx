'use client';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import jsPDF from 'jspdf';
import 'react-toastify/dist/ReactToastify.css';

export default function QuizGeneratorPage() {
  const [formData, setFormData] = useState({
    data: null,
    numQuestions: '5',
    difficulty: 'medium'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [quizData, setQuizData] = useState(null);
  const [error, setError] = useState('');

  const WEBHOOK_URL = 'https://cse12345.app.n8n.cloud/webhook/quiz';

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value
    });
  };

  const handleGenerateQuiz = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(''); // Clear previous errors
    
    try {
      const formDataToSend = new FormData();
      
      if (formData.data) {
        formDataToSend.append('data', formData.data);
      }
      formDataToSend.append('numQuestions', formData.numQuestions);
      formDataToSend.append('difficulty', formData.difficulty);

      console.log('Sending request to:', WEBHOOK_URL);
      
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        body: formDataToSend
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers.get('content-type'));

      // Check if the response is ok
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Get the response as text first to debug
      const responseText = await response.text();
      console.log('Raw response:', responseText);

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (jsonError) {
        console.error('JSON parse error:', jsonError);
        throw new Error(`Invalid JSON response: ${responseText.substring(0, 200)}...`);
      }

      console.log('Parsed result:', result);

      // Handle different response formats from your N8N webhook
      if (result.success === false) {
        throw new Error(result.error || result.errorMessage || 'Quiz generation failed');
      }

      // Try to extract quiz data from different possible response structures
      let extractedQuizData = null;
      
      if (result.quiz) {
        // Direct quiz array
        extractedQuizData = {
          quiz: result.quiz,
          difficulty: formData.difficulty,
          numQuestions: formData.numQuestions,
          fileName: formData.data ? formData.data.name : 'Quiz'
        };
      } else if (result.rawGeminiResponse?.content?.[0]?.parts?.[0]?.text) {
        // Extract from Gemini response like in your screenshot
        const geminiText = result.rawGeminiResponse.content[0].parts[0].text;
        console.log('Gemini text:', geminiText);
        
        const jsonMatch = geminiText.match(/``````/);
        
        if (jsonMatch) {
          try {
            const parsedQuiz = JSON.parse(jsonMatch[1]);
            extractedQuizData = {
              quiz: parsedQuiz.quiz || [],
              difficulty: formData.difficulty,
              numQuestions: formData.numQuestions,
              fileName: formData.data ? formData.data.name : 'Quiz'
            };
          } catch (parseError) {
            console.error('Error parsing Gemini JSON:', parseError);
            throw new Error('Failed to parse quiz from AI response');
          }
        } else {
          throw new Error('No valid quiz format found in AI response');
        }
      } else {
        console.error('Unexpected response structure:', result);
        throw new Error('Invalid response format - no quiz data found');
      }

      if (!extractedQuizData || !extractedQuizData.quiz || extractedQuizData.quiz.length === 0) {
        throw new Error('No quiz questions were generated');
      }

      console.log('Final quiz data:', extractedQuizData);
      setQuizData(extractedQuizData);
      
      toast.success('🎉 Quiz generated successfully! You can now download it as PDF.', {
        position: "top-right",
        autoClose: 5000,
      });

    } catch (error) {
      console.error('Quiz generation error:', error);
      setError(error.message);
      
      toast.error(`❌ ${error.message}`, {
        position: "top-right",
        autoClose: 8000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const downloadQuizPDF = async () => {
    if (!quizData || !quizData.quiz || quizData.quiz.length === 0) {
      toast.error('No quiz data available to download', {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      const margin = 20;
      const lineHeight = 7;
      let yPosition = margin;

      // Add title
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('Quiz Assessment', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 15;

      // Add quiz info
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Source: ${quizData.fileName}`, margin, yPosition);
      yPosition += lineHeight;
      doc.text(`Difficulty: ${quizData.difficulty.toUpperCase()}`, margin, yPosition);
      yPosition += lineHeight;
      doc.text(`Total Questions: ${quizData.quiz.length}`, margin, yPosition);
      yPosition += lineHeight;
      doc.text(`Date: ${new Date().toLocaleDateString()}`, margin, yPosition);
      yPosition += 15;

      // Add instructions
      doc.setFontSize(11);
      doc.setFont('helvetica', 'italic');
      doc.text('Instructions: Choose the best answer for each question. Mark your answers clearly.', margin, yPosition);
      yPosition += 15;

      // Add questions
      doc.setFont('helvetica', 'normal');
      quizData.quiz.forEach((question, index) => {
        // Check if we need a new page
        if (yPosition > pageHeight - 60) {
          doc.addPage();
          yPosition = margin;
        }

        // Question number and text
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        const questionText = `${index + 1}. ${question.question}`;
        const splitQuestion = doc.splitTextToSize(questionText, pageWidth - 2 * margin);
        doc.text(splitQuestion, margin, yPosition);
        yPosition += lineHeight * splitQuestion.length + 3;

        // Options
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        if (question.options && Array.isArray(question.options)) {
          question.options.forEach((option, optionIndex) => {
            const optionLetter = String.fromCharCode(65 + optionIndex); // A, B, C, D
            const optionText = `   ${optionLetter}) ${option}`;
            const splitOption = doc.splitTextToSize(optionText, pageWidth - 2 * margin - 10);
            doc.text(splitOption, margin + 5, yPosition);
            yPosition += lineHeight * splitOption.length;
          });
        }

        yPosition += 5; // Space between questions
      });

      // Add answer sheet
      doc.addPage();
      yPosition = margin;
      
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Answer Sheet', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 20;

      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text('Fill in your answers below:', margin, yPosition);
      yPosition += 15;

      // Create answer boxes
      quizData.quiz.forEach((_, index) => {
        if (yPosition > pageHeight - 20) {
          doc.addPage();
          yPosition = margin;
        }

        doc.text(`${index + 1}.`, margin, yPosition);
        
        // Draw answer boxes
        ['A', 'B', 'C', 'D'].forEach((letter, letterIndex) => {
          const boxX = margin + 30 + (letterIndex * 25);
          const boxY = yPosition - 5;
          doc.rect(boxX, boxY, 8, 8);
          doc.text(letter, boxX + 10, yPosition);
        });
        
        yPosition += 12;
      });

      // Save the PDF
      const fileName = `${quizData.fileName.replace(/\.[^/.]+$/, '')}_Quiz_${Date.now()}.pdf`;
      doc.save(fileName);
      
      toast.success('📄 Quiz PDF downloaded successfully!', {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('❌ Failed to generate PDF. Please try again.', {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute -bottom-20 left-40 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-2xl font-bold text-white">Champion</div>
            <div className="hidden md:flex space-x-8 text-white/80">
              <a href="#" className="hover:text-white transition-colors">Home</a>
              <a href="#" className="hover:text-white transition-colors">Subjects</a>
              <a href="#" className="hover:text-white transition-colors">AI-Agents</a>
              <a href="#" className="hover:text-white transition-colors">About</a>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm8 0a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1v-2z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            PDF Quiz Generator
          </h1>
          <p className="text-xl text-white/70">
            Upload a document and generate downloadable quiz PDFs
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-2xl p-6 mb-8 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-lg">❌</span>
              </div>
              <div>
                <p className="text-red-200 text-lg font-semibold">Generation Failed</p>
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Cards Container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Quiz Generator Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zM3 4a1 1 0 011-1h12a1 1 0 011 1v8a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 4v4h10V8H5z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-white">Quiz Details</h2>
            </div>

            <form onSubmit={handleGenerateQuiz} className="space-y-6">
              <div>
                <label htmlFor="data" className="block text-sm font-medium text-white/90 mb-3">
                  Document File
                </label>
                <input
                  type="file"
                  id="data"
                  name="data"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white file:bg-purple-600 file:border-0 file:text-white file:px-4 file:py-2 file:rounded-lg file:mr-4 hover:file:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                {!formData.data && (
                  <p className="text-white/50 text-xs mt-1">No file chosen</p>
                )}
              </div>

              <div>
                <label htmlFor="numQuestions" className="block text-sm font-medium text-white/90 mb-3">
                  Number of Questions
                </label>
                <input
                  type="number"
                  id="numQuestions"
                  name="numQuestions"
                  min="1"
                  max="20"
                  value={formData.numQuestions}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label htmlFor="difficulty" className="block text-sm font-medium text-white/90 mb-3">
                  Difficulty Level
                </label>
                <select
                  id="difficulty"
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="easy" className="bg-gray-800">Easy</option>
                  <option value="medium" className="bg-gray-800">Medium</option>
                  <option value="hard" className="bg-gray-800">Hard</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
                  isLoading
                    ? 'bg-gray-500/50 cursor-not-allowed text-white/50'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating Quiz...
                  </div>
                ) : (
                  '🎯 Generate Quiz'
                )}
              </button>
            </form>
          </div>

          {/* Preview Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-white">Preview & Download</h2>
            </div>

            {quizData ? (
              <div className="space-y-6">
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                  <h3 className="text-white font-semibold mb-2">Quiz Generated!</h3>
                  <p className="text-white/70 text-sm mb-2">
                    Questions: {quizData.quiz?.length || 0} | 
                    Difficulty: {quizData.difficulty?.toUpperCase()}
                  </p>
                  <p className="text-white/50 text-xs">Source: {quizData.fileName}</p>
                </div>

                <button
                  onClick={downloadQuizPDF}
                  className="w-full py-3 px-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  📄 Download Quiz PDF
                </button>

                <div className="text-center">
                  <p className="text-white/50 text-xs">
                    The PDF will include questions, multiple choice options, and an answer sheet
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/10">
                  <svg className="w-10 h-10 text-white/70" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zM3 4a1 1 0 011-1h12a1 1 0 011 1v8a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 4v4h10V8H5z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-white/70 text-sm">
                  Generate a quiz first to see the preview and download options
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}
