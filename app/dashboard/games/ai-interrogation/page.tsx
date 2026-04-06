"use client";

import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  getAIInterrogationSubmission,
  submitAIInterrogationSubmission,
} from "@/app/actions/ai-interrogation";

interface SubmissionState {
  hasSubmitted: boolean;
  submission: {
    id: string;
    promptText: string;
    imagePath: string;
    imageUrl: string;
    awardedPoints: number;
    evaluatedAt: string | null;
    createdAt: string | null;
  } | null;
}

export default function AIInterrogationPage() {
  const [textInput, setTextInput] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [submissionState, setSubmissionState] = useState<SubmissionState>({
    hasSubmitted: false,
    submission: null,
  });

  useEffect(() => {
    async function fetchSubmission() {
      setIsLoading(true);
      const result = await getAIInterrogationSubmission();
      setSubmissionState(result);

      if (result.submission) {
        setTextInput(result.submission.promptText);
        setImagePreview(result.submission.imageUrl);
      }

      setIsLoading(false);
    }

    fetchSubmission();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const resetLocalInputs = () => {
    setTextInput("");
    setImageFile(null);
    setImagePreview("");
  };

  const handleSubmit = async () => {
    if (submissionState.hasSubmitted) {
      toast.info("Already submitted", {
        description: "You can only submit once for this challenge.",
      });
      return;
    }

    if (!textInput.trim() || !imageFile) {
      toast.error("Missing submission data", {
        description: "Please provide both the prompt text and an image.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("prompt", textInput.trim());
      formData.append("image", imageFile);

      const result = await submitAIInterrogationSubmission(formData);

      if (!result.success) {
        if (result.alreadySubmitted) {
          const latest = await getAIInterrogationSubmission();
          setSubmissionState(latest);
          if (latest.submission) {
            setTextInput(latest.submission.promptText);
            setImagePreview(latest.submission.imageUrl);
            setImageFile(null);
          }
        }

        toast.error("Submission failed", {
          description: result.message,
        });
        return;
      }

      const latest = await getAIInterrogationSubmission();
      setSubmissionState(latest);
      if (latest.submission) {
        setTextInput(latest.submission.promptText);
        setImagePreview(latest.submission.imageUrl);
      }
      setImageFile(null);

      toast.success("Submission received", {
        description: "Your AI Interrogation entry has been saved.",
      });
    } catch (error) {
      console.error("Error submitting AI interrogation:", error);
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
          <p className="text-[#f5e6c8] text-lg">Loading challenge...</p>
        </div>
      </div>
    );
  }

  const isLocked = submissionState.hasSubmitted;
  const isEvaluated = Boolean(submissionState.submission?.evaluatedAt);

  return (
    <div className="min-h-screen text-white site-background">
      <div className="pt-20 pb-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal className="text-center mb-16">
            <h1 className="text-[clamp(1.6rem,6vw,3rem)] font-extrabold uppercase tracking-[0.08em] text-[#f5e6c8] mb-4">The AI Interrogation</h1>
            <p className="text-xl text-[#c4a07a] font-semibold mb-2">Not about Problems, Just be Creative</p>
            <p className="text-lg text-gray-300 mb-4">Recreate the reference image using your AI model.</p>
            {isLocked && (
              isEvaluated ? (
                <div className="inline-block bg-[rgba(60,120,20,0.2)] border border-[rgba(120,180,60,0.5)] rounded-lg px-6 py-3">
                  <p className="text-sm font-bold uppercase tracking-[0.08em] text-lime-300">
                    Evaluated - {submissionState.submission?.awardedPoints || 0} points
                  </p>
                </div>
              ) : (
                <div className="inline-block bg-[rgba(20,120,40,0.15)] border border-[rgba(20,120,40,0.4)] rounded-lg px-6 py-3">
                  <p className="text-sm font-bold uppercase tracking-[0.08em] text-green-300">
                    Submitted - Awaiting Evaluation
                  </p>
                </div>
              )
            )}
          </ScrollReveal>

          <ScrollReveal>
            <div className="border-2 border-[rgba(200,120,60,0.4)] bg-[rgba(30,12,5,0.85)] backdrop-blur-sm rounded-lg p-8 shadow-2xl shadow-amber-600/40">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[rgba(200,120,60,0.3)] font-mono">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="ml-auto text-xs text-[#c4a07a]">ai_interrogation.txt</span>
              </div>

              <div className="mb-8">
                <p className="text-xs text-[#c4a07a] mb-4 font-mono">$ display_submission_image</p>
                <div className="relative w-full h-64 sm:h-80 bg-gradient-to-br from-[#2a1a0a] to-[#1a0a02] border-2 border-[rgba(200,120,60,0.3)] rounded-lg flex items-center justify-center overflow-hidden group hover:border-[rgba(200,120,60,0.6)] transition-all duration-300">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Submission preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center">
                      <p className="text-[#f5e6c8] font-bold text-lg mb-2">AI SUBMISSION IMAGE</p>
                      <p className="text-xs text-[#c4a07a]">(Upload your generated image below)</p>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>

              <div className="mb-8">
                <p className="text-xs text-[#c4a07a] mb-3 font-mono">$ input_generation_prompt</p>
                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Enter the exact prompt you used to generate the image..."
                  disabled={isLocked || isSubmitting}
                  className="w-full h-40 px-4 py-3 bg-[rgba(200,120,60,0.1)] border-2 border-[rgba(200,120,60,0.3)] focus:border-amber-600 rounded-lg text-[#f5e6c8] placeholder-gray-600 focus:outline-none transition-all duration-300 font-mono text-sm resize-none disabled:opacity-60"
                />
                <p className="text-xs text-gray-500 mt-2 font-mono">{textInput.length} characters</p>
              </div>

              <div className="mb-8">
                <label className="block">
                  <p className="text-xs text-[#c4a07a] mb-3 font-mono">$ upload_generated_image</p>
                  <div className="relative group">
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleImageChange}
                      className="hidden"
                      id="image-upload"
                      disabled={isLocked || isSubmitting}
                    />
                    <label
                      htmlFor="image-upload"
                      className={`flex items-center justify-center gap-2 w-full py-4 px-4 border-2 border-dashed rounded-lg transition-all duration-300 ${
                        isLocked
                          ? "bg-[rgba(80,80,80,0.2)] border-[rgba(120,120,120,0.5)] cursor-not-allowed"
                          : "bg-gradient-to-r from-amber-700/20 to-orange-700/20 border-[rgba(200,120,60,0.4)] hover:border-amber-600 cursor-pointer group-hover:bg-gradient-to-r group-hover:from-amber-700/30 group-hover:to-orange-700/30"
                      }`}
                    >
                      <span className="text-[#f5e6c8] font-semibold text-sm">
                        {imageFile
                          ? `Selected: ${imageFile.name}`
                          : isLocked
                            ? "Submission locked"
                            : "Choose Image or Drag & Drop"}
                      </span>
                    </label>
                  </div>
                </label>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={resetLocalInputs}
                  disabled={isLocked || isSubmitting}
                  className="flex-1 py-4 px-4 text-xs font-bold uppercase tracking-widest text-[#f5e6c8] bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 rounded-lg border border-gray-600 transition-all duration-300 shadow-lg shadow-gray-600/30 hover:shadow-gray-600/50 transform hover:scale-105 font-mono disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  Clear
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isLocked || isSubmitting}
                  className="flex-1 py-4 px-4 text-xs font-bold uppercase tracking-widest text-white bg-gradient-to-r from-amber-700 to-orange-700 hover:from-amber-600 hover:to-orange-600 rounded-lg border border-amber-600 transition-all duration-300 shadow-lg shadow-amber-600/30 hover:shadow-amber-600/50 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-mono"
                >
                  {isSubmitting ? "Submitting..." : isLocked ? "Submitted" : "Submit Response"}
                </button>
              </div>

              <div className="mt-6 pt-4 border-t border-[rgba(200,120,60,0.2)]">
                <p className="text-xs text-gray-500 font-mono">
                  File: ai_interrogation.txt | Mode: rw-r--r-- | Status: {isLocked ? "Submitted" : "Ready"}
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
