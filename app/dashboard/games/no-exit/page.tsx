"use client";

import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getNoExitProgress, submitNoExitAnswer } from "@/app/actions/no-exit";

interface CTFChallenge {
  id: number;
  title: string;
  description: string;
  points: number;
  attachmentUrl: string | null;
  isAnswered: boolean;
  pointsEarned: number;
}

export default function NoExitPage() {
  const [challenges, setChallenges] = useState<CTFChallenge[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<CTFChallenge | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [challengesCompleted, setChallengesCompleted] = useState(0);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const progress = await getNoExitProgress();
      setChallenges(progress.challenges);
      setChallengesCompleted(progress.challengesCompleted);
      setIsLoading(false);
    }

    fetchData();
  }, []);

  const handleSubmit = async () => {
    if (!selectedChallenge || !inputValue.trim() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const result = await submitNoExitAnswer(selectedChallenge.id, inputValue);

      if (result.success) {
        if (result.isCorrect) {
          toast.success("Correct!", {
            description: result.message,
          });

          setChallenges((prev) =>
            prev.map((challenge) =>
              challenge.id === selectedChallenge.id
                ? {
                  ...challenge,
                  isAnswered: true,
                  pointsEarned: result.pointsAwarded || 0,
                }
                : challenge
            )
          );
          setChallengesCompleted((prev) => prev + 1);
          setInputValue("");
          setSelectedChallenge(null);
        } else {
          toast.error("Incorrect", {
            description: result.message,
          });
        }
      } else if (result.alreadyCorrect) {
        toast.info("Already solved", {
          description: result.message,
        });
        setInputValue("");
        setSelectedChallenge(null);
      } else {
        toast.error("Submission failed", {
          description: result.message,
        });
      }
    } catch (error) {
      console.error("Error submitting no exit answer:", error);
      toast.error("Error", {
        description: "An unexpected error occurred",
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
          <p className="text-[#f5e6c8] text-lg">Loading challenges...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white site-background">
      <div className="pt-20 pb-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal className="text-center mb-16">
            <h1 className="text-[clamp(1.6rem,6vw,3rem)] font-extrabold uppercase tracking-[0.08em] text-[#f5e6c8] mb-4">NO EXIT</h1>
            <p className="text-xl text-[#c4a07a] font-semibold mb-2">It's about Challenges, Find the Hidden Keys</p>
            <p className="text-lg text-gray-300 mb-4">Decrypt, Solve, Escape</p>
            <div className="inline-block bg-[rgba(200,120,60,0.15)] border border-[rgba(200,120,60,0.3)] rounded-lg px-6 py-3">
              <p className="text-sm font-bold uppercase tracking-[0.08em] text-[#c4a07a]">
                {challengesCompleted}/3 Challenges Solved
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map((challenge, index) => (
              <ScrollReveal key={challenge.id} delayMs={index * 80}>
                <div className="group relative cursor-pointer transition-all duration-300 hover:-translate-y-3">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-600/20 to-orange-600/20 rounded-lg opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300 -z-10" />

                  <div className="relative flex flex-col h-96 border-2 border-[rgba(200,120,60,0.3)] bg-[rgba(30,12,5,0.85)] backdrop-blur-sm p-6 rounded-lg transition-all duration-300 group-hover:border-[rgba(200,120,60,0.6)] group-hover:bg-[rgba(40,20,10,0.95)] font-mono">
                    <div className="mb-6 pb-3 border-b border-[rgba(200,120,60,0.2)]">
                      <p className="text-xs text-[#c4a07a] mb-2">-rw-r--r-- 1 user ctf</p>
                      <h3 className="text-sm font-bold text-[#f5e6c8] break-words">{challenge.title}</h3>
                      <p className="text-xs text-gray-500 mt-2">{challenge.points} points</p>
                    </div>

                    <div className="flex-1 mb-4 overflow-hidden">
                      <div className="space-y-2">
                        <p className="text-xs text-[#c4a07a] line-clamp-3">$ cat {challenge.title}</p>
                        <p className="text-xs leading-relaxed text-gray-400 line-clamp-4 pl-2 border-l-2 border-amber-600/50">
                          {challenge.description}
                        </p>
                        {challenge.attachmentUrl && (
                          <a
                            href={challenge.attachmentUrl}
                            download={true}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-block mt-2 text-xs text-amber-300 hover:text-amber-200 underline"
                          >
                            Download attachment
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-[rgba(200,120,60,0.2)]">
                      <span className="text-xs font-bold uppercase tracking-widest text-[#c4a07a]">
                        [{challenge.points} PTS]
                      </span>
                      <button
                        onClick={() => setSelectedChallenge(challenge)}
                        className={`py-2 px-3 text-xs font-bold uppercase tracking-widest rounded border transition-all duration-300 ${challenge.isAnswered
                          ? "text-white bg-gradient-to-r from-green-700 to-emerald-700 hover:from-green-600 hover:to-emerald-600 border-green-600 shadow-lg shadow-green-600/30"
                          : "text-[#f5e6c8] bg-gradient-to-r from-amber-700/30 to-orange-700/30 hover:from-amber-600/60 hover:to-orange-600/60 border-amber-600/30 hover:border-amber-600/60"
                          }`}
                      >
                        {challenge.isAnswered ? "Done" : "Run"}
                      </button>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>

      {selectedChallenge && (
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

          <div
            className="modal-backdrop fixed inset-0 bg-black/50 backdrop-blur-sm -z-10"
            onClick={() => {
              setSelectedChallenge(null);
              setInputValue("");
            }}
          />

          <div className="relative modal-popup bg-gradient-to-br from-[#0a0a0a] to-[#1a0a02] border-2 border-[rgba(200,120,60,0.4)] rounded-lg p-8 max-w-md w-full shadow-2xl shadow-amber-600/40 font-mono">
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-[rgba(200,120,60,0.3)]">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="ml-auto text-xs text-[#c4a07a]">{selectedChallenge.title}</span>
              <button
                onClick={() => {
                  setSelectedChallenge(null);
                  setInputValue("");
                }}
                className="text-[#f5e6c8] hover:text-amber-300 transition-colors"
              >
                x
              </button>
            </div>

            <div className="text-center modal-content">
              <div>
                <p className="text-left text-xs text-[#c4a07a] mb-4 pl-2">$ ctf --challenge {selectedChallenge.id}</p>
              </div>

              <div>
                <div className="bg-[rgba(200,120,60,0.1)] border border-[rgba(200,120,60,0.2)] rounded p-3 mb-6 text-left">
                  <p className="text-xs text-[#f5e6c8] font-bold mb-2">&gt; CHALLENGE LOADED</p>
                  <p className="text-xs text-[#c4a07a]">{selectedChallenge.description}</p>
                  {selectedChallenge.attachmentUrl && (
                    <a
                      href={selectedChallenge.attachmentUrl}
                      download={true}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block mt-3 text-xs text-amber-300 hover:text-amber-200 underline"
                    >
                      Attachment
                    </a>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <p className="text-left text-xs text-[#c4a07a] mb-2">$ find_flag</p>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !isSubmitting) {
                      handleSubmit();
                    }
                  }}
                  placeholder="flag{...}"
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 bg-[rgba(200,120,60,0.1)] border border-[rgba(200,120,60,0.3)] focus:border-amber-600 rounded text-[#f5e6c8] placeholder-gray-600 focus:outline-none transition-all duration-300 text-xs font-mono disabled:opacity-50"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setInputValue("");
                    setSelectedChallenge(null);
                  }}
                  disabled={isSubmitting}
                  className="flex-1 py-2 px-3 text-xs font-bold uppercase tracking-widest text-[#f5e6c8] bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 rounded border border-gray-600 transition-all duration-300 shadow-lg shadow-gray-600/30 hover:shadow-gray-600/50 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  Exit
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !inputValue.trim()}
                  className="flex-1 py-2 px-3 text-xs font-bold uppercase tracking-widest text-white bg-gradient-to-r from-amber-700 to-orange-700 hover:from-amber-600 hover:to-orange-600 rounded border border-amber-600 transition-all duration-300 shadow-lg shadow-amber-600/30 hover:shadow-amber-600/50 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
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
