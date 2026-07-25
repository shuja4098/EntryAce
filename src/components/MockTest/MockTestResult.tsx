import React from 'react';
import { Award, CheckCircle2, XCircle, HelpCircle, Clock, Percent, ArrowRight, RotateCcw, LayoutDashboard, Eye, Sparkles, TrendingUp, AlertTriangle, Check } from 'lucide-react';
import { MCQ } from '../../types';
import { MockTestRecord } from '../../context/AuthContext';

interface Props {
  record: MockTestRecord;
  questions: MCQ[];
  onReviewAnswers: () => void;
  onRetakeTest: () => void;
  onBackToDashboard: () => void;
}

export const MockTestResult: React.FC<Props> = ({
  record,
  questions,
  onReviewAnswers,
  onRetakeTest,
  onBackToDashboard,
}) => {
  const isPassed = record.accuracy >= 50;

  const formatTimeSpent = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      
      {/* Top Banner Card */}
      <div className={`relative overflow-hidden rounded-3xl p-8 sm:p-10 border shadow-2xl text-white ${
        isPassed
          ? 'bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-800 border-blue-500/30 shadow-blue-500/20'
          : 'bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 border-slate-700 shadow-slate-900/30'
      }`}>
        {/* Background glow graphics */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md text-white mb-3 border border-white/20">
              <Award className="w-3.5 h-3.5 text-yellow-300" />
              <span>{record.university} Entrance Exam Mock</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {isPassed ? 'Excellent Performance!' : 'Mock Test Completed'}
            </h1>
            <p className="text-white/80 text-sm mt-1.5 max-w-md">
              {isPassed
                ? 'Your test score reflects strong preparation for university entrance exams!'
                : 'Review your weak topics below and practice with EntryAce AI Tutor to boost your score.'}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 text-center min-w-[160px] shadow-lg">
            <div className="text-xs font-semibold text-white/80 uppercase tracking-wider">Total Score</div>
            <div className="text-4xl font-black text-white mt-1">
              {record.score} <span className="text-lg text-white/70">/ {record.totalQuestions}</span>
            </div>
            <div className="text-xs font-bold text-yellow-300 mt-1">
              {record.accuracy}% Accuracy
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-slate-200/80 shadow-sm text-center">
          <div className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total</div>
          <div className="text-2xl font-black text-slate-800 mt-1">{record.totalQuestions}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Questions</div>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-emerald-200/80 shadow-sm text-center bg-emerald-50/30">
          <div className="text-emerald-600 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Correct</span>
          </div>
          <div className="text-2xl font-black text-emerald-700 mt-1">{record.correctAnswers}</div>
          <div className="text-[11px] text-emerald-600 mt-0.5">Points</div>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-rose-200/80 shadow-sm text-center bg-rose-50/30">
          <div className="text-rose-600 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1">
            <XCircle className="w-3.5 h-3.5" />
            <span>Wrong</span>
          </div>
          <div className="text-2xl font-black text-rose-700 mt-1">{record.wrongAnswers}</div>
          <div className="text-[11px] text-rose-600 mt-0.5">Incorrect</div>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-slate-200/80 shadow-sm text-center">
          <div className="text-slate-400 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Skipped</span>
          </div>
          <div className="text-2xl font-black text-slate-700 mt-1">{record.skippedQuestions}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Unattempted</div>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-blue-200/80 shadow-sm text-center bg-blue-50/30">
          <div className="text-blue-600 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1">
            <Percent className="w-3.5 h-3.5" />
            <span>Accuracy</span>
          </div>
          <div className="text-2xl font-black text-blue-700 mt-1">{record.accuracy}%</div>
          <div className="text-[11px] text-blue-600 mt-0.5">Score Ratio</div>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-slate-200/80 shadow-sm text-center">
          <div className="text-slate-400 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Time</span>
          </div>
          <div className="text-xl font-black text-slate-800 mt-1.5">{formatTimeSpent(record.timeSpentSeconds)}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Spent</div>
        </div>
      </div>

      {/* Subject Wise Performance & Visual Chart */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-lg space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <span>Subject-Wise Performance</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Detailed breakdown of marks obtained across subjects</p>
          </div>
        </div>

        <div className="space-y-4">
          {Object.entries(record.subjectPerformance || {}).map(([subj, rawStats]) => {
            const stats = rawStats as { total: number; correct: number; wrong: number; skipped: number };
            const acc = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
            return (
              <div key={subj} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between text-sm font-bold text-slate-900">
                  <span>{subj}</span>
                  <span className="text-xs font-extrabold text-blue-600">{stats.correct} / {stats.total} ({acc}%)</span>
                </div>
                {/* Visual Bar */}
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden flex">
                  <div
                    className="bg-emerald-500 h-full transition-all duration-500"
                    style={{ width: `${stats.total > 0 ? (stats.correct / stats.total) * 100 : 0}%` }}
                    title={`Correct: ${stats.correct}`}
                  />
                  <div
                    className="bg-rose-500 h-full transition-all duration-500"
                    style={{ width: `${stats.total > 0 ? (stats.wrong / stats.total) * 100 : 0}%` }}
                    title={`Wrong: ${stats.wrong}`}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span className="text-emerald-700 font-semibold">{stats.correct} Correct</span>
                  <span className="text-rose-700 font-semibold">{stats.wrong} Wrong</span>
                  <span className="text-slate-500">{stats.skipped} Skipped</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Weak & Strong Topics Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Strong Topics */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-emerald-200/80 shadow-sm bg-emerald-50/10">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-base mb-3">
            <Check className="w-5 h-5 text-emerald-600 bg-emerald-100 p-0.5 rounded-full" />
            <span>Strong Topics (High Mastery)</span>
          </div>
          {record.strongTopics && record.strongTopics.length > 0 ? (
            <ul className="space-y-2">
              {record.strongTopics.map((top, idx) => (
                <li key={idx} className="text-xs font-semibold text-emerald-900 bg-emerald-100/60 border border-emerald-200 px-3 py-2 rounded-xl flex items-center justify-between">
                  <span>{top}</span>
                  <span className="text-[10px] text-emerald-700 bg-white/80 px-2 py-0.5 rounded-full">≥ 80%</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-500 italic">No topics reached ≥ 80% accuracy in this test session.</p>
          )}
        </div>

        {/* Weak Topics */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-amber-200/80 shadow-sm bg-amber-50/10">
          <div className="flex items-center gap-2 text-amber-800 font-bold text-base mb-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 bg-amber-100 p-0.5 rounded-full" />
            <span>Weak Topics (Needs Practice)</span>
          </div>
          {record.weakTopics && record.weakTopics.length > 0 ? (
            <ul className="space-y-2">
              {record.weakTopics.map((top, idx) => (
                <li key={idx} className="text-xs font-semibold text-amber-900 bg-amber-100/60 border border-amber-200 px-3 py-2 rounded-xl flex items-center justify-between">
                  <span>{top}</span>
                  <span className="text-[10px] text-amber-700 bg-white/80 px-2 py-0.5 rounded-full">&lt; 60%</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-500 italic">Great job! All topics scored above 60% accuracy.</p>
          )}
        </div>

      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <button
          onClick={onReviewAnswers}
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-sm text-slate-800 bg-white border border-slate-200 hover:bg-slate-50 shadow-sm flex items-center justify-center gap-2 transition"
        >
          <Eye className="w-4 h-4 text-blue-600" />
          <span>Review Answers</span>
        </button>

        <button
          onClick={onRetakeTest}
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-sm text-slate-800 bg-white border border-slate-200 hover:bg-slate-50 shadow-sm flex items-center justify-center gap-2 transition"
        >
          <RotateCcw className="w-4 h-4 text-indigo-600" />
          <span>Retake Test</span>
        </button>

        <button
          onClick={onBackToDashboard}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition"
        >
          <LayoutDashboard className="w-4 h-4 text-white" />
          <span>Back to Dashboard</span>
        </button>
      </div>

    </div>
  );
};
