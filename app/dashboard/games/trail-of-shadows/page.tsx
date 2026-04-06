"use client";

import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { useState } from "react";

interface Mystery {
  id: number;
  title: string;
  description: string;
  difficulty: string;
}

const mysteries: Mystery[] = [
  { id: 1, title: "The Vanished Heirloom", description: "A precious jewel has disappeared from a locked manor. Discover the truth.", difficulty: "Beginner" },
  { id: 2, title: "The Midnight Murder", description: "An unsolved case from decades past resurfaces. Can you crack it?", difficulty: "Intermediate" },
  { id: 3, title: "The Secret Society", description: "Decipher the coded messages of an underground organization.", difficulty: "Intermediate" },
  { id: 4, title: "The Forged Letter", description: "Which letter is authentic? Follow the trail of deception.", difficulty: "Beginner" },
  { id: 5, title: "The Missing Witness", description: "Track down the sole witness to the crime scene.", difficulty: "Advanced" },
  { id: 6, title: "The Poisoned Cup", description: "A cryptic death at a grand dinner party demands answers.", difficulty: "Advanced" },
  { id: 7, title: "The Stolen Blueprint", description: "Industrial espionage or something darker? Investigate.", difficulty: "Intermediate" },
  { id: 8, title: "The Shadow's Identity", description: "Who is the mysterious figure seen at midnight?", difficulty: "Beginner" },
  { id: 9, title: "The Double Agent", description: "Trust no one. Find the traitor among the ranks.", difficulty: "Advanced" },
  { id: 10, title: "The Final Case", description: "The master mystery that will test all your skills.", difficulty: "Expert" },
];

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "Beginner":
      return "text-green-400";
    case "Intermediate":
      return "text-yellow-400";
    case "Advanced":
      return "text-orange-400";
    case "Expert":
      return "text-red-400";
    default:
      return "text-gray-400";
  }
};

export default function GamePage() {
  const [selectedMystery, setSelectedMystery] = useState<Mystery | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [investigatedMysteries, setInvestigatedMysteries] = useState<Set<number>>(new Set());
  return (
    <div className="min-h-screen text-white site-background">
      <div className="pt-20 pb-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal className="text-center mb-16">
            <h1 className="text-[clamp(1.6rem,6vw,3rem)] font-extrabold uppercase tracking-[0.08em] text-[#f5e6c8] mb-4">Trail of Shadows</h1>
            <p className="text-xl text-[#c4a07a] font-semibold mb-2">Find the Clues, Solve the Puzzle</p>
            <p className="text-lg text-gray-300">Embark on a Sherlock Holmes-inspired mystery adventure. Each case holds secrets waiting to be unveiled.</p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {mysteries.map((mystery, index) => (
              <ScrollReveal key={mystery.id} delayMs={index * 80}>
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
                        {mystery.id}
                      </div>
                      <span className={`text-xs font-bold uppercase tracking-widest ${getDifficultyColor(mystery.difficulty)}`}>
                        {mystery.difficulty}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 mb-4 overflow-hidden">
                      <h3 className="text-sm font-bold uppercase tracking-[0.08em] text-[#f5e6c8] mb-3 line-clamp-2 group-hover:text-amber-300 transition-colors h-9">
                        {mystery.title}
                      </h3>
                      <p className="text-xs leading-relaxed text-[#c4a07a] line-clamp-4">
                        {mystery.description}
                      </p>
                    </div>

                    {/* Action button */}
                    <div className="pt-4 border-t border-[rgba(200,120,60,0.2)] flex-shrink-0">
                      <button 
                        onClick={() => setSelectedMystery(mystery)}
                        className={`w-full py-2.5 px-4 text-xs font-bold uppercase tracking-widest rounded-lg border transition-all duration-300 ${
                          investigatedMysteries.has(mystery.id)
                            ? "text-white bg-gradient-to-r from-green-700 to-emerald-700 hover:from-green-600 hover:to-emerald-600 border-green-600 shadow-lg shadow-green-600/30"
                            : "text-[#f5e6c8] bg-gradient-to-r from-amber-700/30 to-orange-700/30 hover:from-amber-600/60 hover:to-orange-600/60 border-amber-600/30 hover:border-amber-600/60 group-hover:shadow-lg group-hover:shadow-amber-600/30"
                        }`}
                      >
                        {investigatedMysteries.has(mystery.id) ? "Investigated" : "Investigate"}
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
      {selectedMystery && (
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
          <div className="modal-backdrop fixed inset-0 bg-black/50 backdrop-blur-sm -z-10" />
          
          <div className="relative modal-popup bg-gradient-to-br from-[#2a1a0a] to-[#1a0a02] border-2 border-[rgba(200,120,60,0.4)] rounded-lg p-12 max-w-sm w-full shadow-2xl shadow-amber-600/40">
            
            {/* Decorative corners */}
            <div className="absolute top-4 left-4 w-3 h-3 bg-[#f5e6c8]" />
            <div className="absolute top-4 right-4 w-3 h-3 bg-[#f5e6c8]" />
            <div className="absolute bottom-4 left-4 w-3 h-3 bg-[#f5e6c8]" />
            <div className="absolute bottom-4 right-4 w-3 h-3 bg-[#f5e6c8]" />
            
            {/* Close button */}
            <button 
              onClick={() => setSelectedMystery(null)}
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
                  {selectedMystery.id}
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
                  {selectedMystery.title}
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
                  placeholder="Enter Answer"
                  className="w-full px-4 py-3 bg-[rgba(200,120,60,0.1)] border-2 border-[rgba(200,120,60,0.3)] focus:border-amber-600 rounded-lg text-[#f5e6c8] placeholder-gray-500 focus:outline-none transition-all duration-300 uppercase tracking-widest font-semibold"
                />
              </div>

              {/* Cancel and Submit Buttons */}
              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    setInputValue("");
                    setSelectedMystery(null);
                  }}
                  className="flex-1 py-3 px-4 text-xs font-bold uppercase tracking-widest text-[#f5e6c8] bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 rounded-lg border border-gray-600 transition-all duration-300 shadow-lg shadow-gray-600/30 hover:shadow-gray-600/50 transform hover:scale-105"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    if (inputValue.trim()) {
                      alert(`Submitted: ${inputValue}`);
                      setInvestigatedMysteries(new Set([...investigatedMysteries, selectedMystery!.id]));
                      setInputValue("");
                      setSelectedMystery(null);
                    }
                  }}
                  className="flex-1 py-3 px-4 text-xs font-bold uppercase tracking-widest text-white bg-gradient-to-r from-amber-700 to-orange-700 hover:from-amber-600 hover:to-orange-600 rounded-lg border border-amber-600 transition-all duration-300 shadow-lg shadow-amber-600/30 hover:shadow-amber-600/50 transform hover:scale-105"
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