import React, { useState } from "react";
import { Sparkles, Calendar, Award, Clock, ArrowRight, ShoppingBag, Check, RefreshCw } from "lucide-react";
import { Product } from "../types";

interface RoutineStep {
  step: string;
  text: string;
  time: string;
}

interface RoutineData {
  title: string;
  duration: string;
  difficulty: string;
  steps: RoutineStep[];
  proTip: string;
}

interface MakeupRoutinePlannerProps {
  onAddProductToCart: (productId: string, shade?: string) => void;
  products: Product[];
}

export default function MakeupRoutinePlanner({ onAddProductToCart, products }: MakeupRoutinePlannerProps) {
  const [occasion, setOccasion] = useState<string>("Office Look");
  const [budget, setBudget] = useState<string>("Flexible");
  const [experience, setExperience] = useState<string>("Beginner");
  const [planning, setPlanning] = useState<boolean>(false);
  const [routine, setRoutine] = useState<RoutineData | null>(null);

  const occasions = ["Office Look", "College Look", "Wedding Look", "Festival Glow", "Date Night Classic"];
  const budgets = ["Budget Friendly", "Premium Luxury", "Flexible"];
  const experiences = ["Beginner", "Intermediate", "Professional"];

  const generateRoutine = async () => {
    setPlanning(true);
    setRoutine(null);

    try {
      const response = await fetch("/api/ai/routine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ occasion, budget, experience }),
      });

      if (!response.ok) {
        throw new Error();
      }

      const data = await response.json();
      
      // Artificial beauty curation loading animation
      setTimeout(() => {
        setRoutine(data);
        setPlanning(false);
      }, 1500);

    } catch (err) {
      setPlanning(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4" id="ai-makeup-planner-container">
      {/* Header */}
      <div className="text-center mb-10">
        <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold uppercase tracking-widest">
          Dynamic Skin Calendar
        </span>
        <h1 className="text-4xl font-light font-display mt-3">
          AI Makeup <span className="font-semibold italic bg-clip-text text-transparent bg-gradient-to-r from-amber-600 via-rose-500 to-indigo-500">Routine Planner</span>
        </h1>
        <p className="text-slate-500 max-w-xl mx-auto mt-2 text-sm">
          Plan tailored look timetables dynamically. Input detail conditions, and let our beauty engine assemble steps using products containing appropriate density formulas just for you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left selector form */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl shadow-sm border border-amber-100/60 space-y-5">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Customize My Curation</span>
          </h2>

          {/* Occasion */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">
              1. What is the occasion?
            </label>
            <div className="flex flex-wrap gap-2">
              {occasions.map((o) => (
                <button
                  key={o}
                  onClick={() => setOccasion(o)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium cursor-pointer border transition-all ${
                    occasion === o
                      ? "bg-slate-900 border-slate-900 text-white shadow-xs"
                      : "bg-slate-50 border-slate-100 text-slate-600 hover:border-amber-200"
                  }`}
                >
                  {o}
                </button>
              ))}
            </div>
          </div>

          {/* Budget */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">
              2. Budget Bracket
            </label>
            <div className="flex flex-wrap gap-2">
              {budgets.map((b) => (
                <button
                  key={b}
                  onClick={() => setBudget(b)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium cursor-pointer border transition-all ${
                    budget === b
                      ? "bg-slate-900 border-slate-900 text-white shadow-xs"
                      : "bg-slate-50 border-slate-100 text-slate-600 hover:border-amber-200"
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Experience level */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">
              3. Experience / Skill Level
            </label>
            <div className="flex flex-wrap gap-2">
              {experiences.map((exp) => (
                <button
                  key={exp}
                  onClick={() => setExperience(exp)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium cursor-pointer border transition-all ${
                    experience === exp
                      ? "bg-slate-900 border-slate-900 text-white shadow-xs"
                      : "bg-slate-50 border-slate-100 text-slate-600 hover:border-amber-200"
                  }`}
                >
                  {exp}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={generateRoutine}
            disabled={planning}
            className="w-full py-4 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 text-white rounded-full text-xs font-bold shadow-md tracking-wider cursor-pointer mt-4 transition-all flex items-center justify-center gap-1.5"
          >
            {planning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Assembling Curation Steps...</span>
              </>
            ) : (
              <>
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>Assemble Look Timetable</span>
              </>
            )}
          </button>
        </div>

        {/* Right Output routine visualization */}
        <div className="lg:col-span-7">
          {routine ? (
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-amber-100/60 animate-fade-in space-y-6">
              
              {/* Header result */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">{routine.title}</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Custom computed for {occasion}</p>
                </div>

                <div className="flex gap-2 shrink-0">
                  <span className="flex items-center gap-1 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full text-xs font-bold border border-amber-200">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{routine.duration || "15 mins"}</span>
                  </span>
                  <span className="flex items-center gap-1 bg-violet-50 text-violet-700 px-3 py-1.5 rounded-full text-xs font-bold border border-violet-200">
                    <Award className="w-3.5 h-3.5" />
                    <span>{routine.difficulty || "Beginner"}</span>
                  </span>
                </div>
              </div>

              {/* Steps timeline list */}
              <div className="relative border-l-2 border-slate-100 pl-6 space-y-6 ml-3">
                {routine.steps.map((st, index) => (
                  <div key={index} className="relative group">
                    {/* Circle timeline dot */}
                    <span className="absolute -left-[31px] top-0.5 w-4 h-4 bg-white border-2 border-amber-500 rounded-full flex items-center justify-center text-[10px] font-bold text-amber-600 transition-all group-hover:scale-110">
                      {index + 1}
                    </span>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">{st.step}</h4>
                        <span className="text-[10px] text-slate-400 font-bold bg-slate-50 px-2 py-0.5 rounded-md">
                          {st.time}
                        </span>
                      </div>
                      <p className="text-xs md:text-sm text-slate-600 leading-normal">
                        {st.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Master Artist Pro Tip */}
              {routine.proTip && (
                <div className="p-4 bg-gradient-to-r from-amber-500/10 to-pink-500/10 rounded-2xl border border-amber-200/50">
                  <span className="text-[10px] font-extrabold text-amber-800 uppercase tracking-widest block mb-1">
                    🌟 GOLDEN BEAUTY-CHALLENGE PRO-TIP:
                  </span>
                  <p className="text-xs text-slate-700 font-medium italic">
                    "{routine.proTip}"
                  </p>
                </div>
              )}

              {/* Suggested dynamic checkout checklist */}
              <div className="mt-6 pt-5 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                  Checklist: Products for this Routine
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {products.slice(0, 4).map((p) => (
                    <div
                      key={p.id}
                      className="p-3 bg-slate-50 hover:bg-slate-100/50 transition-all rounded-xl border border-slate-100 flex items-center justify-between"
                    >
                      <div className="truncate pr-2">
                        <span className="text-[9px] text-amber-700 font-bold block">{p.brand}</span>
                        <span className="text-xs font-bold text-slate-800 truncate block">{p.name}</span>
                      </div>

                      <button
                        onClick={() => onAddProductToCart(p.id, p.shades?.[0] || "Default")}
                        className="px-2.5 py-1.5 bg-slate-900 text-white rounded-lg text-[10px] font-bold hover:bg-slate-800 shrink-0 cursor-pointer flex items-center gap-1"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>₹{p.price}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="h-full bg-slate-50 border border-dashed border-slate-200 p-8 rounded-3xl flex flex-col items-center justify-center min-h-[350px] text-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-300 mb-4 animate-pulse">
                <Calendar className="w-6 h-6 text-slate-400" />
              </div>
              <p className="text-sm font-semibold text-slate-700">Ready to formulate lookup steps</p>
              <p className="text-xs text-slate-400 max-w-sm mt-1">
                Pick occasion goals, budget sizes, and expertise on the left panel, and click "Assemble Look Timetable" to trigger the custom routine compilation.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
