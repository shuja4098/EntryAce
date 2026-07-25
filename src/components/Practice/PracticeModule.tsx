import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  Layers, 
  Sparkles, 
  ArrowLeft, 
  CheckCircle2, 
  ChevronRight, 
  Clock, 
  Brain, 
  Target, 
  Award, 
  Zap, 
  Atom, 
  Calculator, 
  FileText, 
  Compass, 
  Flame,
  ArrowRight,
  Filter
} from 'lucide-react';
import { UNIVERSITIES } from '../../data/universities';
import { CHAPTERS, QUESTION_BANK, Chapter } from '../../data/questions';
import { MCQ } from '../../types';
import { MCQCard } from './MCQCard';
import { PracticeResultModal } from './PracticeResultModal';
import { useAuth } from '../../context/AuthContext';

interface PracticeModuleProps {
  initialUniversityId?: string;
  initialSubject?: string;
  onNavigateAI: (prompt?: string) => void;
  onNavigateHome: () => void;
}

export const PracticeModule: React.FC<PracticeModuleProps> = ({
  initialUniversityId = 'NED',
  initialSubject,
  onNavigateAI,
  onNavigateHome
}) => {
  const { recordQuestionAttempt, logActivity } = useAuth();

  // Navigation Steps: 'select-university' -> 'select-subject' -> 'select-chapter' -> 'practice'
  const [step, setStep] = useState<'select-university' | 'select-subject' | 'select-chapter' | 'practice'>(
    initialUniversityId ? 'select-subject' : 'select-university'
  );

  const [selectedUniId, setSelectedUniId] = useState<string>(initialUniversityId || 'NED');
  const [selectedSubject, setSelectedSubject] = useState<string>(initialSubject || '');
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);

  // Practice state
  const [questions, setQuestions] = useState<MCQ[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [timeSpentSeconds, setTimeSpentSeconds] = useState<number>(0);

  // Timer interval for practice session
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (step === 'practice' && !isCompleted) {
      interval = setInterval(() => {
        setTimeSpentSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step, isCompleted]);

  // Load questions when chapter or subject changes
  const handleStartChapterPractice = (chapter: Chapter) => {
    setSelectedChapter(chapter);
    
    // Filter questions by university & topic/subject
    let filtered = QUESTION_BANK.filter(
      q => (q.universityId === selectedUniId || q.universityId === 'ALL') &&
           q.subject === chapter.subject &&
           (q.topic === chapter.name || true)
    );

    if (filtered.length === 0) {
      // Fallback fallback questions if specific chapter has few questions
      filtered = QUESTION_BANK.filter(q => q.subject === chapter.subject);
    }

    setQuestions(filtered);
    setCurrentIndex(0);
    setUserAnswers({});
    setIsCompleted(false);
    setTimeSpentSeconds(0);
    setStep('practice');
  };

  const handleSelectOption = (optionId: string) => {
    const currentQ = questions[currentIndex];
    if (!currentQ) return;

    setUserAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optionId,
    }));
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      handleSubmitPractice();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmitPractice = async () => {
    setIsCompleted(true);

    let correctCount = 0;
    let wrongCount = 0;

    questions.forEach((q) => {
      const ans = userAnswers[q.id];
      if (ans === q.correctOptionId) {
        correctCount++;
      } else if (ans) {
        wrongCount++;
      }
    });

    const uniObj = UNIVERSITIES.find(u => u.id === selectedUniId);
    const uniName = uniObj ? uniObj.name : selectedUniId;

    // Record stats and activity log in Firestore
    await recordQuestionAttempt(questions.length, correctCount);
    await logActivity(
      `${selectedSubject} (${selectedChapter?.name || 'Practice'})`,
      'practice',
      uniName,
      correctCount,
      questions.length
    );
  };

  const getSubjectIcon = (subjectName: string) => {
    switch (subjectName.toLowerCase()) {
      case 'mathematics':
        return <Calculator className="w-6 h-6 text-blue-600" />;
      case 'physics':
        return <Atom className="w-6 h-6 text-purple-600" />;
      case 'chemistry':
        return <Zap className="w-6 h-6 text-amber-600" />;
      case 'english':
        return <FileText className="w-6 h-6 text-emerald-600" />;
      case 'iq':
        return <Brain className="w-6 h-6 text-rose-600" />;
      default:
        return <BookOpen className="w-6 h-6 text-indigo-600" />;
    }
  };

  const selectedUniObj = UNIVERSITIES.find((u) => u.id === selectedUniId) || UNIVERSITIES[0];

  // Available subjects for selected university
  const availableSubjects = selectedUniObj.subjects;

  return (
    <div className="min-h-screen bg-slate-50/70 pb-20 pt-6 sm:pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* STEP BREADCRUMB HEADER */}
        <div className="bg-white/90 backdrop-blur-xl border border-slate-200/90 rounded-[28px] p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600">
            <button
              onClick={onNavigateHome}
              className="text-slate-500 hover:text-slate-900 transition-colors"
            >
              Dashboard
            </button>
            <ChevronRight className="w-4 h-4 text-slate-300" />
            <button
              onClick={() => setStep('select-university')}
              className={`transition-colors ${
                step === 'select-university' ? 'text-blue-600 font-extrabold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {selectedUniObj.name}
            </button>

            {selectedSubject && (
              <>
                <ChevronRight className="w-4 h-4 text-slate-300" />
                <button
                  onClick={() => setStep('select-subject')}
                  className={`transition-colors ${
                    step === 'select-subject' ? 'text-blue-600 font-extrabold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {selectedSubject}
                </button>
              </>
            )}

            {selectedChapter && step === 'practice' && (
              <>
                <ChevronRight className="w-4 h-4 text-slate-300" />
                <span className="text-blue-600 font-extrabold">{selectedChapter.name}</span>
              </>
            )}
          </div>

          {step !== 'select-university' && (
            <button
              onClick={() => {
                if (step === 'practice') setStep('select-chapter');
                else if (step === 'select-chapter') setStep('select-subject');
                else setStep('select-university');
              }}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          )}
        </div>

        {/* STEP 1: SELECT UNIVERSITY */}
        {step === 'select-university' && (
          <div className="space-y-6">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-extrabold uppercase tracking-wider border border-blue-100">
                <GraduationCap className="w-4 h-4" />
                <span>Step 1 of 3 • Choose University</span>
              </div>
              <h2 className="text-3xl font-black text-slate-900">
                Select University Pattern
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Question formats, negative marking rules, and topic weightages adapt to your choice.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {UNIVERSITIES.filter(u => u.status === 'active').map((uni) => (
                <div
                  key={uni.id}
                  onClick={() => {
                    setSelectedUniId(uni.id);
                    setStep('select-subject');
                  }}
                  className={`bg-white/95 backdrop-blur-md rounded-[32px] p-6 sm:p-8 border-2 transition-all cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-1 space-y-6 flex flex-col justify-between group ${
                    selectedUniId === uni.id ? 'border-blue-600 ring-4 ring-blue-500/10' : 'border-slate-200/90 hover:border-blue-300'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-blue-50 text-blue-700 border border-blue-100">
                        {uni.badge}
                      </span>
                      <span className="text-xs font-bold text-slate-400">
                        {uni.totalQuestions} Questions • {uni.timeLimitMinutes} Mins
                      </span>
                    </div>

                    <div>
                      <h3 className="text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                        {uni.name}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                        {uni.fullName}
                      </p>
                    </div>

                    {/* Subjects Badges */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      {uni.subjects.map((s, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-extrabold text-xs">
                          {s.name} ({s.mcqCount})
                        </span>
                      ))}
                    </div>
                  </div>

                  <button className="w-full py-3 px-4 rounded-2xl bg-slate-900 group-hover:bg-blue-600 text-white font-extrabold text-xs transition-colors flex items-center justify-center gap-2">
                    <span>Select {uni.name} Subjects</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: SELECT SUBJECT */}
        {step === 'select-subject' && (
          <div className="space-y-6">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-extrabold uppercase tracking-wider border border-blue-100">
                <BookOpen className="w-4 h-4" />
                <span>Step 2 of 3 • {selectedUniObj.name} Exam</span>
              </div>
              <h2 className="text-3xl font-black text-slate-900">
                Select Subject to Practice
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Choose a subject to view topic-wise chapters and practice realistic MCQs.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {availableSubjects.map((sub, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setSelectedSubject(sub.name);
                    setStep('select-chapter');
                  }}
                  className="bg-white/95 backdrop-blur-md rounded-[32px] p-6 border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-blue-400 transition-all hover:-translate-y-1 cursor-pointer flex flex-col justify-between group space-y-6"
                >
                  <div className="space-y-4">
                    <div className="w-13 h-13 rounded-2xl bg-slate-100 border border-slate-200/70 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      {getSubjectIcon(sub.name)}
                    </div>

                    <div>
                      <h3 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                        {sub.name}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium mt-1">
                        {sub.mcqCount} Standard MCQs available
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-extrabold text-blue-600">
                    <span>View Chapters</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: SELECT CHAPTER */}
        {step === 'select-chapter' && (
          <div className="space-y-6">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-extrabold uppercase tracking-wider border border-blue-100">
                <Layers className="w-4 h-4" />
                <span>Step 3 of 3 • {selectedSubject} Chapters</span>
              </div>
              <h2 className="text-3xl font-black text-slate-900">
                Select Chapter / Topic
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Choose a specific chapter to launch your interactive timed drill.
              </p>
            </div>

            {/* Chapter Cards List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
              {CHAPTERS.filter(c => c.subject === selectedSubject && (c.universityId === selectedUniId || c.universityId === 'ALL')).map((chap) => (
                <div
                  key={chap.id}
                  className="bg-white/95 backdrop-blur-md rounded-[28px] p-6 border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 hover:border-blue-300"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
                      <span>{chap.subject}</span>
                      <span className="text-emerald-600 font-extrabold">{chap.questionCount} Questions</span>
                    </div>

                    <h3 className="text-lg font-black text-slate-900">
                      {chap.name}
                    </h3>
                  </div>

                  <button
                    onClick={() => handleStartChapterPractice(chap)}
                    className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-extrabold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
                  >
                    <span>Start Practice Session</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: PRACTICE MCQ SCREEN */}
        {step === 'practice' && questions.length > 0 && (
          <div className="space-y-6">
            <MCQCard
              mcq={questions[currentIndex]}
              questionIndex={currentIndex}
              totalQuestions={questions.length}
              chapterName={selectedChapter?.name || 'Topic Drill'}
              selectedOptionId={userAnswers[questions[currentIndex]?.id] || null}
              onSelectOption={handleSelectOption}
              onNext={handleNextQuestion}
              onPrevious={handlePreviousQuestion}
              onSubmit={handleSubmitPractice}
              onAskAI={(mcq) => {
                onNavigateAI(`Question: "${mcq.question}"\n\nOptions:\n${mcq.options.map(o => `${o.id.toUpperCase()}) ${o.text}`).join('\n')}\n\nPlease explain the concept and step-by-step mathematical/logical solution for ${selectedUniObj.name} entrance exam.`);
              }}
              timeSpentSeconds={timeSpentSeconds}
            />
          </div>
        )}

        {/* PRACTICE RESULT MODAL OVERLAY */}
        {isCompleted && (
          <PracticeResultModal
            universityName={selectedUniObj.name}
            subjectName={selectedSubject}
            chapterName={selectedChapter?.name || 'Practice Drill'}
            totalQuestions={questions.length}
            correctCount={Object.keys(userAnswers).filter(qId => {
              const q = questions.find(item => item.id === qId);
              return q && userAnswers[qId] === q.correctOptionId;
            }).length}
            wrongCount={Object.keys(userAnswers).filter(qId => {
              const q = questions.find(item => item.id === qId);
              return q && userAnswers[qId] !== q.correctOptionId;
            }).length}
            timeSpentSeconds={timeSpentSeconds}
            onRestart={() => {
              setUserAnswers({});
              setCurrentIndex(0);
              setIsCompleted(false);
              setTimeSpentSeconds(0);
            }}
            onSelectChapter={() => setStep('select-chapter')}
            onNavigateAI={onNavigateAI}
          />
        )}

      </div>
    </div>
  );
};
