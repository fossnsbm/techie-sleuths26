"use client";

import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { useState } from "react";

interface CTFChallenge {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  fileSize: string;
}

const challenges: CTFChallenge[] = [
  { id: 1, title: "Hidden_Keys_Level1.txt", description: "Find the first hidden key concealed in cipher text. Decrypt to proceed.", difficulty: "Easy", fileSize: "2.4 KB" },
  { id: 2, title: "SecretVault_Access.txt", description: "Bypass security layers to locate the master key. Multiple obstacles await.", difficulty: "Medium", fileSize: "5.8 KB" },
  { id: 3, title: "FinalEscape_Key.txt", description: "The ultimate challenge. Find all flags and unlock the final escape sequence.", difficulty: "Hard", fileSize: "12.3 KB" },
];

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "Easy":
      return "text-green-400";
    case "Medium":
      return "text-yellow-400";
    case "Hard":
      return "text-red-400";
    default:
      return "text-gray-400";
  }
};

export default function NoExitPage() {
  const [selectedChallenge, setSelectedChallenge] = useState<CTFChallenge | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [completedChallenges, setCompletedChallenges] = useState<Set<number>>(new Set());

  return (
    <div className="min-h-screen text-white site-background">
      <div className="pt-20 pb-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal className="text-center mb-16">
            <h1 className="text-[clamp(1.6rem,6vw,3rem)] font-extrabold uppercase tracking-[0.08em] text-[#f5e6c8] mb-4">NO EXIT</h1>
            <p className="text-xl text-[#c4a07a] font-semibold mb-2">It's about Challenges, Find the Hidden Keys</p>
            <p className="text-lg text-gray-300">Decrypt, Solve, Escape</p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map((challenge, index) => (
              <ScrollReveal key={challenge.id} delayMs={index * 80}>
                <div className="group relative cursor-pointer transition-all duration-300 hover:-translate-y-3">
                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-600/20 to-orange-600/20 rounded-lg opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300 -z-10" />
                  
                  {/* File Card */}
                  <div className="relative flex flex-col h-96 border-2 border-[rgba(200,120,60,0.3)] bg-[rgba(30,12,5,0.85)] backdrop-blur-sm p-6 rounded-lg transition-all duration-300 group-hover:border-[rgba(200,120,60,0.6)] group-hover:bg-[rgba(40,20,10,0.95)] font-mono">
                    
                    {/* File Header */}
                    <div className="mb-6 pb-3 border-b border-[rgba(200,120,60,0.2)]">
                      <p className="text-xs text-[#c4a07a] mb-2">-rw-r--r-- 1 user ctf</p>
                      <h3 className="text-sm font-bold text-[#f5e6c8] break-words">
                        {challenge.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-2">{challenge.fileSize}</p>
                    </div>

                    {/* File Content */}
                    <div className="flex-1 mb-4 overflow-hidden">
                      <div className="space-y-2">
                        <p className="text-xs text-[#c4a07a] line-clamp-3">
                          $ cat {challenge.title}
                        </p>
                        <p className="text-xs leading-relaxed text-gray-400 line-clamp-4 pl-2 border-l-2 border-amber-600/50">
                          {challenge.description}
                        </p>
                      </div>
                    </div>

                    {/* Difficulty & Action */}
                    <div className="flex items-center justify-between pt-4 border-t border-[rgba(200,120,60,0.2)]">
                      <span className={`text-xs font-bold uppercase tracking-widest ${getDifficultyColor(challenge.difficulty)}`}>
                        [{challenge.difficulty}]
                      </span>
                      <button 
                        onClick={() => setSelectedChallenge(challenge)}
                        className={`py-2 px-3 text-xs font-bold uppercase tracking-widest rounded border transition-all duration-300 ${
                          completedChallenges.has(challenge.id)
                            ? "text-white bg-gradient-to-r from-green-700 to-emerald-700 hover:from-green-600 hover:to-emerald-600 border-green-600 shadow-lg shadow-green-600/30"
                            : "text-[#f5e6c8] bg-gradient-to-r from-amber-700/30 to-orange-700/30 hover:from-amber-600/60 hover:to-orange-600/60 border-amber-600/30 hover:border-amber-600/60"
                        }`}
                      >
                        {completedChallenges.has(challenge.id) ? "Done" : "Run"}
                      </button>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>

      {/* Terminal Popup */}
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
            
            .cursor-blink {
              animation: blink 1s infinite;
            }
            
            @keyframes blink {
              0%, 49% { opacity: 1; }
              50%, 100% { opacity: 0; }
            }
          `}</style>

          {/* Backdrop */}
          <div className="modal-backdrop fixed inset-0 bg-black/50 backdrop-blur-sm -z-10" />
          
          <div className="relative modal-popup bg-gradient-to-br from-[#0a0a0a] to-[#1a0a02] border-2 border-[rgba(200,120,60,0.4)] rounded-lg p-8 max-w-md w-full shadow-2xl shadow-amber-600/40 font-mono">
            
            {/* Terminal Header */}
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-[rgba(200,120,60,0.3)]">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="ml-auto text-xs text-[#c4a07a]">{selectedChallenge.title}</span>
              <button 
                onClick={() => setSelectedChallenge(null)}
                className="text-[#f5e6c8] hover:text-amber-300 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="text-center modal-content">
              {/* Terminal Output */}
              <div>
                <p className="text-left text-xs text-[#c4a07a] mb-4 pl-2">
                  $ ctf --challenge {selectedChallenge.id}
                </p>
              </div>
              
              <div>
                <div className="bg-[rgba(200,120,60,0.1)] border border-[rgba(200,120,60,0.2)] rounded p-3 mb-6 text-left">
                  <p className="text-xs text-[#f5e6c8] font-bold mb-2">&gt; CHALLENGE LOADED</p>
                  <p className="text-xs text-[#c4a07a]">{selectedChallenge.description}</p>
                </div>
              </div>

              {/* Input Area */}
              <div className="mb-6">
                <p className="text-left text-xs text-[#c4a07a] mb-2">$ find_flag</p>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="flag{...}"
                  className="w-full px-3 py-2 bg-[rgba(200,120,60,0.1)] border border-[rgba(200,120,60,0.3)] focus:border-amber-600 rounded text-[#f5e6c8] placeholder-gray-600 focus:outline-none transition-all duration-300 text-xs font-mono"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    setInputValue("");
                    setSelectedChallenge(null);
                  }}
                  className="flex-1 py-2 px-3 text-xs font-bold uppercase tracking-widest text-[#f5e6c8] bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 rounded border border-gray-600 transition-all duration-300 shadow-lg shadow-gray-600/30 hover:shadow-gray-600/50 transform hover:scale-105"
                >
                  Exit
                </button>
                <button 
                  onClick={() => {
                    if (inputValue.trim()) {
                      alert(`Flag Captured: ${inputValue}`);
                      setCompletedChallenges(new Set([...completedChallenges, selectedChallenge!.id]));
                      setInputValue("");
                      setSelectedChallenge(null);
                    }
                  }}
                  className="flex-1 py-2 px-3 text-xs font-bold uppercase tracking-widest text-white bg-gradient-to-r from-amber-700 to-orange-700 hover:from-amber-600 hover:to-orange-600 rounded border border-amber-600 transition-all duration-300 shadow-lg shadow-amber-600/30 hover:shadow-amber-600/50 transform hover:scale-105"
                >
                  Submit
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
