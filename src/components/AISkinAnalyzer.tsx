import React, { useState, useRef } from "react";
import { SkinAnalysisReport, Product } from "../types";
import { Camera, Sparkles, AlertCircle, CheckCircle, RefreshCw, ShoppingBag, Eye, Zap } from "lucide-react";

interface AISkinAnalyzerProps {
  onAddProductToCart: (productId: string, shade?: string) => void;
  products: Product[];
}

export default function AISkinAnalyzer({ onAddProductToCart, products }: AISkinAnalyzerProps) {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<string>("Normal");
  const [scanning, setScanning] = useState<boolean>(false);
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [report, setReport] = useState<SkinAnalysisReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Preset quick-test templates
  const presets = [
    { name: "Normal", label: "Balanced Glow" },
    { name: "Acne", label: "Acne Congestion" },
    { name: "Dark Circles", label: "Eye Shadows & Fatigue" },
    { name: "Dryness", label: "Dehydrated Dryness" },
    { name: "Oiliness", label: "Shiny T-Zone Sebum" },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedFile(reader.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const startScan = async () => {
    setScanning(true);
    setScanProgress(0);
    setReport(null);

    // Dynamic scanning line effect progress
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 250);

    try {
      // API call to custom server side scanner
      const res = await fetch("/api/ai/skin-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: selectedFile,
          selectedPresetConcern: selectedPreset,
        }),
      });

      if (!res.ok) {
        throw new Error("Could not process skin analysis. Please refresh and try again.");
      }

      const data = (await res.json()) as SkinAnalysisReport;
      
      // Delay response slightly to matching scanning line animations
      setTimeout(() => {
        setReport(data);
        setScanning(false);
      }, 2500);

    } catch (err: any) {
      clearInterval(interval);
      setError(err.message || "Something went wrong.");
      setScanning(false);
    }
  };

  const triggerSelectFile = () => {
    fileInputRef.current?.click();
  };

  // Drag and drop events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedFile(reader.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetScanner = () => {
    setSelectedFile(null);
    setReport(null);
    setSelectedPreset("Normal");
    setScanProgress(0);
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4" id="ai-skin-analyzer-container">
      {/* Page Header */}
      <div className="text-center mb-10">
        <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-600 text-xs font-bold uppercase tracking-widest">
          Computer Vision Skincare
        </span>
        <h1 className="text-4xl md:text-5xl font-light font-display mt-3">
          AI Skin <span className="font-semibold italic bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-indigo-600">Analyzer</span>
        </h1>
        <p className="text-slate-500 max-w-xl mx-auto mt-2 text-sm md:text-base">
          Analyze skin characteristics including dryness, pores, and dark circles. Upload a close selfie to receive a customized diagnostic score and expert-tested product remedies.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Interactive Panel: Selfie Upload & Scan Trigger */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl shadow-sm border border-pink-100/60 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-50 rounded-full blur-3xl opacity-60"></div>
          
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Camera className="w-4 h-4 text-rose-500" />
            <span>Step 1: Provide Selfie</span>
          </h2>

          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={!scanning ? triggerSelectFile : undefined}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden ${
              selectedFile ? "border-pink-300 bg-pink-50/10" : "border-slate-200 hover:border-pink-300 hover:bg-rose-50/20"
            }`}
            style={{ pointerEvents: scanning ? "none" : "auto" }}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            {selectedFile ? (
              <div className="w-full h-full flex flex-col items-center justify-center relative">
                <img
                  src={selectedFile}
                  alt="Selfie Preview"
                  className="w-48 h-48 rounded-full object-cover border-4 border-white shadow-md mb-4"
                  referrerPolicy="no-referrer"
                />
                
                {/* Simulated Scanning laser line */}
                {scanning && (
                  <div
                    className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-rose-500 to-indigo-500 blur-xs transition-all duration-300 shadow-lg animate-bounce"
                    style={{
                      height: "3px",
                    }}
                  ></div>
                )}

                <p className="text-xs text-rose-600 font-semibold mb-1">
                  Ready to scan
                </p>
                <p className="text-[10px] text-slate-400">
                  Click dropzone to change photo
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-rose-50 flex items-center justify-center mb-3">
                  <Camera className="w-6 h-6 text-rose-400" />
                </div>
                <p className="text-sm font-semibold text-slate-700 mb-1">
                  Drag and drop selfie here
                </p>
                <p className="text-xs text-slate-400 max-w-xs mb-4">
                  Supports JPG, PNG with bright ambient lighting for high precision.
                </p>
                <button
                  type="button"
                  className="px-4 py-2 text-xs bg-slate-900 text-white rounded-full font-medium"
                >
                  Locate Image File
                </button>
              </div>
            )}
          </div>

          {/* Quick preset selector - extremely helpful if camera/file isn't available */}
          <div className="mt-6 border-t border-slate-100 pt-5">
            <p className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Or Choose a Preset Skin Scenario to test:</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {presets.map((p) => (
                <button
                  key={p.name}
                  disabled={scanning}
                  onClick={() => {
                    setSelectedPreset(p.name);
                    setSelectedFile(null); // priorities preset simulation
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                    selectedPreset === p.name && !selectedFile
                      ? "bg-gradient-to-r from-rose-500 to-indigo-500 text-white border-transparent shadow-xs"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:border-pink-200"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Scan Action */}
          <div className="mt-6">
            <button
              onClick={startScan}
              disabled={scanning}
              className="w-full py-4.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-semibold rounded-full text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {scanning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Processing Skin Scan {scanProgress}%...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-pink-300" />
                  <span>Analyze My Complexion</span>
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Right Panel: Results Visualization */}
        <div className="lg:col-span-7">
          {report ? (
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-indigo-50/80 animate-fade-in">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  <span>Diagnostic Dashboard</span>
                </h2>
                <button
                  onClick={resetScanner}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 cursor-pointer"
                  title="Reset and scan again"
                >
                  <RefreshCw className="w-4 h-4 text-slate-500" />
                </button>
              </div>

              {/* Main Indicator: Skin Health Score Circle */}
              <div className="flex flex-col md:flex-row items-center gap-8 mb-8 pb-8 border-b border-slate-100">
                <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
                  {/* Radial circle background trace */}
                  <svg className="absolute w-full h-full -rotate-90">
                    <circle
                      cx="72"
                      cy="72"
                      r="64"
                      className="stroke-slate-100"
                      strokeWidth="10"
                      fill="transparent"
                    />
                    <circle
                      cx="72"
                      cy="72"
                      r="64"
                      className="stroke-rose-400 transition-all duration-1000"
                      strokeWidth="10"
                      fill="transparent"
                      strokeDasharray={402}
                      strokeDashoffset={402 - (402 * report.score) / 100}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="text-center">
                    <span className="text-3xl font-extrabold text-slate-800">{report.score}</span>
                    <span className="text-slate-400 text-xs block">/ 100</span>
                    <span className="text-[10px] text-pink-600 font-bold uppercase tracking-wide">Index Score</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-800 mb-1">
                    Your Overall Skin Health rating is <span className="text-rose-500 font-extrabold">{report.score === 82 ? "Good" : "Moderate"}</span>.
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    AuraAI evaluated structural pixel-level variances and localized shadows to formulate this rating. Find your customized diagnostic metrics and targeted chemical ingredients below.
                  </p>
                  {report.isSimulation && (
                    <span className="inline-block mt-2 text-[10px] bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full font-bold">
                      ⚡ Simulation Mode Active
                    </span>
                  )}
                </div>
              </div>

              {/* Sub-Metrics Details */}
              <h3 className="text-sm font-bold text-slate-700 mb-4">Detailed Structural Diagnostic Metrics:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {Object.entries(report.concerns).map(([key, itemVal]) => {
                  const item = itemVal as { score: number; status: "Good" | "Moderate" | "Needs Attention"; info: string };
                  const statusColors = {
                    Good: "bg-emerald-50 text-emerald-700 border-emerald-200",
                    Moderate: "bg-amber-50 text-amber-700 border-amber-200",
                    "Needs Attention": "bg-red-50 text-red-700 border-red-200",
                  };
                  return (
                    <div key={key} className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100 flex flex-col gap-1.5 hover:shadow-xs transition-shadow">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold capitalize text-slate-800">
                          {key.replace(/([A-Z])/g, " $1")}
                        </span>
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${statusColors[item.status]}`}>
                          {item.status} ({item.score}%)
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-normal">{item.info}</p>
                    </div>
                  );
                })}
              </div>

              {/* Personal Care Product Suggestions */}
              <div className="border-t border-slate-100 pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-rose-500" />
                    <span>Suggested High-Performance Remedies:</span>
                  </h3>
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Recommended for You</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {products
                    .filter((p) => report.recommendedProductIds.includes(p.id))
                    .map((prod) => {
                      return (
                        <div
                          key={prod.id}
                          className="p-3 border border-pink-100/60 rounded-2xl flex gap-3 bg-white/50 hover:bg-white transition-all shadow-xs"
                        >
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-16 h-16 rounded-xl object-cover border border-slate-100 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                              <span className="text-[9px] text-slate-400 font-bold block truncate">
                                {prod.brand}
                              </span>
                              <h4 className="text-xs font-bold text-slate-800 truncate" title={prod.name}>
                                {prod.name}
                              </h4>
                              <p className="text-xs font-bold text-rose-600 mt-1">₹{prod.price}</p>
                            </div>
                            <button
                              onClick={() => onAddProductToCart(prod.id, prod.shades?.[0])}
                              className="mt-1 flex items-center justify-center gap-1 py-1.5 bg-slate-900 text-white rounded-lg text-[9px] font-bold hover:bg-slate-800 cursor-pointer transition-colors"
                            >
                              <ShoppingBag className="w-3 h-3" />
                              <span>Add to bag</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full bg-slate-50 border border-dashed border-slate-200 p-8 rounded-3xl flex flex-col items-center justify-center min-h-[400px] text-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4 animate-pulse">
                <Camera className="w-6 h-6 text-slate-300" />
              </div>
              <p className="text-sm font-semibold text-slate-700">No active report generated</p>
              <p className="text-xs text-slate-400 max-w-sm mt-1">
                Upload your beauty selfie on the left side, or toggle one of our quick-test preset cases and click "Analyze My Complexion" to run our visual engine.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
