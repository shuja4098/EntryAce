import React from 'react';
import { Sparkles, Brain, CheckCircle2, Trophy, Zap, BookOpen, Clock } from 'lucide-react';

export const HeroIllustration: React.FC = () => {
  return (
    <div id="hero-illustration-container" className="relative w-full max-w-lg lg:max-w-xl mx-auto py-4">
      {/* Glow Effects */}
      <div className="absolute -top-10 -left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl pointer-events-none" />

      {/* Main Glassmorphism Dashboard Card */}
      <div className="relative bg-white/85 backdrop-blur-xl border border-white/90 rounded-[32px] p-6 shadow-2xl shadow-blue-900/10 space-y-5 transition-all duration-500 hover:shadow-blue-900/15">
        {/* Top Header Mockup */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800">NED & FAST Simulator</div>
              <div className="text-[10px] text-slate-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Practice Session
              </div>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            2026 Test Pattern
          </span>
        </div>

        {/* Live Question Box */}
        <div className="p-4 rounded-2xl bg-slate-50/90 border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between text-[11px] font-semibold text-purple-700">
            <span className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" /> Mathematics • Calculus
            </span>
            <span className="flex items-center gap-1 text-slate-500">
              <Clock className="w-3 h-3" /> 00:42 Mins
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-800 leading-snug">
            Q: Find the value of <span className="font-mono text-purple-700 font-bold bg-purple-50 px-1.5 py-0.5 rounded">lim (x → 0) [sin(3x) / x]</span>
          </p>
          
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600">A) 0</div>
            <div className="p-2 rounded-xl bg-emerald-500 text-white font-bold border border-emerald-600 flex items-center justify-between shadow-xs">
              <span>B) 3</span>
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <div className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600">C) 1</div>
            <div className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600">D) Undefined</div>
          </div>
        </div>

        {/* Gemini AI Step-by-Step Response Mockup */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-900 via-slate-900 to-indigo-950 text-white space-y-2.5 shadow-lg border border-purple-800/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-purple-300 font-bold text-xs">
              <Brain className="w-4 h-4 text-purple-400" />
              <span>Gemini AI Instant Tutor</span>
            </div>
            <span className="text-[9px] bg-purple-800/80 text-purple-200 px-2 py-0.5 rounded-full font-semibold">
              Fast L'Hôpital Shortcut
            </span>
          </div>
          <p className="text-[11px] text-slate-200 leading-relaxed">
            Standard limit rule: <span className="text-purple-300 font-mono">lim (x → 0) [sin(kx) / x] = k</span>. Here k = 3, so answer is <strong className="text-emerald-300">3</strong>.
          </p>
        </div>

        {/* Aggregate Progress Footer */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-xs">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-800">Est. Aggregate</div>
              <div className="text-[10px] text-slate-500">84.5% (High CS Seat Merit)</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs font-black text-emerald-600">92% Accuracy</div>
            <div className="text-[10px] text-slate-400">120 MCQs Attempted</div>
          </div>
        </div>
      </div>

      {/* Floating Badge 1: NED Admission Badge */}
      <div className="absolute -top-4 -right-4 bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-xl border border-white flex items-center gap-2.5 z-20 animate-bounce transition-transform duration-1000">
        <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
          NED
        </div>
        <div>
          <div className="text-xs font-bold text-slate-900">Phase 1 Pattern</div>
          <div className="text-[10px] text-blue-600 font-semibold">100 MCQs • No Neg.</div>
        </div>
      </div>

      {/* Floating Badge 2: FAST Negative Marking Calculator */}
      <div className="absolute -bottom-5 -left-4 bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-xl border border-white flex items-center gap-2.5 z-20 shadow-purple-500/10">
        <div className="w-7 h-7 rounded-lg bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
          FAST
        </div>
        <div>
          <div className="text-xs font-bold text-slate-900">Negative Marking</div>
          <div className="text-[10px] text-purple-600 font-semibold">0.25 Deduction Sim</div>
        </div>
      </div>
    </div>
  );
};
