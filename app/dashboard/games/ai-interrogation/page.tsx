"use client";

import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { useState } from "react";
import Image from "next/image";

export default function AIInterrogationPage() {
  const [textInput, setTextInput] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (textInput.trim() || imageFile) {
      setIsSubmitting(true);
      alert(`Creative Response Captured!\nText: ${textInput}\nImage: ${imageFile?.name || "None"}`);
      setTextInput("");
      setImageFile(null);
      setImagePreview("");
      setIsSubmitting(false);
    } else {
      alert("Please provide either text or upload an image");
    }
  };

  return (
    <div className="min-h-screen text-white site-background">
      <div className="pt-20 pb-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal className="text-center mb-16">
            <h1 className="text-[clamp(1.6rem,6vw,3rem)] font-extrabold uppercase tracking-[0.08em] text-[#f5e6c8] mb-4">The AI Interrogation</h1>
            <p className="text-xl text-[#c4a07a] font-semibold mb-2">Not about Problems, Just be Creative</p>
            <p className="text-lg text-gray-300">Express yourself through text and visuals</p>
          </ScrollReveal>

          {/* Main Container */}
          <ScrollReveal>
            <div className="border-2 border-[rgba(200,120,60,0.4)] bg-[rgba(30,12,5,0.85)] backdrop-blur-sm rounded-lg p-8 shadow-2xl shadow-amber-600/40">
              
              {/* Terminal Header */}
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[rgba(200,120,60,0.3)] font-mono">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="ml-auto text-xs text-[#c4a07a]">ai_interrogation.txt</span>
              </div>

              {/* Image Section */}
              <div className="mb-8">
                <p className="text-xs text-[#c4a07a] mb-4 font-mono">$ display_prompt</p>
                <div className="relative w-full h-64 sm:h-80 bg-gradient-to-br from-[#2a1a0a] to-[#1a0a02] border-2 border-[rgba(200,120,60,0.3)] rounded-lg flex items-center justify-center overflow-hidden group hover:border-[rgba(200,120,60,0.6)] transition-all duration-300">
                  {imagePreview ? (
                    <img 
                      src={imagePreview} 
                      alt="Uploaded" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center">
                      <p className="text-[#f5e6c8] font-bold text-lg mb-2">AI PROMPT IMAGE</p>
                      <p className="text-xs text-[#c4a07a]">(Upload your response image below)</p>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>

              {/* Text Input Section */}
              <div className="mb-8">
                <p className="text-xs text-[#c4a07a] mb-3 font-mono">$ input_response</p>
                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Share your creative thoughts here... Be imaginative and expressive!"
                  className="w-full h-40 px-4 py-3 bg-[rgba(200,120,60,0.1)] border-2 border-[rgba(200,120,60,0.3)] focus:border-amber-600 rounded-lg text-[#f5e6c8] placeholder-gray-600 focus:outline-none transition-all duration-300 font-mono text-sm resize-none"
                />
                <p className="text-xs text-gray-500 mt-2 font-mono">{textInput.length} characters</p>
              </div>

              {/* Image Upload Section */}
              <div className="mb-8">
                <label className="block">
                  <p className="text-xs text-[#c4a07a] mb-3 font-mono">$ upload_visual_creativity</p>
                  <div className="relative group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="flex items-center justify-center gap-2 w-full py-4 px-4 bg-gradient-to-r from-amber-700/20 to-orange-700/20 border-2 border-dashed border-[rgba(200,120,60,0.4)] hover:border-amber-600 rounded-lg cursor-pointer transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-amber-700/30 group-hover:to-orange-700/30"
                    >
                      <span className="text-[#f5e6c8] font-semibold text-sm">
                        {imageFile ? `Selected: ${imageFile.name}` : "Choose Image or Drag & Drop"}
                      </span>
                    </label>
                  </div>
                </label>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setTextInput("");
                    setImageFile(null);
                    setImagePreview("");
                  }}
                  className="flex-1 py-4 px-4 text-xs font-bold uppercase tracking-widest text-[#f5e6c8] bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 rounded-lg border border-gray-600 transition-all duration-300 shadow-lg shadow-gray-600/30 hover:shadow-gray-600/50 transform hover:scale-105 font-mono"
                >
                  Clear
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 py-4 px-4 text-xs font-bold uppercase tracking-widest text-white bg-gradient-to-r from-amber-700 to-orange-700 hover:from-amber-600 hover:to-orange-600 rounded-lg border border-amber-600 transition-all duration-300 shadow-lg shadow-amber-600/30 hover:shadow-amber-600/50 transform hover:scale-105 disabled:opacity-50 font-mono"
                >
                  {isSubmitting ? "Submitting..." : "Submit Response"}
                </button>
              </div>

              {/* File Info */}
              <div className="mt-6 pt-4 border-t border-[rgba(200,120,60,0.2)]">
                <p className="text-xs text-gray-500 font-mono">
                  File: ai_interrogation.txt | Mode: rw-r--r-- | Status: Ready
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
      <Footer />
    </div>
  );
}
