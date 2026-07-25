import React from 'react';
import { Sparkles, Brain, Bot, MessageSquare } from 'lucide-react';

interface FloatingAskAIProps {
  currentPage: string;
  onNavigate: (page: string, params?: Record<string, any>) => void;
  currentMcqContext?: string;
}

export const FloatingAskAI: React.FC<FloatingAskAIProps> = ({
  currentPage,
  onNavigate,
  currentMcqContext,
}) => {
  // Hide on AI Tutor page itself to avoid duplication
  if (currentPage === 'ai-tutor') return null;

  const handleClick = () => {
    if (currentMcqContext) {
      onNavigate('ai-tutor', { prompt: currentMcqContext });
    } else {
      onNavigate('ai-tutor');
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={handleClick}
        className="group relative flex items-center gap-2.5 px-4 sm:px-5 py-3 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/40 hover:scale-105 transition-all duration-300 border border-white/20 active:scale-95"
        title="Ask EntryAce AI Tutor"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
        </span>

        <div className="flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
          <span>Ask AI Tutor</span>
        </div>

        <div className="hidden group-hover:flex items-center gap-1 pl-1 text-[11px] text-purple-200 border-l border-white/20">
          <Brain className="w-3.5 h-3.5" />
        </div>
      </button>
    </div>
  );
};
