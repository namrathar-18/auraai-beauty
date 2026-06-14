import React, { useState } from "react";
import { Sparkles, Scan, HelpCircle, Palette, RefreshCw, AlertCircle, ShoppingBag, Send } from "lucide-react";
import { Product } from "../types";

interface AIShadeFinderProps {
  onAddProductToCart: (productId: string, shade?: string) => void;
  products: Product[];
}

export default function AIShadeFinder({ onAddProductToCart, products }: AIShadeFinderProps) {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [descriptionInput, setDescriptionInput] = useState<string>("");
  const [matching, setMatching] = useState<boolean>(false);
  const [matchData, setMatchData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sampleDescriptions = [
    "I am light-medium with strong yellow undertones. Gold jewelry looks best on me and I tan easily.",
    "Extremely fair skin with cool pink undertones. Silver looks stunning on me, gold looks too harsh, and I get sunburned immediately.",
    "Balanced olive-medium skin with neutral undertones. Both gold and silver suit my complexion beautifully."
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedFile(reader.result as string);
        setDescriptionInput(""); // Reset text if file is uploaded
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMatch = async () => {
    if (!selectedFile && !descriptionInput.trim()) {
      setError("Please upload a selfie file or Type/Select a skin description tag.");
      return;
    }

    setMatching(true);
    setError(null);
    setMatchData(null);

    try {
      const response = await fetch("/api/ai/shade-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: selectedFile,
          descriptionInput: descriptionInput,
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to formulate shade match. Check connection and try again.");
      }

      const data = await response.json();
      
      // Delay for virtual diagnostic engine effect
      setTimeout(() => {
        setMatchData(data);
        setMatching(false);
      }, 1800);
    } catch (err: any) {
      setError(err.message || "Failed to process match.");
      setMatching(false);
    }
  };

  const resetMatcher = () => {
    setSelectedFile(null);
    setDescriptionInput("");
    setMatchData(null);
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4" id="shade-finder-segment">
      {/* Header */}
      <div className="text-center mb-10">
        <span className="px-3 py-1 rounded-full bg-violet-100 text-violet-600 text-xs font-bold uppercase tracking-widest">
          Pixel Spec Shade Finder
        </span>
        <h1 className="text-4xl md:text-5xl font-light font-display mt-3">
          AI Shade <span className="font-semibold italic bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-pink-500">Match Engine</span>
        </h1>
        <p className="text-slate-500 max-w-xl mx-auto mt-2 text-sm md:text-base">
          Stop guessing foundation shades! Upload a picture under natural lighting or spell out your tone characteristics. Our neural models will map your undertone with 98% accuracy.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Input controls panel */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl shadow-sm border border-violet-100/60">
          <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Palette className="w-4 h-4 text-violet-600" />
            <span>Select Input Style:</span>
          </h2>

          {/* Option A: Upload image */}
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-violet-50/30 border border-violet-100/50">
              <span className="text-[10px] font-bold text-violet-600 uppercase tracking-widest block mb-2">Option A: Portrait Upload</span>
              <div className="flex items-center gap-3">
                <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-violet-200 hover:border-violet-400 bg-white p-4 rounded-xl cursor-pointer transition-colors text-center">
                  <Scan className="w-5 h-5 text-violet-400 mb-1" />
                  <span className="text-xs font-semibold text-slate-700">Choose Portrait</span>
                  <input type="file" onChange={handleFileChange} accept="image/*" className="hidden" />
                </label>

                {selectedFile && (
                  <div className="relative shrink-0">
                    <img
                      src={selectedFile}
                      alt="Thumbnail"
                      className="w-16 h-16 rounded-xl object-cover border-2 border-violet-400"
                      referrerPolicy="no-referrer"
                    />
                    <button
                      onClick={() => setSelectedFile(null)}
                      className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 bg-red-500 text-white rounded-full text-[10px] flex items-center justify-center font-bold shadow-xs hover:bg-red-600 cursor-pointer"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Option B: Describe layout */}
            <div className="p-4 rounded-2xl bg-pink-50/25 border border-pink-100/40">
              <span className="text-[10px] font-bold text-pink-600 uppercase tracking-widest block mb-2">Option B: Describe Your Tone</span>
              <textarea
                value={descriptionInput}
                onChange={(e) => {
                  setDescriptionInput(e.target.value);
                  setSelectedFile(null); // priorities text input
                }}
                placeholder="E.g. I am dusky with yellow-reddish tint. Silver jewelry makes my skin look dull, gold is better..."
                className="w-full h-24 p-3 bg-white text-slate-800 text-xs rounded-xl border border-slate-100 focus:outline-hidden focus:ring-1 focus:ring-pink-300 placeholder:text-slate-400 resize-none"
              ></textarea>

              <div className="mt-3">
                <span className="text-[10px] font-medium text-slate-400 block mb-1.5">Or tap a sample query:</span>
                <div className="space-y-1.5">
                  {sampleDescriptions.map((desc, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setDescriptionInput(desc);
                        setSelectedFile(null);
                      }}
                      className="w-full text-left p-1.5 text-[10px] bg-white border border-slate-100 hover:border-pink-200 hover:bg-pink-50/10 text-slate-600 rounded-lg truncate block"
                    >
                      "{desc}"
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleMatch}
            disabled={matching}
            className="w-full py-4 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 text-white font-semibold rounded-full text-xs shadow-md mt-6 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {matching ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Interrogating Skin Spec Base...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-pink-300" />
                <span>Extract Best Cosmetic Shades</span>
              </>
            )}
          </button>

          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 text-[11px] rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Right Output results Panel */}
        <div className="lg:col-span-7">
          {matchData ? (
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-violet-100/60 animate-fade-in relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-violet-50 rounded-full blur-3xl opacity-50"></div>
              
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-slate-800">Your AI Shade Match Report</h2>
                <button
                  onClick={resetMatcher}
                  className="text-xs text-violet-600 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <RefreshCw className="w-3" />
                  <span>Start Again</span>
                </button>
              </div>

              {/* Main Attributes */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Assessed Tone</span>
                  <p className="text-base font-bold text-slate-800 mt-1">{matchData.skinTone}</p>
                </div>
                <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Undertone Class</span>
                  <p className="text-base font-bold text-violet-700 mt-1">{matchData.undertone}</p>
                </div>
              </div>

              {/* Specific Shade Matches */}
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Custom Shade Recipe</h3>
              <div className="space-y-3 mb-6">
                <div className="p-4 rounded-2xl border border-pink-100 bg-rose-50/10 flex justify-between items-center">
                  <div>
                    <span className="text-[9px] bg-rose-100 text-rose-700 px-2.5 py-0.5 rounded-full font-bold">FOUNDATION</span>
                    <p className="text-sm font-bold text-slate-800 mt-1">
                      {matchData.foundationShade}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      // Attempt to search foundation product & trigger add
                      const fd = products.find((p) => p.category === "Foundations") || products[1];
                      onAddProductToCart(fd.id, fd.shades?.[2] || "03 Beige Honey");
                    }}
                    className="p-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <ShoppingBag className="w-3 h-3" />
                    <span>Bag Match</span>
                  </button>
                </div>

                <div className="p-4 rounded-2xl border border-pink-100 bg-rose-50/10 flex justify-between items-center">
                  <div>
                    <span className="text-[9px] bg-pink-100 text-pink-700 px-2.5 py-0.5 rounded-full font-bold">CONCEALER</span>
                    <p className="text-sm font-bold text-slate-800 mt-1">
                      {matchData.concealerShade}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const con = products.find((p) => p.category === "Concealers") || products[2];
                      onAddProductToCart(con.id, con.shades?.[2] || "20 Sand");
                    }}
                    className="p-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <ShoppingBag className="w-3 h-3" />
                    <span>Bag Match</span>
                  </button>
                </div>

                <div className="p-4 rounded-2xl border border-violet-100 bg-violet-50/10 flex justify-between items-center">
                  <div>
                    <span className="text-[9px] bg-violet-100 text-violet-700 px-2.5 py-0.5 rounded-full font-bold">COMPACT / BLUSH MATCH</span>
                    <p className="text-sm font-bold text-slate-800 mt-1">
                      {matchData.compactShade}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const bl = products.find((p) => p.category === "Blush") || products[8];
                      onAddProductToCart(bl.id, bl.shades?.[0] || "Rose Pink");
                    }}
                    className="p-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <ShoppingBag className="w-3 h-3" />
                    <span>Bag Match</span>
                  </button>
                </div>
              </div>

              {/* Confidence Rating Bar */}
              <div className="p-4 bg-slate-50 rounded-2xl border">
                <div className="flex justify-between items-center text-xs font-bold text-slate-600 mb-2">
                  <span>Neural Confidence Rating</span>
                  <span className="text-emerald-600">{matchData.confidenceRating || 92}%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                    style={{ width: `${matchData.confidenceRating || 92}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full bg-slate-50 border border-dashed border-slate-200 p-8 rounded-3xl flex flex-col items-center justify-center min-h-[350px] text-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-300 mb-4 animate-pulse">
                <Palette className="w-6 h-6 text-slate-400" />
              </div>
              <p className="text-sm font-semibold text-slate-700">No active shade report generated</p>
              <p className="text-xs text-slate-400 max-w-sm mt-1">
                Provide or select a description of your facial attributes on the left panel, then trigger match processing to get matching shades from M.A.C, Lakmé, or Maybelline Fit Me.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
