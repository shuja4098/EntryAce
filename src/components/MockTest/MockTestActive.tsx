import React, { useState, useEffect } from 'react';
import { Clock, Bookmark, ChevronLeft, ChevronRight, SkipForward, AlertCircle, CheckCircle, Flag, LayoutGrid, HelpCircle } from 'lucide-react';
import { MCQ } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface Props {
  questions: MCQ[];
  university: 'NED' | 'FAST';
  timeLimitMinutes: number;
  onSubmitTest: (
    userAnswers: Record<string, string>,
    timeSpentSeconds: number
  ) => void;
}

export const MockTestActive: React.FC<Props> = ({
  questions,
  university,
  timeLimitMinutes,
  onSubmitTest,
}) => {
  const { toggleBookmarkMCQ } = useAuth();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<string, boolean>>({});
  const [bookmarks, setBookmarks] = useState<Record<string, boolean>>({});
  const [timeLeft, setTimeLeft] = useState(timeLimitMinutes * 60);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showQuestionGrid, setShowQuestionGrid] = useState(false);

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;

  // Countdown timer effect
  useEffect(() => {
    if (timeLeft <= 0) {
      handleFinalSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Format timer string MM:SS or HH:MM:SS
  const formatTimer = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (optionId: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionId,
    }));
  };

  const handleToggleReview = () => {
    setMarkedForReview((prev) => ({
      ...prev,
      [currentQuestion.id]: !prev[currentQuestion.id],
    }));
  };

  const handleToggleBookmark = async () => {
    const isBookmarked = await toggleBookmarkMCQ({
      id: currentQuestion.id,
      question: currentQuestion.question,
      subject: currentQuestion.subject,
      universityId: currentQuestion.universityId,
    });
    setBookmarks((prev) => ({
      ...prev,
      [currentQuestion.id]: isBookmarked,
    }));
  };

  const handleSkipQuestion = () => {
    // If next question exists, navigate to it
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleFinalSubmit = () => {
    const timeSpentSeconds = timeLimitMinutes * 60 - timeLeft;
    onSubmitTest(userAnswers, timeSpentSeconds);
  };

  // Stats calculation
  const answeredCount = Object.keys(userAnswers).length;
  const reviewCount = Object.values(markedForReview).filter(Boolean).length;
  const unansweredCount = totalQuestions - answeredCount;

  // Percentage progress
  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Fixed Sticky Header for Exam Bar */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-2xl p-4 mb-6 shadow-md shadow-slate-200/50 flex flex-wrap items-center justify-between gap-4">
        {/* Left: Uni Badge & Q counter */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 rounded-lg bg-blue-100 text-blue-900 font-bold text-xs uppercase tracking-wider">
            {university} MOCK TEST
          </div>
          <div className="text-sm font-extrabold text-slate-800">
            Question <span className="text-blue-600">{currentIndex + 1}</span> / {totalQuestions}
          </div>
        </div>

        {/* Center: Countdown Timer */}
        <div className={`flex items-center gap-2 px-4 py-1.5 rounded-xl font-mono text-base font-black transition-colors ${
          timeLeft < 300
            ? 'bg-red-50 text-red-600 border border-red-200 animate-pulse'
            : 'bg-slate-100 text-slate-800 border border-slate-200'
        }`}>
          <Clock className={`w-4 h-4 ${timeLeft < 300 ? 'text-red-600' : 'text-blue-600'}`} />
          <span>{formatTimer(timeLeft)}</span>
        </div>

        {/* Right: Question Palette Toggle & Submit Button */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowQuestionGrid(!showQuestionGrid)}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
            title="Question Navigator"
          >
            <LayoutGrid className="w-4 h-4 text-slate-600" />
            <span className="hidden sm:inline">Palette</span>
          </button>

          <button
            onClick={() => setShowSubmitModal(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/20 transition"
          >
            Submit Test
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200/70 h-2 rounded-full mb-6 overflow-hidden">
        <div
          className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main Question Card Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left 3 Columns: Main Question Display */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xl shadow-slate-200/50">
            
            {/* Meta badges line */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                  {currentQuestion.subject}
                </span>
                <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-600">
                  {currentQuestion.topic}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[11px] font-semibold uppercase ${
                  currentQuestion.difficulty === 'easy'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : currentQuestion.difficulty === 'medium'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}>
                  {currentQuestion.difficulty}
                </span>

                <button
                  onClick={handleToggleBookmark}
                  className={`p-1.5 rounded-lg border transition ${
                    bookmarks[currentQuestion.id]
                      ? 'bg-amber-50 border-amber-300 text-amber-600'
                      : 'border-slate-200 text-slate-400 hover:text-slate-600'
                  }`}
                  title="Bookmark question"
                >
                  <Bookmark className="w-4 h-4 fill-current" />
                </button>
              </div>
            </div>

            {/* Question Text */}
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-relaxed mb-6">
              {currentQuestion.question}
            </h2>

            {/* Options List */}
            <div className="space-y-3">
              {currentQuestion.options.map((opt) => {
                const isSelected = userAnswers[currentQuestion.id] === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    className={`w-full p-4 rounded-xl text-left border-2 transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 text-blue-950 font-semibold ring-2 ring-blue-600/20 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-slate-300 text-slate-800 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs uppercase ${
                        isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {opt.id}
                      </span>
                      <span className="text-sm sm:text-base">{opt.text}</span>
                    </div>

                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      isSelected ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'
                    }`}>
                      {isSelected && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Footer Control Buttons */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <button
                  onClick={handleToggleReview}
                  className={`px-3.5 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition ${
                    markedForReview[currentQuestion.id]
                      ? 'bg-purple-100 text-purple-800 border-purple-300 font-bold'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Flag className={`w-3.5 h-3.5 ${markedForReview[currentQuestion.id] ? 'fill-purple-600 text-purple-600' : ''}`} />
                  <span>{markedForReview[currentQuestion.id] ? 'Marked for Review' : 'Mark for Review'}</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSkipQuestion}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 flex items-center gap-1"
                >
                  <span>Skip</span>
                  <SkipForward className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={handleNext}
                  disabled={currentIndex === totalQuestions - 1}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 shadow-sm"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Right 1 Column: Question Palette Sidebar */}
        <div className={`lg:col-span-1 bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-slate-200/80 shadow-lg ${
          showQuestionGrid ? 'block' : 'hidden lg:block'
        }`}>
          <h3 className="font-extrabold text-slate-900 text-sm mb-3 flex items-center justify-between">
            <span>Question Palette</span>
            <span className="text-xs text-slate-500 font-normal">{answeredCount}/{totalQuestions} Answered</span>
          </h3>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-emerald-500"></span>
              <span>Answered</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-purple-500"></span>
              <span>Review</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-slate-200 border border-slate-300"></span>
              <span>Unanswered</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded border-2 border-blue-600 bg-blue-50"></span>
              <span>Current</span>
            </div>
          </div>

          {/* Question Grid Buttons */}
          <div className="grid grid-cols-5 gap-1.5 max-h-[360px] overflow-y-auto pr-1">
            {questions.map((q, idx) => {
              const isAns = !!userAnswers[q.id];
              const isRev = !!markedForReview[q.id];
              const isCurr = idx === currentIndex;

              let btnClass = 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200';
              if (isAns) {
                btnClass = 'bg-emerald-500 text-white font-bold border-emerald-600 shadow-sm';
              }
              if (isRev) {
                btnClass = 'bg-purple-600 text-white font-bold border-purple-700 shadow-sm';
              }
              if (isCurr) {
                btnClass += ' ring-2 ring-blue-600 ring-offset-1 font-extrabold scale-105 z-10';
              }

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-full aspect-square rounded-lg border text-xs font-semibold flex items-center justify-center transition-all ${btnClass}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Action to Submit */}
          <button
            onClick={() => setShowSubmitModal(true)}
            className="w-full mt-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-sm"
          >
            Finish & Submit Exam
          </button>
        </div>

      </div>

      {/* Confirmation Modal before early submission */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 text-amber-600 bg-amber-50 p-3 rounded-xl border border-amber-200/80">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <h3 className="font-bold text-slate-900 text-base">Submit Mock Exam?</h3>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              Are you sure you want to finalize your submission? Here is your current exam summary:
            </p>

            <div className="grid grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 text-center text-xs">
              <div>
                <div className="font-extrabold text-emerald-600 text-lg">{answeredCount}</div>
                <div className="text-slate-500">Answered</div>
              </div>
              <div>
                <div className="font-extrabold text-purple-600 text-lg">{reviewCount}</div>
                <div className="text-slate-500">In Review</div>
              </div>
              <div>
                <div className="font-extrabold text-amber-600 text-lg">{unansweredCount}</div>
                <div className="text-slate-500">Unanswered</div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
              >
                Return to Test
              </button>
              <button
                onClick={handleFinalSubmit}
                className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-700 shadow-md transition"
              >
                Yes, Submit Now
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
