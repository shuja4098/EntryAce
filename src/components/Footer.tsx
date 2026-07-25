import React from 'react';
import { GraduationCap, Sparkles, Heart, ShieldCheck, CheckCircle2, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onNavigate?: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">
                Entry<span className="text-blue-400">Ace</span>
                <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-900/60 text-purple-300 border border-purple-700/50">
                  <Sparkles className="w-2.5 h-2.5" /> AI
                </span>
              </span>
            </div>
            
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Pakistan's premier AI-powered university entry test preparation platform. Master NED, FAST-NUCES, NUST, and top engineering & CS entry tests with instant step-by-step AI guidance.
            </p>

            <div className="flex items-center gap-2 pt-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Aligned with 2026 Official Test Patterns</span>
            </div>
          </div>

          {/* Supported Universities */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Supported Tests
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button 
                  onClick={() => onNavigate?.('universities')} 
                  className="hover:text-blue-400 flex items-center gap-2 text-slate-300 transition-colors"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>NED University Test</span>
                  <span className="text-[10px] bg-blue-900/80 text-blue-300 font-semibold px-1.5 py-0.5 rounded">Active</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate?.('universities')} 
                  className="hover:text-purple-400 flex items-center gap-2 text-slate-300 transition-colors"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>FAST-NUCES Entry Test</span>
                  <span className="text-[10px] bg-purple-900/80 text-purple-300 font-semibold px-1.5 py-0.5 rounded">Active</span>
                </button>
              </li>
              <li>
                <span className="text-slate-500 flex items-center gap-2 text-xs">
                  <span>NUST (NET Series)</span>
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">Soon</span>
                </span>
              </li>
              <li>
                <span className="text-slate-500 flex items-center gap-2 text-xs">
                  <span>GIKI Entry Test</span>
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">Soon</span>
                </span>
              </li>
              <li>
                <span className="text-slate-500 flex items-center gap-2 text-xs">
                  <span>UET (ECAT Punjab)</span>
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">Soon</span>
                </span>
              </li>
              <li>
                <span className="text-slate-500 flex items-center gap-2 text-xs">
                  <span>IBA Karachi (CS & Math)</span>
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">Soon</span>
                </span>
              </li>
            </ul>
          </div>

          {/* Platform Features */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Core Platform
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <button onClick={() => onNavigate?.('practice')} className="hover:text-white transition-colors">
                  Subject-wise MCQs
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate?.('practice')} className="hover:text-white transition-colors">
                  Timed Mock Simulator
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate?.('ai-tutor')} className="hover:text-purple-300 transition-colors flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  Step-by-Step AI Tutor
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate?.('dashboard')} className="hover:text-white transition-colors">
                  Accuracy & Analytics
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate?.('dashboard')} className="hover:text-white transition-colors">
                  Weakness Topic Radar
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Contact & Info */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              EntryAce AI
            </h4>
            <div className="space-y-3 text-xs text-slate-400">
              <p>Designed for future engineers and computer scientists in Pakistan.</p>
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 space-y-1">
                <span className="text-xs font-semibold text-blue-400 block">⚡ Next Test Dates</span>
                <p className="text-[11px] text-slate-300">NED Phase 1 & FAST Admissions 2026 preparation live now.</p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} EntryAce AI. All rights reserved. Built for University Admissions.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="text-slate-400 flex items-center gap-1">
              Made for Students <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
