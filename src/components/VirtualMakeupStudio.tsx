import React, { useState } from "react";
import { Sparkles, Camera, Eye, HelpCircle, ArrowLeftRight, Paintbrush, RefreshCw, ShoppingBag, Sliders } from "lucide-react";
import { Product } from "../types";

// Curated shade pallets
const LIPSTICK_PALETTE = [
  { name: "Iconic Ruby Red", hex: "#dc2626", id: "ruby" },
  { name: "Velvet Rosy Pink", hex: "#ec4899", id: "rose" },
  { name: "Creamy Warm Nude", hex: "#b45309", id: "nude" },
  { name: "Deep Plum Burgundy", hex: "#701a75", id: "plum" }
];

const BLUSH_PALETTE = [
  { name: "Sunset Peach", hex: "#f97316", id: "peach" },
  { name: "Soft Radiant Coral", hex: "#f43f5e", id: "coral" },
  { name: "Glow Rose", hex: "#f472b6", id: "rose_blush" }
];

const EYELINER_PALETTE = [
  { name: "Jet Black Wing", hex: "#000000", id: "black" },
  { name: "Metallic Bronze", hex: "#854d0e", id: "bronze" },
  { name: "Charcoal Slate", hex: "#334155", id: "charcoal" }
];

interface VirtualMakeupStudioProps {
  onAddProductToCart: (productId: string, shade?: string) => void;
  products: Product[];
}

