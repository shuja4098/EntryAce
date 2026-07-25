import React, { useState, useEffect } from 'react';
import { 
  Bookmark, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Clock, 
  HelpCircle, 
  Brain,
  Share2,
  AlertCircle
} from 'lucide-react';
import { MCQ } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface MCQCardProps {
  mcq: MCQ;
  questionIndex: number;
  totalQuestions: number;
  chapterName: string;
  selectedOptionId: string | null;
  onSelectOption: (optionId: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  onSubmit: () => void;
  onAskAI: (mcq: MCQ) => void;
  timeSpentSeconds: number;
}

export const MCQCard: React.FC<MCQCardProps> = ({
  mcq,
  questionIndex,
  totalQuestions,
  chapterName,
  selectedOptionId,
  onSelectOption,
  onNext,
  onPrevious,
  onSubmit,
  onAskAI,
  timeSpentSeconds
}) => {
  const { toggleBookmarkMCQ } = useAuth();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [savingBookmark, setSavingBookmark] = useState(false);

  const isAnswered = selectedOptionId !== null;
  const isCorrect = selectedOptionId === mcq.correctOptionId;

  // Handle bookmarking with Firestore
  const handleBookmarkToggle = async () => {
    setSavingBookmark(true);
    const newState = await toggleBookmarkMCQ({
      id: mcq.id,
      question: mcq.question,
      subject: mcq.subject,
      universityId: mcq.universityId
    });
    setIsBookmarked(newState);
    setSavingBookmark(false);
  };

  const progressPercentage = Math.round(((questionIndex + 1) / totalQuestions) * 100);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Top Bar with Progress & Time */}
      <div className="bg-white/90 backdrop-blur-xl border border-slate-200/90 rounded-[28px] p-5 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-bold text-slate-600">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100 font-black">
              Question {questionIndex + 1} of {totalQuestions}
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-bold hidden sm:inline-block">
              {chapterName}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200/80 text-slate-700 font-bold">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              <span>{formatTime(timeSpentSeconds)}</span>
            </div>

            <button
              onClick={handleBookmarkToggle}
              disabled={savingBookmark}
              className={`p-2 rounded-xl border transition-all flex items-center gap-1.5 ${
                isBookmarked 
                  ? 'bg-amber-50 text-amber-600 border-amber-200 shadow-xs' 
                  : 'bg-slate-50 text-slate-500 border-slate-200 hover:text-slate-900'
              }`}
              title={isBookmarked ? 'Bookmarked in Firestore' : 'Bookmark Question'}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
              <span className="text-xs font-extrabold hidden sm:inline">
                {isBookmarked ? 'Saved' : 'Bookmark'}
              </span>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300 rounded-full"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Main Glassmorphism Question Box */}
      <div className="bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-[32px] p-6 sm:p-8 shadow-md space-y-6 relative overflow-hidden">
        
        {/* Difficulty Tag */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
              mcq.difficulty === 'easy' 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                : mcq.difficulty === 'medium'
                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}>
              {mcq.difficulty} Difficulty
            </span>
            <span className="text-xs text-slate-400 font-semibold">• {mcq.subject}</span>
          </div>

          <span className="text-xs font-bold text-slate-400">
            {mcq.universityId} Exam Pattern
          </span>
        </div>

        {/* Question Text */}
        <div className="space-y-3">
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-relaxed">
            {mcq.question}
          </h3>

          {mcq.codeSnippet && (
            <pre className="p-4 rounded-2xl bg-slate-900 text-emerald-300 font-mono text-xs sm:text-sm overflow-x-auto border border-slate-800">
              <code>{mcq.codeSnippet}</code>
            </pre>
          )}
        </div>

        {/* Options List */}
        <div className="space-y-3">
          {mcq.options.map((option) => {
            const isSelected = selectedOptionId === option.id;
            const isCorrectOption = option.id === mcq.correctOptionId;

            let optionStyle = "border-slate-200/80 bg-slate-50/60 hover:bg-white hover:border-blue-300 text-slate-800";
            let badgeStyle = "bg-white text-slate-700 border-slate-200";

            if (isAnswered) {
              if (isCorrectOption) {
                optionStyle = "border-emerald-500 bg-emerald-50/90 text-emerald-950 font-bold shadow-xs";
                badgeStyle = "bg-emerald-600 text-white border-emerald-600";
              } else if (isSelected && !isCorrectOption) {
                optionStyle = "border-rose-500 bg-rose-50/90 text-rose-950 font-bold shadow-xs";
                badgeStyle = "bg-rose-600 text-white border-rose-600";
              } else {
                optionStyle = "border-slate-200 opacity-60 bg-slate-50 text-slate-500";
              }
            }

            return (
              <button
                key={option.id}
                onClick={() => onSelectOption(option.id)}
                disabled={isAnswered}
                className={`w-full text-left p-4 sm:p-5 rounded-2xl border-2 transition-all flex items-start gap-4 cursor-pointer disabled:cursor-default ${optionStyle}`}
              >
                <div className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center shrink-0 border transition-colors ${badgeStyle}`}>
                  {option.id.toUpperCase()}
                </div>

                <div className="text-sm sm:text-base font-semibold pt-0.5 leading-snug flex-grow">
                  {option.text}
                </div>

                {isAnswered && isCorrectOption && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5 animate-bounce" />
                )}

                {isAnswered && isSelected && !isCorrectOption && (
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* Detailed Explanation & AI Tutor Prompt Button */}
        {isAnswered && (
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 text-white space-y-4 animate-fadeIn border border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-blue-300">Detailed Explanation</span>
              </div>

              <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                isCorrect ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              }`}>
                {isCorrect ? 'Correct Answer!' : 'Incorrect'}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 whitespace-pre-line leading-relaxed font-normal">
              {mcq.explanation}
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800">
              <span className="text-[11px] text-slate-400 font-medium">Need deeper step-by-step breakdown or vector diagrams?</span>
              <button
                onClick={() => onAskAI(mcq)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold text-xs hover:opacity-95 transition-all flex items-center gap-2 shadow-md shadow-blue-500/20"
              >
                <Brain className="w-4 h-4 text-purple-200" />
                <span>Ask AI to Explain</span>
              </button>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 gap-3">
          <button
            onClick={onPrevious}
            disabled={questionIndex === 0}
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-extrabold text-xs hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-2">
            {questionIndex === totalQuestions - 1 ? (
              <button
                onClick={onSubmit}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition-colors flex items-center gap-2 shadow-md"
              >
                <Check className="w-4 h-4" />
                <span>Submit Practice</span>
              </button>
            ) : (
              <button
                onClick={onNext}
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs transition-colors flex items-center gap-2 shadow-md"
              >
                <span>Next Question</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
