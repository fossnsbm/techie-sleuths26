"use client";

import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { useState, useEffect } from "react";
import { getTrailOfShadowsProgress, submitTrailOfShadowsAnswer } from "@/app/actions/trail-of-shadows";
import { toast } from "sonner";

interface Question {
  id: number;
  title: string;
  description: string;
  points: number;
  isAnswered: boolean;
  pointsEarned: number;
}

export default function GamePage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [questionsCompleted, setQuestionsCompleted] = useState(0);
  const [totalQuestions] = useState(10);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch questions and progress on mount
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const progress = await getTrailOfShadowsProgress();
      setQuestions(progress.questions);
      setQuestionsCompleted(progress.questionsCompleted);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  const handleSubmit = async () => {
    if (!selectedQuestion || !inputValue.trim() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const result = await submitTrailOfShadowsAnswer(selectedQuestion.id, inputValue);

      if (result.success) {
        if (result.isCorrect) {
          toast.success("Correct!", {
            description: result.message
          });
          
          // Update the questions list to mark this one as answered
          setQuestions(prev => prev.map(q => 
            q.id === selectedQuestion.id 
              ? { ...q, isAnswered: true, pointsEarned: result.pointsAwarded || 0 }
              : q
          ));
          setQuestionsCompleted(prev => prev + 1);
          
          setInputValue("");
          setSelectedQuestion(null);
        } else {
          toast.error("Incorrect", {
            description: result.message
          });
        }
      } else {
        if (result.alreadyCorrect) {
          toast.info("Already answered", {
            description: result.message
          });
          setInputValue("");
          setSelectedQuestion(null);
        } else {
          toast.error("Submission failed", {
            description: result.message
          });
        }
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
      toast.error("Error", {
        description: "An unexpected error occurred"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen text-white site-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-[#c87838] border-r-transparent mb-4"></div>
          <p className="text-[#f5e6c8] text-lg">Loading mysteries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white site-background">
      <div className="pt-20 pb-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal className="text-center mb-16">
            <h1 className="text-[clamp(1.6rem,6vw,3rem)] font-extrabold uppercase tracking-[0.08em] text-[#f5e6c8] mb-4">Trail of Shadows</h1>
            <p className="text-xl text-[#c4a07a] font-semibold mb-2">Find the Clues, Solve the Puzzle</p>
            <p className="text-lg text-gray-300 mb-4">Embark on a Sherlock Holmes-inspired mystery adventure. Each case holds secrets waiting to be unveiled.</p>
            
            {/* Progress Indicator */}
            <div className="inline-block bg-[rgba(200,120,60,0.15)] border border-[rgba(200,120,60,0.3)] rounded-lg px-6 py-3">
              <p className="text-sm font-bold uppercase tracking-[0.08em] text-[#c4a07a]">
                {questionsCompleted}/{totalQuestions} Mysteries Solved
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {questions.map((question, index) => (
              <ScrollReveal key={question.id} delayMs={index * 80}>
                <div className="group relative cursor-pointer transition-all duration-300 hover:-translate-y-3">
                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-600/20 to-orange-600/20 rounded-lg opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300 -z-10" />
                  
                  {/* Card */}
                  <div className="relative flex flex-col h-96 border-2 border-[rgba(200,120,60,0.3)] bg-[rgba(30,12,5,0.85)] backdrop-blur-sm p-6 rounded-lg transition-all duration-300 group-hover:border-[rgba(200,120,60,0.6)] group-hover:bg-[rgba(40,20,10,0.95)]">
                    
                    {/* Decorative corner */}
                    <div className="absolute top-3 left-3 w-2 h-2 bg-[#f5e6c8] opacity-60" />
                    <div className="absolute bottom-3 right-3 w-2 h-2 bg-[#f5e6c8] opacity-60" />
                    
                    {/* Mystery number */}
                    <div className="mb-6 flex items-center justify-between flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-amber-700 rounded-full flex items-center justify-center text-xl font-bold text-white shadow-lg group-hover:shadow-amber-600/50">
                        {question.id}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 mb-4 overflow-hidden">
                      <h3 className="text-sm font-bold uppercase tracking-[0.08em] text-[#f5e6c8] mb-3 line-clamp-2 group-hover:text-amber-300 transition-colors h-9">
                        {question.title}
                      </h3>
                      <p className="text-xs leading-relaxed text-[#c4a07a] line-clamp-4">
                        {question.description}
                      </p>
                    </div>

                    {/* Action button */}
                    <div className="pt-4 border-t border-[rgba(200,120,60,0.2)] flex-shrink-0">
                      <button 
                        onClick={() => setSelectedQuestion(question)}
                        className={`w-full py-2.5 px-4 text-xs font-bold uppercase tracking-widest rounded-lg border transition-all duration-300 ${
                          question.isAnswered
                            ? "text-white bg-gradient-to-r from-green-700 to-emerald-700 hover:from-green-600 hover:to-emerald-600 border-green-600 shadow-lg shadow-green-600/30"
                            : "text-[#f5e6c8] bg-gradient-to-r from-amber-700/30 to-orange-700/30 hover:from-amber-600/60 hover:to-orange-600/60 border-amber-600/30 hover:border-amber-600/60 group-hover:shadow-lg group-hover:shadow-amber-600/30"
                        }`}
                      >
                        {question.isAnswered ? "Investigated" : "Investigate"}
                      </button>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>

      {/* Modal Popup */}
      {selectedQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <style>{`
            @keyframes popupSlideIn {
              0% {
                opacity: 0;
                transform: scale(0.85) translateY(-20px);
              }
              50% {
                transform: scale(1.02);
              }
              100% {
                opacity: 1;
                transform: scale(1) translateY(0);
              }
            }
            
            @keyframes popupFadeIn {
              0% { opacity: 0; }
              100% { opacity: 1; }
            }
            
            @keyframes contentSlideUp {
              0% {
                opacity: 0;
                transform: translateY(10px);
              }
              100% {
                opacity: 1;
                transform: translateY(0);
              }
            }
            
            .modal-popup {
              animation: popupSlideIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
            }
            
            .modal-backdrop {
              animation: popupFadeIn 0.3s ease-out;
            }
            
            .modal-content > div {
              animation: contentSlideUp 0.4s ease-out;
              animation-fill-mode: both;
            }
            
            .modal-content > div:nth-child(1) { animation-delay: 0.1s; }
            .modal-content > div:nth-child(2) { animation-delay: 0.2s; }
            .modal-content > div:nth-child(3) { animation-delay: 0.3s; }
            .modal-content > div:nth-child(4) { animation-delay: 0.4s; }
          `}</style>

          {/* Backdrop */}
          <div 
            className="modal-backdrop fixed inset-0 bg-black/50 backdrop-blur-sm -z-10" 
            onClick={() => {
              setSelectedQuestion(null);
              setInputValue("");
            }}
          />
          
          <div className="relative modal-popup bg-gradient-to-br from-[#2a1a0a] to-[#1a0a02] border-2 border-[rgba(200,120,60,0.4)] rounded-lg p-12 max-w-sm w-full shadow-2xl shadow-amber-600/40">
            
            {/* Decorative corners */}
            <div className="absolute top-4 left-4 w-3 h-3 bg-[#f5e6c8]" />
            <div className="absolute top-4 right-4 w-3 h-3 bg-[#f5e6c8]" />
            <div className="absolute bottom-4 left-4 w-3 h-3 bg-[#f5e6c8]" />
            <div className="absolute bottom-4 right-4 w-3 h-3 bg-[#f5e6c8]" />
            
            {/* Close button */}
            <button 
              onClick={() => {
                setSelectedQuestion(null);
                setInputValue("");
              }}
              className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center text-[#f5e6c8] hover:text-amber-300 transition-colors transform hover:scale-110"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Content */}
            <div className="text-center modal-content">
              {/* Mystery number badge */}
              <div className="mb-6 flex justify-center">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-600 to-amber-700 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg transform hover:scale-110 transition-transform duration-300">
                  {selectedQuestion.id}
                </div>
              </div>

              {/* Main message */}
              <div>
                <h2 className="text-2xl font-extrabold uppercase tracking-[0.1em] text-[#f5e6c8] mb-2">
                  Trail of Shadows
                </h2>
              </div>
              
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.08em] text-[#c4a07a] mb-8">
                  {selectedQuestion.title}
                </p>
              </div>

              {/* QR Instruction */}
              <div className="bg-[rgba(200,120,60,0.15)] border-l-4 border-amber-600 pl-4 py-4 mb-6 text-left">
                <p className="text-lg font-extrabold uppercase tracking-[0.08em] text-[#f5e6c8]">
                  Find and Scan QR Code
                </p>
              </div>

              {/* Text Input Area */}
              <div className="mb-6">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !isSubmitting) {
                      handleSubmit();
                    }
                  }}
                  placeholder="Enter Answer"
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 bg-[rgba(200,120,60,0.1)] border-2 border-[rgba(200,120,60,0.3)] focus:border-amber-600 rounded-lg text-[#f5e6c8] placeholder-gray-500 focus:outline-none transition-all duration-300 uppercase tracking-widest font-semibold disabled:opacity-50"
                />
              </div>

              {/* Cancel and Submit Buttons */}
              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    setInputValue("");
                    setSelectedQuestion(null);
                  }}
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-4 text-xs font-bold uppercase tracking-widest text-[#f5e6c8] bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 rounded-lg border border-gray-600 transition-all duration-300 shadow-lg shadow-gray-600/30 hover:shadow-gray-600/50 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSubmit}
                  disabled={isSubmitting || !inputValue.trim()}
                  className="flex-1 py-3 px-4 text-xs font-bold uppercase tracking-widest text-white bg-gradient-to-r from-amber-700 to-orange-700 hover:from-amber-600 hover:to-orange-600 rounded-lg border border-amber-600 transition-all duration-300 shadow-lg shadow-amber-600/30 hover:shadow-amber-600/50 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
