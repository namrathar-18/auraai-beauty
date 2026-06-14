import React, { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Mic, MicOff, RefreshCw, Bot, User, ShoppingBag, ArrowRight } from "lucide-react";
import { Product } from "../types";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
}

interface AIBeautyGPTProps {
  onAddProductToCart: (productId: string, shade?: string) => void;
  products: Product[];
}

export default function AIBeautyGPT({ onAddProductToCart, products }: AIBeautyGPTProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      sender: "bot",
      text: "Hello, gorgeous! 🌸 I am your bespoke **AuraAI Beauty Assistant**. I'm trained on cosmetic ingredients, skincare, and bridal looks. Ask me for recommendations or say 'Create a professional office look'!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState<string>("");
  const [chatting, setChatting] = useState<boolean>(false);
  const [voiceActive, setVoiceActive] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const samplePrompts = [
    "What lipstick suits wheatish skin tone?",
    "Create a dewy morning bridal skincare routine.",
    "Which products are best for dry acne-prone skin?",
    "Show me Maybelline or Lakmé items under ₹1000."
  ];

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chatting]);

  const handleSend = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed) return;

    const userMsg: Message = {
      id: "u_" + Date.now(),
      sender: "user",
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setChatting(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          history: messages.map((m) => ({ sender: m.sender, text: m.text }))
        }),
      });

      if (!response.ok) {
        throw new Error();
      }

      const data = await response.json();
      
      setMessages((prev) => [
        ...prev,
        {
          id: "b_" + Date.now(),
          sender: "bot",
          text: data.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      // Fallback is handled beautifully on server as well
      setMessages((prev) => [
        ...prev,
        {
          id: "b_err_" + Date.now(),
          sender: "bot",
          text: "Lovely, my system is currently updating its formulaic database. Let me suggest adding the excellent **Clinique Moisture Surge** or **M.A.C Modern Matte** to revive your look! What is your skin type?",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setChatting(false);
    }
  };

  // Simulate Speak Recognition voice dictation helper
  const toggleVoice = () => {
    if (voiceActive) {
      setVoiceActive(false);
    } else {
      setVoiceActive(true);
      // Simulate speaking dictation text
      setTimeout(() => {
        setInput("Recommend a lipstick of M.A.C brand");
        setVoiceActive(false);
      }, 2500);
    }
  };

  // Smart regex helper to detect products referenced inside bot strings
  const detectAndRenderShortcuts = (text: string) => {
    const words = text.toLowerCase();
    const suggestions: Product[] = [];

    products.forEach((p) => {
      if (words.includes(p.name.toLowerCase()) || words.includes(p.brand.toLowerCase())) {
        if (!suggestions.some((s) => s.id === p.id)) {
          suggestions.push(p);
        }
      }
    });

    if (suggestions.length === 0) return null;

    return (
      <div className="mt-3.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col gap-2">
        <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">
          One-Click Smart Cart Actions:
        </span>
        <div className="flex flex-wrap gap-2">
          {suggestions.slice(0, 3).map((prod) => (
            <button
              key={prod.id}
              onClick={() => onAddProductToCart(prod.id, prod.shades?.[0] || "Default")}
              className="px-3 py-1.5 bg-white hover:bg-rose-50 border border-slate-100 text-[10px] font-bold text-slate-700 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
            >
              <ShoppingBag className="w-3 h-3 text-rose-500" />
              <span>Bag {prod.brand} {prod.name.split(" ")[0]} ...</span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4" id="ai-beauty-gpt-container">
      {/* Header */}
      <div className="text-center mb-6">
        <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold uppercase tracking-widest">
          Conversational Assistant
        </span>
        <h1 className="text-4xl font-light font-display mt-3">
          AI Beauty<span className="font-semibold italic bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-pink-500 to-rose-500">GPT</span>
        </h1>
        <p className="text-slate-500 max-w-md mx-auto mt-2 text-xs md:text-sm">
          Your direct private hotline to a cosmetic scientist. Ask questions about shade selections, safety, or request a complete personalized skincare outline.
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-pink-100/60 overflow-hidden flex flex-col h-[520px]">
        {/* Top title bar */}
        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-rose-400 to-indigo-400 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold">AuraAI Advisor</h2>
              <span className="text-[10px] text-pink-300 font-bold block">● Luxury Consultant Online</span>
            </div>
          </div>
          <button
            onClick={() => setMessages([messages[0]])}
            className="text-xs text-slate-400 hover:text-white cursor-pointer transition-colors"
            title="Clear conversation log"
          >
            Clear Log
          </button>
        </div>

        {/* Scrollable messages arena */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50/50 space-y-4">
          {messages.map((m) => {
            const isBot = m.sender === "bot";
            return (
              <div
                key={m.id}
                className={`flex gap-3 max-w-[85%] ${isBot ? "mr-auto" : "ml-auto flex-row-reverse"}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold ${
                    isBot ? "bg-slate-900 text-white" : "bg-gradient-to-tr from-pink-400 to-violet-500 text-white"
                  }`}
                >
                  {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                {/* Bubble */}
                <div className="flex flex-col">
                  <div
                    className={`p-4 rounded-3xl text-xs md:text-sm leading-relaxed ${
                      isBot
                        ? "bg-white text-slate-800 rounded-tl-none border border-slate-100 shadow-3xs"
                        : "bg-slate-900 text-white rounded-tr-none"
                    }`}
                  >
                    {/* Render message with bold formatting matches */}
                    <p style={{ whiteSpace: "pre-line" }}>{m.text}</p>

                    {/* Render smart shopping shortcuts if bot is referring products */}
                    {isBot && detectAndRenderShortcuts(m.text)}
                  </div>
                  <span
                    className={`text-[9px] text-slate-400 mt-1 block ${
                      isBot ? "text-left" : "text-right"
                    }`}
                  >
                    {m.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {chatting && (
            <div className="flex gap-3 mr-auto max-w-[80%] items-center text-xs text-slate-400 font-bold animate-pulse">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                <RefreshCw className="w-4 h-4 animate-spin text-indigo-500" />
              </div>
              <span>AuraAI is consulting scientific registers...</span>
            </div>
          )}

          <div ref={scrollRef} />
        </div>

        {/* voice waveform modal simulator info */}
        {voiceActive && (
          <div className="bg-indigo-50 px-6 py-2 border-t border-indigo-100 flex items-center justify-between text-xs text-indigo-700 font-semibold animate-pulse">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping"></span>
              <span>LISTENING... Speak your beauty concern now</span>
            </span>
            <div className="flex gap-1">
              <span className="w-1 h-3 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
              <span className="w-1 h-4 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
              <span className="w-1 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }} />
            </div>
          </div>
        )}

        {/* Input interface bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
          className="bg-white p-4 border-t border-slate-100 flex gap-2 items-center"
        >
          {/* Voice Mic Toggle */}
          <button
            type="button"
            onClick={toggleVoice}
            className={`p-3 rounded-full cursor-pointer transition-all ${
              voiceActive
                ? "bg-red-500 text-white animate-pulse"
                : "bg-slate-100 hover:bg-slate-200 text-slate-600"
            }`}
            title="Speech Beauty Assistant Input (Click to Speak)"
          >
            {voiceActive ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={voiceActive}
            placeholder={voiceActive ? "Dictating your audio query..." : "Ask me anything e.g. 'bridal makeup routine'..."}
            className="flex-1 bg-slate-50 text-slate-800 text-xs md:text-sm p-3.5 rounded-full border border-slate-100 focus:outline-hidden focus:ring-1 focus:ring-slate-300 disabled:bg-slate-100"
          />

          <button
            type="submit"
            disabled={!input.trim()}
            className="p-3.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 text-white rounded-full cursor-pointer transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Suggested quick template prompt starters */}
      <div className="mt-4">
        <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mb-2">
          Suggested Consultation Starters:
        </p>
        <div className="flex flex-wrap gap-2">
          {samplePrompts.map((p, i) => (
            <button
              key={i}
              onClick={() => handleSend(p)}
              className="px-3.5 py-2 bg-white hover:bg-indigo-50/50 border border-slate-100 hover:border-indigo-200 rounded-full text-xs text-slate-600 cursor-pointer transition-all flex items-center gap-1 text-left"
            >
              <span>{p}</span>
              <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