export default function VirtualMakeupStudio({ onAddProductToCart, products }: VirtualMakeupStudioProps) {
  const [activeCategory, setActiveCategory] = useState<"Lipstick" | "Blush" | "Eyeliner">("Lipstick");
  const [selectedShade, setSelectedShade] = useState(LIPSTICK_PALETTE[0]);
  const [opacity, setOpacity] = useState<number>(60);
  const [brushSize, setBrushSize] = useState<number>(12);
  const [showOriginal, setShowOriginal] = useState<boolean>(false);
  const [modelImage, setModelImage] = useState<string>("https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600");
  const [customColor, setCustomColor] = useState<string>("#e11d48");

  const handleCustomColor = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomColor(val);
    setSelectedShade({ name: "Custom Hue", hex: val, id: "custom" });
  };

  const handleCategorySwitch = (cat: "Lipstick" | "Blush" | "Eyeliner") => {
    setActiveCategory(cat);
    if (cat === "Lipstick") {
      setSelectedShade(LIPSTICK_PALETTE[0]);
    } else if (cat === "Blush") {
      setSelectedShade(BLUSH_PALETTE[0]);
    } else if (cat === "Eyeliner") {
      setSelectedShade(EYELINER_PALETTE[0]);
    }
  };

  const handleUploadFace = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setModelImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Find matching shop item dynamically
  const getMatchingItemInfo = () => {
    if (activeCategory === "Lipstick") {
      return {
        product: products.find((p) => p.category === "Lipsticks") || products[0],
        label: "Authentic Modern Matte Formula"
      };
    } else if (activeCategory === "Blush") {
      return {
        product: products.find((p) => p.category === "Blush") || products[8],
        label: "Absolute Stylist Blush Duo"
      };
    } else {
      return {
        product: products.find((p) => p.category === "Eyeliners") || products[9],
        label: "Colossal Bold Smudgeproof Stick"
      };
    }
  };

  const matched = getMatchingItemInfo();

  return (
    <div className="max-w-6xl mx-auto py-8 px-4" id="virtual-studio-container">
      {/* Header */}
      <div className="text-center mb-10">
        <span className="px-3 py-1 rounded-full bg-pink-100 text-pink-600 text-xs font-bold uppercase tracking-widest">
          AR Try-On Interactive Engine
        </span>
        <h1 className="text-4xl md:text-5xl font-light font-display mt-3">
          Virtual <span className="font-semibold italic bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-rose-600">Makeup Studio</span>
        </h1>
        <p className="text-slate-500 max-w-xl mx-auto mt-2 text-sm md:text-base">
          Try high-pigment lipsticks, blushes, and eyeliners instantly! Move sliders, pick colors, and compare "Before vs After" styles. Zero mess, realistic computer vision blends.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Side: AR Viewport Frame  */}
        <div className="lg:col-span-7 bg-white p-4 rounded-3xl shadow-sm border border-pink-100/60 flex flex-col justify-between">
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-900 shadow-inner group">
            
            {/* The base portrait of model or user upload */}
            <img
              src={modelImage}
              alt="Interactive Virtual Face"
              className="w-full h-full object-cover select-none transition-filter duration-300"
              style={{
                filter: showOriginal ? "none" : "contrast(1.02) saturate(1.01)",
              }}
              referrerPolicy="no-referrer"
            />

            {/* Simulated Live AR Overlay Makeup Layer with CSS blends */}
            {!showOriginal && (
              <div className="absolute inset-0 pointer-events-none transition-opacity duration-300">
                {/* Lipstick AR simulation boundary */}
                {activeCategory === "Lipstick" && (
                  <div 
                    className="absolute bottom-[28%] left-1/2 -translate-x-1/2 w-[18%] h-[3%] rounded-full blur-xs mix-blend-multiply transition-all duration-300"
                    style={{
                      backgroundColor: selectedShade.hex,
                      opacity: opacity / 100,
                      transform: `translateX(-50%) scale(${1 + brushSize / 25})`
                    }}
                  ></div>
                )}

                {/* Blush AR simulation cheeks */}
                {activeCategory === "Blush" && (
                  <>
                    {/* Left Cheek */}
                    <div 
                      className="absolute top-[45%] left-[28%] w-[16%] h-[12%] rounded-full blur-xl mix-blend-color-burn transition-all duration-300"
                      style={{
                        backgroundColor: selectedShade.hex,
                        opacity: opacity / 230,
                      }}
                    ></div>
                    {/* Right Cheek */}
                    <div 
                      className="absolute top-[44%] right-[28%] w-[16%] h-[12%] rounded-full blur-xl mix-blend-color-burn transition-all duration-300"
                      style={{
                        backgroundColor: selectedShade.hex,
                        opacity: opacity / 230,
                      }}
                    ></div>
                  </>
                )}

                {/* Eyeliner overlay around eyes */}
                {activeCategory === "Eyeliner" && (
                  <>
                    {/* Left orbital wing */}
                    <div 
                      className="absolute top-[37%] left-[34%] w-[12%] h-[1%] bg-slate-950 rounded-full blur-[1px] -rotate-3 transition-all duration-300"
                      style={{
                        backgroundColor: selectedShade.hex,
                        opacity: opacity / 110,
                        transform: `scaleY(${brushSize / 10})`
                      }}
                    ></div>
                    {/* Right orbital wing */}
                    <div 
                      className="absolute top-[37%] right-[34%] w-[12%] h-[1%] bg-slate-950 rounded-full blur-[1px] rotate-3 transition-all duration-300"
                      style={{
                        backgroundColor: selectedShade.hex,
                        opacity: opacity / 110,
                        transform: `scaleY(${brushSize / 10})`
                      }}
                    ></div>
                  </>
                )}
              </div>
            )}

            {/* Before After Toggle overlay */}
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center bg-black/40 backdrop-blur-md p-3 rounded-xl border border-white/10 text-white">
              <span className="text-[10px] font-bold tracking-widest uppercase text-pink-300 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-ping"></span>
                <span>Active AR Engine</span>
              </span>

              <div className="flex gap-2">
                <button
                  onMouseDown={() => setShowOriginal(true)}
                  onMouseUp={() => setShowOriginal(false)}
                  onTouchStart={() => setShowOriginal(true)}
                  onTouchEnd={() => setShowOriginal(false)}
                  className="px-3 py-1 bg-white/20 hover:bg-white/30 text-xs font-bold rounded-lg cursor-pointer transition-colors flex items-center gap-1"
                  title="Hold to see original"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5" />
                  <span>Hold Before</span>
                </button>
              </div>
            </div>
            
            {opacity < 15 && (
              <div className="absolute top-4 left-4 p-2 bg-yellow-500 text-white rounded-lg text-xs font-bold">
                Opacity Low! Bump slider below to brighten.
              </div>
            )}
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4 mt-4">
            <label className="w-full md:w-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer text-center flex items-center justify-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-slate-500" />
              <span>Use My Custom Selfie</span>
              <input type="file" onChange={handleUploadFace} accept="image/*" className="hidden" />
            </label>
            <button
              onClick={() => setModelImage("https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600")}
              className="text-xs text-slate-400 hover:text-slate-600 font-semibold cursor-pointer underline"
            >
              Reset to Default Model
            </button>
          </div>
        </div>

        {/* Right Side: Cosmetic Color Controls Panel */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Menu category choice */}
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-pink-100/60">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Choose Product Line</h3>
            <div className="grid grid-cols-3 gap-2">
              {(["Lipstick", "Blush", "Eyeliner"] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategorySwitch(cat)}
                  className={`py-3.5 text-xs font-bold rounded-2xl cursor-pointer border transition-all ${
                    activeCategory === cat
                      ? "bg-slate-900 border-slate-900 text-white shadow-xs"
                      : "bg-slate-50 border-slate-100 text-slate-600 hover:bg-rose-50/40"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Saturated Shaded Color Palette dots */}
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-pink-100/60">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex justify-between items-center">
              <span>Select Hue</span>
              <span className="text-[10px] text-pink-600 font-bold">{selectedShade.name}</span>
            </h3>

            <div className="flex flex-wrap gap-3 mb-4">
              {/* Load appropriate palette */}
              {activeCategory === "Lipstick" &&
                LIPSTICK_PALETTE.map((shade) => (
                  <button
                    key={shade.id}
                    onClick={() => setSelectedShade(shade)}
                    className={`w-10 h-10 rounded-full border-3 transition-all relative ${
                      selectedShade.id === shade.id ? "border-slate-800 scale-110 shadow-md" : "border-white hover:scale-105"
                    }`}
                    style={{ backgroundColor: shade.hex }}
                    title={shade.name}
                  ></button>
                ))}

              {activeCategory === "Blush" &&
                BLUSH_PALETTE.map((shade) => (
                  <button
                    key={shade.id}
                    onClick={() => setSelectedShade(shade)}
                    className={`w-10 h-10 rounded-full border-3 transition-all relative ${
                      selectedShade.id === shade.id ? "border-slate-800 scale-110 shadow-md" : "border-white hover:scale-105"
                    }`}
                    style={{ backgroundColor: shade.hex }}
                    title={shade.name}
                  ></button>
                ))}

              {activeCategory === "Eyeliner" &&
                EYELINER_PALETTE.map((shade) => (
                  <button
                    key={shade.id}
                    onClick={() => setSelectedShade(shade)}
                    className={`w-10 h-10 rounded-full border-3 transition-all relative ${
                      selectedShade.id === shade.id ? "border-slate-800 scale-110 shadow-md" : "border-white hover:scale-105"
                    }`}
                    style={{ backgroundColor: shade.hex }}
                    title={shade.name}
                  ></button>
                ))}
            </div>

            {/* Custom hex picker */}
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                <Paintbrush className="w-3.5 h-3.5 text-pink-500" />
                <span>Custom Tint Hex:</span>
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={customColor}
                  onChange={handleCustomColor}
                  className="w-8 h-8 rounded-full border-0 cursor-pointer overflow-hidden p-0"
                />
                <span className="text-xs font-mono font-bold text-slate-700 bg-slate-50 px-2 py-1 rounded-md">
                  {selectedShade.hex.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Sliders: opacity & brush thickness */}
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-pink-100/60 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-slate-500" />
              <span>AR Finish Adjustments</span>
            </h3>

            {/* Opacity slider */}
            <div>
              <div className="flex justify-between items-center text-xs text-slate-600 mb-1.5 font-bold">
                <span>Color Intensity (Opacity)</span>
                <span>{opacity}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={opacity}
                onChange={(e) => setOpacity(Number(e.target.value))}
                className="w-full accent-slate-900 cursor-pointer"
              />
            </div>

            {/* Brush size slider */}
            <div>
              <div className="flex justify-between items-center text-xs text-slate-600 mb-1.5 font-bold">
                <span>Application Footprint (Size)</span>
                <span>{brushSize}px</span>
              </div>
              <input
                type="range"
                min="4"
                max="30"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="w-full accent-slate-900 cursor-pointer"
              />
            </div>
          </div>

          {/* Direct Buy Connection */}
          {matched.product && (
            <div className="p-4 bg-gradient-to-r from-pink-500/10 to-indigo-500/10 rounded-3xl border border-pink-100/50 flex flex-col justify-between gap-3 shadow-xs">
              <div>
                <span className="text-[9px] bg-slate-900 text-white px-2.5 py-0.5 rounded-full font-bold">
                  MATCHING PRODUCT DETECTED
                </span>
                <p className="text-xs font-bold text-slate-800 mt-2">
                  {matched.product.brand} - {matched.product.name}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Shade mimicking: <span className="font-bold text-slate-700">{selectedShade.name}</span>
                </p>
              </div>

              <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-200/50">
                <span className="text-sm font-extrabold text-slate-800">₹{matched.product.price}</span>
                <button
                  onClick={() => onAddProductToCart(matched.product.id, selectedShade.name)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add Selected Shade</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
