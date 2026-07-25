import React, { useState } from 'react';
import { CheckCircle2, XCircle, AlertCircle, ArrowLeft, Bot, Sparkles, Filter, ChevronRight } from 'lucide-react';
import { MCQ } from '../../types';

interface Props {
  questions: MCQ[];
  userAnswers: Record<string, string>;
  onBackToResult: () => void;
  onAskAITutor: (question: MCQ) => void;
}

export const MockTestReview: React.FC<Props> = ({
  questions,
  userAnswers,
  onBackToResult,
  onAskAITutor,
}) => {
  const [filter, setFilter] = useState<'all' | 'correct' | 'wrong' | 'skipped'>('all');

  const filteredQuestions = questions.filter((q) => {
    const userAns = userAnswers[q.id];
    const isCorrect = userAns === q.correctOptionId;
    const isSkipped = !userAns;

    if (filter === 'correct') return isCorrect;
    if (filter === 'wrong') return !isCorrect && !isSkipped;
    if (filter === 'skipped') return isSkipped;
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={onBackToResult}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Result Summary</span>
          </button>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Exam Answer Review
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Detailed step-by-step review of all {questions.length} questions
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/80 text-xs font-semibold">
          {(['all', 'correct', 'wrong', 'skipped'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setFilter(mode)}
              className={`px-3 py-1.5 rounded-lg capitalize transition ${
                filter === mode
                  ? 'bg-white text-slate-900 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Questions Review List */}
      <div className="space-y-6">
        {filteredQuestions.map((q, idx) => {
          const userAns = userAnswers[q.id];
          const isCorrect = userAns === q.correctOptionId;
          const isSkipped = !userAns;

          return (
            <div
              key={q.id}
              className={`bg-white/90 backdrop-blur-md rounded-2xl p-6 border transition-all ${
                isCorrect
                  ? 'border-emerald-200/80 shadow-sm'
                  : isSkipped
                  ? 'border-slate-200/80 shadow-sm'
                  : 'border-rose-200/80 shadow-sm'
              }`}
            >
              {/* Top Q Header */}
              <div className="flex items-center justify-between gap-2 mb-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="font-black text-slate-900 text-sm">Question {idx + 1}</span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-50 text-indigo-700">
                    {q.subject}
                  </span>
                  <span className="text-xs text-slate-500">{q.topic}</span>
                </div>

                <div>
                  {isCorrect ? (
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Correct
                    </span>
                  ) : isSkipped ? (
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Skipped
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" />
                      Incorrect
                    </span>
                  )}
                </div>
              </div>

              {/* Question Text */}
              <h3 className="font-bold text-slate-900 text-base leading-relaxed mb-4">
                {q.question}
              </h3>

              {/* Options Breakdown */}
              <div className="space-y-2.5 mb-5">
                {q.options.map((opt) => {
                  const isCorrectOpt = opt.id === q.correctOptionId;
                  const isUserChosen = opt.id === userAns;

                  let optClass = 'bg-white border-slate-200 text-slate-700';
                  if (isCorrectOpt) {
                    optClass = 'bg-emerald-50 border-emerald-500 font-bold text-emerald-950 ring-1 ring-emerald-500/20';
                  } else if (isUserChosen && !isCorrectOpt) {
                    optClass = 'bg-rose-50 border-rose-400 font-bold text-rose-950';
                  }

                  return (
                    <div
                      key={opt.id}
                      className={`p-3.5 rounded-xl border text-xs sm:text-sm flex items-center justify-between ${optClass}`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold uppercase ${
                          isCorrectOpt
                            ? 'bg-emerald-600 text-white'
                            : isUserChosen
                            ? 'bg-rose-600 text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {opt.id}
                        </span>
                        <span>{opt.text}</span>
                      </div>

                      <div>
                        {isCorrectOpt && (
                          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                            Correct Answer
                          </span>
                        )}
                        {isUserChosen && !isCorrectOpt && (
                          <span className="text-[11px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                            Your Choice
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Explanation Box */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 space-y-2">
                <div className="font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 text-[11px]">
                  <span>Detailed Explanation</span>
                </div>
                <p className="leading-relaxed">{q.explanation}</p>
              </div>

              {/* Ask AI to Explain Button */}
              <div className="mt-4 pt-3 flex justify-end">
                <button
                  onClick={() => onAskAITutor(q)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 transition flex items-center gap-1.5"
                >
                  <Bot className="w-4 h-4 text-indigo-600" />
                  <span>Ask EntryAce AI to Explain This Question</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
