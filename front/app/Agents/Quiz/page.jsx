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
  const [debugInfo, setDebugInfo] = useState('');

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
    setError('');
    setDebugInfo('');
    
    try {
      // Validate file before sending
      if (!formData.data) {
        throw new Error('Please select a document file before generating the quiz');
      }

      // Check file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
      ];
      
      if (!allowedTypes.includes(formData.data.type) && !formData.data.name.match(/\.(pdf|doc|docx|txt)$/i)) {
        throw new Error('Please select a valid document file (PDF, DOC, DOCX, or TXT)');
      }

      // Check file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (formData.data.size > maxSize) {
        throw new Error('File size too large. Please select a file smaller than 10MB');
      }

      const formDataToSend = new FormData();
      formDataToSend.append('data', formData.data);
      formDataToSend.append('numQuestions', formData.numQuestions);
      formDataToSend.append('difficulty', formData.difficulty);

      console.log('🚀 Sending request to:', WEBHOOK_URL);
      console.log('📁 File:', formData.data.name, '(', (formData.data.size / 1024).toFixed(2), 'KB)');
      console.log('🎯 Parameters:', { numQuestions: formData.numQuestions, difficulty: formData.difficulty });

      setDebugInfo('Uploading file to N8N webhook...');
      
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        body: formDataToSend
      });

      console.log('📡 Response status:', response.status);
      console.log('📋 Response headers:', Object.fromEntries(response.headers.entries()));

      // Handle 500 Internal Server Error specifically
      if (response.status === 500) {
        setDebugInfo('Received 500 Internal Server Error from N8N');
        
        let errorDetails;
        try {
          const errorText = await response.text();
          console.log('💥 500 Error Response:', errorText);
          
          // Try to parse JSON error response
          try {
            const errorJson = JSON.parse(errorText);
            errorDetails = errorJson.message || errorJson.error || errorText;
          } catch {
            errorDetails = errorText;
          }
        } catch {
          errorDetails = 'No error details available';
        }

        throw new Error(`N8N Workflow Error (500): ${errorDetails.substring(0, 200)}${errorDetails.length > 200 ? '...' : ''}`);
      }

      // Handle other HTTP errors
      if (!response.ok) {
        const errorText = await response.text();
        console.log(`💥 HTTP ${response.status} Error:`, errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText.substring(0, 100)}`);
      }

      setDebugInfo('Processing N8N response...');
      const result = await response.json();
      console.log('📋 N8N Response:', result);

      // Handle N8N-specific error responses
      if (result.success === false) {
        const errorMsg = result.error || result.errorMessage || 'Unknown N8N workflow error';
        console.log('❌ N8N Workflow Failed:', errorMsg);
        throw new Error(`N8N Workflow Failed: ${errorMsg}`);
      }

      // Parse quiz data from response
      let extractedQuizData = null;

      if (result.rawGeminiResponse?.content?.[0]?.parts?.[0]?.text) {
        console.log('🧠 Processing Gemini Response...');
        setDebugInfo('Extracting quiz from AI response...');
        
        const geminiText = result.rawGeminiResponse.content[0].parts[0].text;
        const jsonPattern = /``````/i;
        const jsonMatch = geminiText.match(jsonPattern);
        
        if (jsonMatch && jsonMatch[1]) {
          try {
            const parsedQuiz = JSON.parse(jsonMatch[1].trim());
            if (parsedQuiz.quiz && Array.isArray(parsedQuiz.quiz) && parsedQuiz.quiz.length > 0) {
              extractedQuizData = {
                quiz: parsedQuiz.quiz,
                difficulty: formData.difficulty,
                numQuestions: parsedQuiz.quiz.length,
                fileName: formData.data.name
              };
            } else {
              throw new Error('AI generated invalid quiz structure');
            }
          } catch (parseError) {
            console.error('💥 Quiz Parse Error:', parseError);
            throw new Error(`Failed to parse AI-generated quiz: ${parseError.message}`);
          }
        } else {
          throw new Error('AI response does not contain valid quiz JSON');
        }
      } else if (result.quiz && Array.isArray(result.quiz)) {
        // Direct quiz response
        extractedQuizData = {
          quiz: result.quiz,
          difficulty: formData.difficulty,
          numQuestions: result.quiz.length,
          fileName: formData.data.name
        };
      } else {
        console.error('🚨 Unexpected response structure:', result);
        throw new Error('Invalid response format from N8N webhook');
      }

      if (!extractedQuizData || !extractedQuizData.quiz || extractedQuizData.quiz.length === 0) {
        throw new Error('No quiz questions were generated. Try a different document or check your N8N workflow.');
      }

      console.log('🎉 Successfully generated quiz with', extractedQuizData.quiz.length, 'questions');
      setQuizData(extractedQuizData);
      setDebugInfo(`Quiz generated successfully with ${extractedQuizData.quiz.length} questions`);
      
      toast.success(`🎉 Quiz generated! ${extractedQuizData.quiz.length} questions ready for download.`, {
        position: "top-right",
        autoClose: 5000,
      });

    } catch (error) {
      console.error('💥 Quiz Generation Error:', error);
      const errorMessage = error.message || 'Unknown error occurred';
      setError(errorMessage);
      setDebugInfo(`Error: ${errorMessage}`);
      
      // Different toast messages for different error types
      if (errorMessage.includes('500')) {
        toast.error(`🚫 N8N Server Error: Check your workflow configuration in N8N`, {
          position: "top-right",
          autoClose: 10000,
        });
      } else if (errorMessage.includes('file')) {
        toast.error(`📁 File Error: ${errorMessage}`, {
          position: "top-right",
          autoClose: 8000,
        });
      } else {
        toast.error(`❌ Generation Failed: ${errorMessage}`, {
          position: "top-right",
          autoClose: 8000,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const testWebhookConnection = async () => {
    try {
      setDebugInfo('Testing webhook connection...');
      
      // Send a simple test request
      const testResponse = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ test: 'connection' })
      });

      console.log('🧪 Test Response Status:', testResponse.status);
      
      if (testResponse.status === 500) {
        setDebugInfo('❌ Webhook returns 500 error - Check your N8N workflow');
        toast.error('N8N Webhook is returning 500 errors. Check your workflow configuration.', {
          position: "top-right",
          autoClose: 8000,
        });
      } else {
        setDebugInfo(`✅ Webhook responding with status ${testResponse.status}`);
        toast.success(`Webhook is responding (Status: ${testResponse.status})`, {
          position: "top-right",
          autoClose: 5000,
        });
      }
    } catch (error) {
      setDebugInfo(`❌ Connection test failed: ${error.message}`);
      toast.error(`Connection test failed: ${error.message}`, {
        position: "top-right",
        autoClose: 8000,
      });
    }
  };

  const downloadQuizPDF = async () => {
    if (!quizData || !quizData.quiz || quizData.quiz.length === 0) {
      toast.error('❌ No quiz data available to download', {
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
      doc.text('AI Generated Quiz', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 15;

      // Add quiz info
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Source: ${quizData.fileName}`, margin, yPosition);
      yPosition += lineHeight;
      doc.text(`Difficulty: ${quizData.difficulty?.toUpperCase() || 'MEDIUM'}`, margin, yPosition);
      yPosition += lineHeight;
      doc.text(`Total Questions: ${quizData.quiz.length}`, margin, yPosition);
      yPosition += lineHeight;
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, margin, yPosition);
      yPosition += 15;

      // Add questions
      doc.setFont('helvetica', 'normal');
      quizData.quiz.forEach((question, index) => {
        if (yPosition > pageHeight - 80) {
          doc.addPage();
          yPosition = margin;
        }

        // Question
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        const questionText = `${index + 1}. ${question.question || 'Question missing'}`;
        const splitQuestion = doc.splitTextToSize(questionText, pageWidth - 2 * margin);
        doc.text(splitQuestion, margin, yPosition);
        yPosition += lineHeight * splitQuestion.length + 3;

        // Options
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        if (question.options && Array.isArray(question.options)) {
          question.options.forEach((option, optionIndex) => {
            if (option) {
              const optionLetter = String.fromCharCode(65 + optionIndex);
              const optionText = `   ${optionLetter}) ${option}`;
              doc.text(optionText, margin + 5, yPosition);
              yPosition += lineHeight;
            }
          });
        }
        yPosition += 8;
      });

      // Save PDF
      const fileName = `${quizData.fileName.replace(/\.[^/.]+$/, '')}_Quiz_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      
      toast.success('📄 Quiz PDF downloaded successfully!', {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error('💥 PDF Error:', error);
      toast.error('❌ Failed to generate PDF', {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Background and Navigation remain the same */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute -bottom-20 left-40 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
      </div>

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

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            PDF Quiz Generator
          </h1>
          <p className="text-xl text-white/70">
            Upload a document and generate downloadable quiz PDFs with AI
          </p>
          
          {/* Test Connection Button */}
          <div className="mt-6">
            <button
              onClick={testWebhookConnection}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              🔧 Test Webhook
            </button>
          </div>
        </div>

        {/* Debug Info */}
        {debugInfo && (
          <div className="bg-blue-500/20 border border-blue-500/50 rounded-2xl p-4 mb-8">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">ℹ️</span>
              </div>
              <p className="text-blue-200 text-sm">{debugInfo}</p>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-2xl p-6 mb-8">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-lg">❌</span>
              </div>
              <div>
                <p className="text-red-200 text-lg font-semibold">Generation Failed</p>
                <p className="text-red-300 text-sm mb-2">{error}</p>
                {error.includes('500') && (
                  <div className="bg-red-600/20 rounded-lg p-3 mt-3">
                    <p className="text-red-200 text-xs font-semibold mb-1">🔧 N8N Troubleshooting:</p>
                    <ul className="text-red-300 text-xs space-y-1">
                      <li>• Check if your N8N workflow is active</li>
                      <li>• Verify webhook URL is correct</li>
                      <li>• Check N8N execution logs for detailed errors</li>
                      <li>• Ensure all required nodes are properly configured</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Form and Preview Cards remain the same structure */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                  Document File *
                </label>
                <input
                  type="file"
                  id="data"
                  name="data"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white file:bg-purple-600 file:border-0 file:text-white file:px-4 file:py-2 file:rounded-lg file:mr-4 hover:file:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                {formData.data ? (
                  <div className="mt-2 p-2 bg-green-500/20 rounded-lg">
                    <p className="text-green-400 text-sm">✅ {formData.data.name}</p>
                    <p className="text-green-500 text-xs">Size: {(formData.data.size / 1024).toFixed(2)} KB</p>
                  </div>
                ) : (
                  <p className="text-white/50 text-xs mt-1">Select PDF, DOC, DOCX, or TXT file (max 10MB)</p>
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
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                disabled={isLoading || !formData.data}
                className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
                  isLoading || !formData.data
                    ? 'bg-gray-500/50 cursor-not-allowed text-white/50'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"></div>
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
                  <h3 className="text-white font-semibold mb-2">✅ Quiz Generated Successfully!</h3>
                  <p className="text-white/70 text-sm mb-2">
                    Questions: <span className="text-green-400 font-semibold">{quizData.quiz.length}</span> | 
                    Difficulty: <span className="text-blue-400 font-semibold">{quizData.difficulty.toUpperCase()}</span>
                  </p>
                  <p className="text-white/50 text-xs">Source: {quizData.fileName}</p>
                </div>

                <button
                  onClick={downloadQuizPDF}
                  className="w-full py-3 px-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  📄 Download Quiz PDF
                </button>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/10">
                  <svg className="w-10 h-10 text-white/70" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zM3 4a1 1 0 011-1h12a1 1 0 011 1v8a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 4v4h10V8H5z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-white/70 text-sm mb-2">Ready to generate your quiz</p>
                <p className="text-white/50 text-xs">Upload a document and click Generate Quiz</p>
              </div>
            )}
          </div>
        </div>
      </div>

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
