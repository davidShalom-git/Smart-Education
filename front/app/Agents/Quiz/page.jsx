'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import jsPDF from 'jspdf';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoute from '../../Component/Protected';

export default function QuizGeneratorPage() {
  const [formData, setFormData] = useState({
    data: null,
    numQuestions: '5',
    difficulty: 'medium'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [quizData, setQuizData] = useState(null);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  // Interactive quiz state
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const WEBHOOK_URL = '/api/proxy/quiz';

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
    setStatus('Sending file to AI...');
    setQuizData(null);
    // Reset interactive state
    setUserAnswers({});
    setSubmitted(false);
    setScore(0);

    try {
      if (!formData.data) throw new Error('Please select a file first');

      const data = new FormData();
      data.append('data', formData.data);
      data.append('numQuestions', formData.numQuestions);
      data.append('difficulty', formData.difficulty);

      const res = await fetch(WEBHOOK_URL, {
        method: 'POST',
        body: data
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to generate quiz: ${errorText}`);
      }

      const result = await res.json();

      if (result.success && result.quiz) {
        setQuizData({
          quiz: result.quiz,
          title: `Generated Quiz (${formData.difficulty})`,
          difficulty: formData.difficulty,
          fileName: formData.data.name
        });
        toast.success('🎉 Quiz Generated Successfully!');
      } else {
        throw new Error('Failed to generate quiz');
      }

    } catch (err) {
      console.error(err);
      setError(err.message);
      toast.error(`Error: ${err.message}`);
    } finally {
      setIsLoading(false);
      setStatus('');
    }
  };

  const handleOptionSelect = (questionIndex, optionIndex) => {
    if (submitted) return;
    setUserAnswers({
      ...userAnswers,
      [questionIndex]: optionIndex + 1
    });
  };

  const calculateScore = () => {
    let currentScore = 0;
    quizData.quiz.forEach((q, i) => {
      if (userAnswers[i] === q.correctAnswer) {
        currentScore++;
      }
    });
    setScore(currentScore);
    setSubmitted(true);
    toast.info(`You scored ${currentScore} out of ${quizData.quiz.length}!`);
  };

  const handleReset = () => {
    setUserAnswers({});
    setSubmitted(false);
    setScore(0);
  };

  const downloadQuizPDF = () => {
    if (!quizData) return;

    try {
      const doc = new jsPDF();
      const margin = 20;
      let y = 20;

      doc.setFontSize(20);
      doc.text('AI Generated Quiz', 105, y, { align: 'center' });
      y += 15;

      doc.setFontSize(12);
      doc.text(`Title: ${quizData.title}`, margin, y);
      y += 10;
      doc.text(`Difficulty: ${quizData.difficulty}`, margin, y);
      y += 15;

      doc.setFontSize(11);
      quizData.quiz.forEach((q, i) => {
        const questionText = `${i + 1}. ${q.question}`;
        const splitQuestion = doc.splitTextToSize(questionText, 170);

        if (y + (splitQuestion.length * 7) > 270) {
          doc.addPage();
          y = 20;
        }

        doc.text(splitQuestion, margin, y);
        y += (splitQuestion.length * 7) + 5;

        if (q.options && Array.isArray(q.options)) {
          q.options.forEach((opt, idx) => {
            const optionText = `   ${String.fromCharCode(65 + idx)}) ${opt}`;
            const splitOption = doc.splitTextToSize(optionText, 160);

            if (y + (splitOption.length * 7) > 280) {
              doc.addPage();
              y = 20;
            }

            doc.text(splitOption, margin, y);
            y += (splitOption.length * 7) + 2;
          });
        }
        y += 5;
      });

      doc.addPage();
      y = 20;
      doc.setFontSize(16);
      doc.text('Answer Key', 105, y, { align: 'center' });
      y += 15;
      doc.setFontSize(11);

      quizData.quiz.forEach((q, i) => {
        const answerText = `${i + 1}. Option ${String.fromCharCode(65 + (q.correctAnswer - 1))}`;
        const explanationText = q.explanation ? ` - ${q.explanation}` : '';
        const fullAnswer = answerText + explanationText;

        const splitAnswer = doc.splitTextToSize(fullAnswer, 170);

        if (y + (splitAnswer.length * 7) > 280) {
          doc.addPage();
          y = 20;
        }

        doc.text(splitAnswer, margin, y);
        y += (splitAnswer.length * 7) + 5;
      });

      doc.save('generated-quiz.pdf');
      toast.success('PDF Downloaded!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate PDF');
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen text-white p-4 md:p-12">
        <ToastContainer theme="dark" position="top-right" />

        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent mb-4">
              AI Quiz Generator
            </h1>
            <p className="text-xl text-gray-400">
              Upload notes (PDF/TXT), get an instant quiz. Powered by AI.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
              <form onSubmit={handleGenerateQuiz} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Upload Document (PDF/TXT)</label>
                  <input
                    type="file"
                    name="data"
                    accept=".pdf,.txt"
                    onChange={handleInputChange}
                    className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-500 file:text-white hover:file:bg-purple-600 cursor-pointer"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Questions</label>
                    <select
                      name="numQuestions"
                      value={formData.numQuestions}
                      onChange={handleInputChange}
                      className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white"
                    >
                      <option value="5">5 Questions</option>
                      <option value="10">10 Questions</option>
                      <option value="15">15 Questions</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Difficulty</label>
                    <select
                      name="difficulty"
                      value={formData.difficulty}
                      onChange={handleInputChange}
                      className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !formData.data}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-lg hover:shadow-lg hover:from-purple-500 hover:to-pink-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                      {status || 'Processing...'}
                    </>
                  ) : ' Generate Quiz'}
                </button>

                {error && (
                  <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm">
                    {error}
                  </div>
                )}
              </form>
            </div>

            {/* Result Preview */}
            <div className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col ${!quizData ? 'items-center justify-center text-center opacity-50' : ''}`}>
              {quizData ? (
                <div className="w-full h-full flex flex-col">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center text-xl">
                        ✅
                      </div>
                      <h2 className="text-2xl font-bold">Quiz Time!</h2>
                    </div>
                    {submitted && (
                      <div className="text-xl font-bold bg-white/20 px-4 py-2 rounded-xl">
                        Score: <span className={score === quizData.quiz.length ? "text-green-400" : "text-yellow-400"}>{score}</span> / {quizData.quiz.length}
                      </div>
                    )}
                  </div>

                  <div className="bg-black/20 rounded-xl p-4 mb-6 text-left flex-1 overflow-y-auto max-h-[500px]">
                    <h3 className="font-bold text-purple-400 mb-6 text-lg border-b border-white/10 pb-2">{quizData.title}</h3>

                    <div className="space-y-8">
                      {quizData.quiz.map((q, i) => (
                        <div key={i} className="space-y-3">
                          <p className="font-medium text-white text-lg">
                            <span className="text-purple-400 font-bold mr-2">{i + 1}.</span>
                            {q.question}
                          </p>

                          <div className="space-y-2 pl-4">
                            {q.options.map((opt, idx) => {
                              const optionId = idx + 1;
                              const isSelected = userAnswers[i] === optionId;
                              const isCorrect = q.correctAnswer === optionId;

                              let optionClass = "p-3 rounded-lg border cursor-pointer transition-all flex items-center gap-3 ";

                              if (submitted) {
                                if (isCorrect) optionClass += "bg-green-500/20 border-green-500 text-green-200";
                                else if (isSelected && !isCorrect) optionClass += "bg-red-500/20 border-red-500 text-red-200";
                                else optionClass += "bg-white/5 border-white/10 text-gray-400 opacity-50";
                              } else {
                                if (isSelected) optionClass += "bg-purple-500/40 border-purple-500 text-white";
                                else optionClass += "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10";
                              }

                              return (
                                <div
                                  key={idx}
                                  onClick={() => handleOptionSelect(i, idx)}
                                  className={optionClass}
                                >
                                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isSelected || (submitted && isCorrect) ? 'border-current' : 'border-gray-500'}`}>
                                    {(isSelected || (submitted && isCorrect)) && (
                                      <div className="w-3 h-3 rounded-full bg-current" />
                                    )}
                                  </div>
                                  <span>{opt}</span>
                                </div>
                              );
                            })}
                          </div>

                          {submitted && q.explanation && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="mt-2 text-sm text-gray-400 bg-white/5 p-3 rounded-lg ml-4 border-l-2 border-purple-500"
                            >
                              <span className="font-bold text-purple-400">Explanation:</span> {q.explanation}
                            </motion.div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {!submitted ? (
                      <button
                        onClick={calculateScore}
                        disabled={Object.keys(userAnswers).length !== quizData.quiz.length}
                        className="py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-white"
                      >
                        Submit Answers
                      </button>
                    ) : (
                      <button
                        onClick={handleReset}
                        className="py-3 bg-gray-600 rounded-xl font-bold hover:bg-gray-700 transition-colors text-white"
                      >
                        Try Again
                      </button>
                    )}

                    <button
                      onClick={downloadQuizPDF}
                      className="py-3 bg-white text-purple-900 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                    >
                      Download PDF
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-4">
                    <span className="text-4xl">📄</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No Quiz Generated Yet</h3>
                  <p className="text-gray-400">Upload a file and hit generate to see the magic happen.</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
