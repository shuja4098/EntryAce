import React from 'react';
import { 
  Trophy, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  RotateCcw, 
  ArrowRight, 
  Sparkles, 
  BarChart3, 
  Award, 
  Target 
} from 'lucide-react';

interface PracticeResultModalProps {
  universityName: string;
  subjectName: string;
  chapterName: string;
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  timeSpentSeconds: number;
  onRestart: () => void;
  onSelectChapter: () => void;
  onNavigateAI: (questionPrompt?: string) => void;
}

export const PracticeResultModal: React.FC<PracticeResultModalProps> = ({
  universityName,
  subjectName,
  chapterName,
  totalQuestions,
  correctCount,
  wrongCount,
  timeSpentSeconds,
  onRestart,
  onSelectChapter,
  onNavigateAI
}) => {
  const attempted = correctCount + wrongCount;
  const accuracy = attempted > 0 ? Math.round((correctCount / attempted) * 100) : 0;
  
  const minutes = Math.floor(timeSpentSeconds / 60);
  const seconds = timeSpentSeconds % 60;
  const timeFormatted = `${minutes}m ${seconds < 10 ? '0' : ''}${seconds}s`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-[32px] max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header Badge */}
        <div className="text-center space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-black uppercase tracking-wider border border-blue-100">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>Practice Session Complete</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Great Work! Keep Building Momentum
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            {universityName} • {subjectName} • <span className="font-bold text-slate-700">{chapterName}</span>
          </p>
        </div>

        {/* Main Score Ring & Accuracy Banner */}
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-[28px] p-6 text-center space-y-4 shadow-xl border border-slate-800 relative z-10">
          <div className="flex items-center justify-center gap-8">
            <div>
              <div className="text-4xl sm:text-5xl font-black text-emerald-400">
                {accuracy}%
              </div>
              <div className="text-xs text-slate-300 font-bold uppercase tracking-wider mt-1">Accuracy</div>
            </div>

            <div className="w-px h-12 bg-slate-800" />

            <div>
              <div className="text-4xl sm:text-5xl font-black text-blue-400">
                {correctCount}<span className="text-2xl text-slate-500 font-semibold">/{totalQuestions}</span>
              </div>
              <div className="text-xs text-slate-300 font-bold uppercase tracking-wider mt-1">Score</div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-center gap-2 text-xs font-semibold text-slate-300">
            <Award className="w-4 h-4 text-amber-400" />
            <span>
              {accuracy >= 80 ? 'Mastery Tier • Highly Prepared for Entrance Test!' : 'Solid Effort • Practice weak concepts to push above 80%!'}
            </span>
          </div>
        </div>

        {/* Detailed Metrics Grid */}
        <div className="grid grid-cols-3 gap-3 relative z-10">
          <div className="bg-emerald-50/80 border border-emerald-100 rounded-2xl p-3.5 text-center">
            <div className="flex items-center justify-center gap-1 text-emerald-700 text-xs font-extrabold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Correct</span>
            </div>
            <div className="text-xl font-black text-emerald-900 mt-1">{correctCount}</div>
          </div>

          <div className="bg-rose-50/80 border border-rose-100 rounded-2xl p-3.5 text-center">
            <div className="flex items-center justify-center gap-1 text-rose-700 text-xs font-extrabold">
              <XCircle className="w-3.5 h-3.5" />
              <span>Wrong</span>
            </div>
            <div className="text-xl font-black text-rose-900 mt-1">{wrongCount}</div>
          </div>

          <div className="bg-blue-50/80 border border-blue-100 rounded-2xl p-3.5 text-center">
            <div className="flex items-center justify-center gap-1 text-blue-700 text-xs font-extrabold">
              <Clock className="w-3.5 h-3.5" />
              <span>Time</span>
            </div>
            <div className="text-xl font-black text-blue-900 mt-1">{timeFormatted}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2 relative z-10">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onRestart}
              className="py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Session</span>
            </button>

            <button
              onClick={onSelectChapter}
              className="py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs transition-all flex items-center justify-center gap-2 shadow-md"
            >
              <span>Next Chapter</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => onNavigateAI(`I completed a practice session in ${subjectName} (${chapterName}). Can you explain common tricky concepts from this topic?`)}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-black text-xs hover:opacity-95 transition-all flex items-center justify-center gap-2 shadow-md shadow-blue-500/20"
          >
            <Sparkles className="w-4 h-4 text-purple-200" />
            <span>Discuss Weak Concepts with Gemini AI</span>
          </button>
        </div>
      </div>
    </div>
  );
};
