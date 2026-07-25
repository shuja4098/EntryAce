import React, { useState } from 'react';
import { Award, BookOpen, Clock, Zap, ArrowRight, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { MockTestConfig } from '../../utils/mockQuestionGenerator';

interface Props {
  initialUni?: string;
  onStartTest: (config: MockTestConfig) => void;
  onBack: () => void;
}

export const MockTestSetup: React.FC<Props> = ({ initialUni = 'NED', onStartTest, onBack }) => {
  const [university, setUniversity] = useState<'NED' | 'FAST'>(
    initialUni.toUpperCase() === 'FAST' ? 'FAST' : 'NED'
  );
  const [subject, setSubject] = useState<string>('All');
  const [questionCount, setQuestionCount] = useState<number>(20);
  const [difficulty, setDifficulty] = useState<string>('All');

  const nedSubjects = ['All', 'Mathematics', 'Physics', 'Chemistry', 'English', 'IQ'];
  const fastSubjects = ['All', 'Mathematics', 'English', 'IQ'];

  const availableSubjects = university === 'NED' ? nedSubjects : fastSubjects;

  const handleUniversityChange = (uni: 'NED' | 'FAST') => {
    setUniversity(uni);
    if (uni === 'FAST' && subject === 'Chemistry') {
      setSubject('All');
    }
  };

  const getEstimatedMinutes = (count: number) => {
    if (count === 20) return 30;
    if (count === 50) return 60;
    return 120;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartTest({
      university,
      subject,
      questionCount,
      difficulty,
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Top Header */}
      <div className="mb-8 text-center sm:text-left flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={onBack}
            className="inline-flex items-center text-sm text-slate-500 hover:text-slate-800 transition mb-2"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            Mock Exam Simulator
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm">
              Pro Mode
            </span>
          </h1>
          <p className="text-slate-600 mt-1">
            Configure your exam settings below to simulate exact NED / FAST testing conditions.
          </p>
        </div>
      </div>

      {/* Configuration Card */}
      <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xl shadow-slate-200/50 space-y-8">
        
        {/* 1. Select University */}
        <div>
          <label className="block text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">
            1. Select Target University
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => handleUniversityChange('NED')}
              className={`p-5 rounded-xl border-2 text-left transition-all duration-200 flex items-start justify-between relative overflow-hidden ${
                university === 'NED'
                  ? 'border-blue-600 bg-blue-50/50 text-blue-950 shadow-md ring-2 ring-blue-600/20'
                  : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${university === 'NED' ? 'bg-blue-600' : 'bg-slate-300'}`}></span>
                  <span className="font-bold text-lg">NED University</span>
                </div>
                <p className="text-xs text-slate-500 mt-1.5">
                  Full engineering entry test format (Math, Physics, Chemistry, English, IQ)
                </p>
              </div>
              {university === 'NED' && <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />}
            </button>

            <button
              type="button"
              onClick={() => handleUniversityChange('FAST')}
              className={`p-5 rounded-xl border-2 text-left transition-all duration-200 flex items-start justify-between relative overflow-hidden ${
                university === 'FAST'
                  ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950 shadow-md ring-2 ring-indigo-600/20'
                  : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${university === 'FAST' ? 'bg-indigo-600' : 'bg-slate-300'}`}></span>
                  <span className="font-bold text-lg">FAST NUCES</span>
                </div>
                <p className="text-xs text-slate-500 mt-1.5">
                  CS & Engineering entry test format (Advanced Math, English, Analytical IQ)
                </p>
              </div>
              {university === 'FAST' && <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0" />}
            </button>
          </div>
        </div>

        {/* 2. Select Subject */}
        <div>
          <label className="block text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">
            2. Choose Subject Focus
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
            {availableSubjects.map((sub) => (
              <button
                key={sub}
                type="button"
                onClick={() => setSubject(sub)}
                className={`py-3 px-3 rounded-xl text-xs font-semibold border text-center transition-all ${
                  subject === sub
                    ? 'border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-500/20 scale-[1.02]'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:border-slate-300'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Number of Questions & Time */}
        <div>
          <label className="block text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">
            3. Number of Questions & Duration
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[20, 50, 100].map((count) => {
              const mins = getEstimatedMinutes(count);
              const isSelected = questionCount === count;
              return (
                <button
                  key={count}
                  type="button"
                  onClick={() => setQuestionCount(count)}
                  className={`p-4 rounded-xl border-2 text-center transition-all ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/60 text-blue-900 shadow-md ring-2 ring-blue-600/20'
                      : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="text-2xl font-black text-slate-900">{count} Questions</div>
                  <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 mt-1">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    <span>{mins} Minutes Timer</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Difficulty Level */}
        <div>
          <label className="block text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">
            4. Difficulty Level
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: 'All', label: 'Mixed Difficulty', desc: 'Real exam distribution' },
              { id: 'easy', label: 'Easy', desc: 'Basic fundamentals' },
              { id: 'medium', label: 'Medium', desc: 'Standard entry level' },
              { id: 'hard', label: 'Hard', desc: 'Challenging problems' }
            ].map((diff) => (
              <button
                key={diff.id}
                type="button"
                onClick={() => setDifficulty(diff.id)}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  difficulty === diff.id
                    ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 shadow-sm font-medium'
                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-600'
                }`}
              >
                <div className="font-bold text-sm text-slate-900 capitalize">{diff.label}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">{diff.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Summary Banner & Start Action */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 w-full sm:w-auto">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <span className="font-semibold text-slate-800">Auto-save to Firestore</span>
              <p>Your score, accuracy, subject progress and weak topics will be recorded.</p>
            </div>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25 transition-all duration-200 flex items-center justify-center gap-2 group text-base"
          >
            <Zap className="w-5 h-5 text-yellow-300 fill-yellow-300 group-hover:scale-110 transition-transform" />
            <span>Start Mock Test</span>
            <ArrowRight className="w-5 h-5 text-white/80 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </form>
    </div>
  );
};
