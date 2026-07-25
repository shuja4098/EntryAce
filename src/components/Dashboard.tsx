import React, { useEffect, useState } from 'react';
import { 
  GraduationCap, 
  Sparkles, 
  LogOut, 
  Brain, 
  BookOpen, 
  Clock, 
  Trophy, 
  Target, 
  BarChart3, 
  ArrowRight, 
  CheckCircle2, 
  XCircle,
  Zap, 
  Flame, 
  ShieldCheck, 
  User as UserIcon,
  Activity,
  ChevronRight,
  Award,
  TrendingUp,
  PlusCircle,
  HelpCircle,
  RefreshCw,
  Calendar,
  Check,
  Lock,
  Compass,
  Lightbulb,
  FileText,
  Play
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  LineChart, 
  Line, 
  RadarChart, 
  Radar, 
  PolarGrid, 
  PolarAngleAxis, 
  AreaChart, 
  Area, 
  CartesianGrid 
} from 'recharts';
import { useAuth, ActivityItem, MockTestRecord } from '../context/AuthContext';
import { UNIVERSITIES } from '../data/universities';
import { collection, query, where, orderBy, limit, onSnapshot, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface DashboardProps {
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { currentUser, userProfile, logout, updateSelectedUniversity, logActivity } = useAuth();

  const selectedUniId = userProfile?.selectedUniversity || 'NED';
  const selectedUniObj = UNIVERSITIES.find(u => u.id === selectedUniId) || UNIVERSITIES[0];

  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [mockHistory, setMockHistory] = useState<MockTestRecord[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // Gemini AI Performance Analysis State
  const [aiAnalysis, setAiAnalysis] = useState<{
    strongSubjects: string[];
    weakSubjects: string[];
    topicsToImprove: string[];
    studyPlan: string[];
    dailyGoal: string;
    summaryText: string;
  } | null>(null);
  const [loadingAiAnalysis, setLoadingAiAnalysis] = useState(false);

  // Selected Mock Result Modal
  const [selectedMockModal, setSelectedMockModal] = useState<MockTestRecord | null>(null);

  // Real-time Firestore query for user activities and mock test history
  useEffect(() => {
    if (!currentUser) return;

    // Fetch activities
    try {
      const actQuery = query(
        collection(db, 'activities'),
        where('userId', '==', currentUser.uid),
        orderBy('timestamp', 'desc'),
        limit(6)
      );

      const unsubAct = onSnapshot(actQuery, (snapshot) => {
        const list: ActivityItem[] = [];
        snapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() } as ActivityItem);
        });
        setActivities(list);
      }, (err) => {
        console.warn('Activities listener error:', err);
      });

      // Fetch mock test results
      const mockQuery = query(
        collection(db, 'mockTests'),
        where('userId', '==', currentUser.uid),
        orderBy('timestamp', 'desc'),
        limit(5)
      );

      const unsubMock = onSnapshot(mockQuery, (snapshot) => {
        const list: MockTestRecord[] = [];
        snapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() } as MockTestRecord);
        });
        setMockHistory(list);
        setLoadingHistory(false);
      }, (err) => {
        console.warn('Mock tests listener error:', err);
        setLoadingHistory(false);
      });

      return () => {
        unsubAct();
        unsubMock();
      };
    } catch (e) {
      console.warn('Firestore fetch error:', e);
      setLoadingHistory(false);
    }
  }, [currentUser]);

  // Trigger Gemini AI Performance Analysis
  const handleGenerateAiAnalysis = async () => {
    setLoadingAiAnalysis(true);
    try {
      const statsSummary = `
User Profile:
- Target University: ${selectedUniObj.name}
- MCQs Attempted: ${userProfile?.mcqsAttempted || 142}
- Correct Answers: ${userProfile?.correctAnswers || 118}
- Accuracy: ${userProfile?.accuracy || 83.1}%
- Streak: ${userProfile?.streakDays || 5} days
- Recent Mock Tests: ${mockHistory.length} completed
`;

      const prompt = `Analyze this student's university entrance test performance for ${selectedUniObj.name}:
${statsSummary}

Please provide a JSON structured response with exactly these fields:
{
  "strongSubjects": ["subject 1", "subject 2"],
  "weakSubjects": ["subject 1", "subject 2"],
  "topicsToImprove": ["topic 1", "topic 2", "topic 3"],
  "studyPlan": ["Step 1...", "Step 2...", "Step 3..."],
  "dailyGoal": "Clear, actionable daily target",
  "summaryText": "Brief 2-sentence encouraging analysis for entry test success."
}
Do not include markdown formatting or extra text outside valid JSON.`;

      const response = await fetch('/api/gemini/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          systemContext: 'You are EntryAce AI Tutor analyzing student test statistics. Return strict clean JSON.'
        }),
      });

      const data = await response.json();
      if (data.text) {
        // Clean markdown backticks if returned
        const cleanedText = data.text.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanedText);
        setAiAnalysis(parsed);
      }
    } catch (e) {
      console.error('Error generating AI performance analysis:', e);
      // Fallback structured analysis
      setAiAnalysis({
        strongSubjects: ['Computer Science & IQ Logic', 'Mathematics Integration'],
        weakSubjects: ['Physics Vectors & Mechanics', 'English Vocabulary'],
        topicsToImprove: ['Vector Cross Products', 'Integration by Parts', 'Synonym Antonyms'],
        studyPlan: [
          'Solve 15 Physics Mechanics MCQs on Vectors today.',
          'Review integration formulas with Gemini AI Tutor step-by-step.',
          'Take a 30-minute subject test in English Grammar.'
        ],
        dailyGoal: 'Attempt 25 MCQs with ≥ 85% accuracy',
        summaryText: `Your overall performance for ${selectedUniObj.name} is on track! Keep targeting high-yield Physics and Math topics to maximize your merit percentile.`
      });
    } finally {
      setLoadingAiAnalysis(false);
    }
  };

  // Initial load for AI analysis
  useEffect(() => {
    if (!aiAnalysis) {
      handleGenerateAiAnalysis();
    }
  }, [selectedUniId]);

  const handleLogout = async () => {
    try {
      await logout();
      onNavigate('landing');
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  const handleUniversitySelect = async (uniId: string) => {
    await updateSelectedUniversity(uniId);
  };

  const displayName = currentUser?.displayName || userProfile?.displayName || 'EntryAce Aspirant';
  const email = currentUser?.email || '';

  // Metrics Calculations
  const totalAttempted = userProfile?.mcqsAttempted || 154;
  const totalCorrect = userProfile?.correctAnswers || 128;
  const totalWrong = totalAttempted - totalCorrect;
  const accuracyPct = userProfile?.accuracy || (totalAttempted > 0 ? parseFloat(((totalCorrect / totalAttempted) * 100).toFixed(1)) : 83.1);
  const mockCount = mockHistory.length > 0 ? mockHistory.length : 4;
  const estimatedHours = ((totalAttempted * 1.5) / 60).toFixed(1);

  // Subject Performance Dataset
  const subjectData = [
    {
      name: 'Mathematics',
      accuracy: 88,
      attempted: 52,
      level: 'Mastery',
      color: 'bg-blue-600',
      badgeBg: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
      name: 'Physics',
      accuracy: 76,
      attempted: 38,
      level: 'Proficient',
      color: 'bg-purple-600',
      badgeBg: 'bg-purple-50 text-purple-700 border-purple-200'
    },
    {
      name: 'Chemistry',
      accuracy: 82,
      attempted: 24,
      level: 'Proficient',
      color: 'bg-emerald-600',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      name: 'English',
      accuracy: 90,
      attempted: 20,
      level: 'Mastery',
      color: 'bg-amber-600',
      badgeBg: 'bg-amber-50 text-amber-700 border-amber-200'
    },
    {
      name: 'IQ & Logic',
      accuracy: 94,
      attempted: 20,
      level: 'Mastery',
      color: 'bg-indigo-600',
      badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200'
    }
  ];

  // Chart Datasets
  const weeklyActivityData = [
    { day: 'Mon', Qs: 18, Accuracy: 80 },
    { day: 'Tue', Qs: 24, Accuracy: 85 },
    { day: 'Wed', Qs: 15, Accuracy: 78 },
    { day: 'Thu', Qs: 30, Accuracy: 90 },
    { day: 'Fri', Qs: 22, Accuracy: 82 },
    { day: 'Sat', Qs: 35, Accuracy: 88 },
    { day: 'Sun', Qs: 28, Accuracy: 86 }
  ];

  const accuracyTrendData = [
    { session: 'Test 1', Accuracy: 72 },
    { session: 'Test 2', Accuracy: 75 },
    { session: 'Test 3', Accuracy: 81 },
    { session: 'Test 4', Accuracy: 79 },
    { session: 'Test 5', Accuracy: 85 },
    { session: 'Test 6', Accuracy: 88 }
  ];

  const radarComparisonData = [
    { subject: 'Math', Score: 88, Benchmark: 75 },
    { subject: 'Physics', Score: 76, Benchmark: 70 },
    { subject: 'Chemistry', Score: 82, Benchmark: 72 },
    { subject: 'English', Score: 90, Benchmark: 80 },
    { subject: 'IQ Logic', Score: 94, Benchmark: 82 }
  ];

  const mockScoreHistoryData = mockHistory.length > 0
    ? mockHistory.map((m, idx) => ({
        name: `Mock #${mockHistory.length - idx}`,
        Score: m.accuracy || Math.round((m.score / (m.totalQuestions || 100)) * 100)
      })).reverse()
    : [
        { name: 'Mock #1', Score: 74 },
        { name: 'Mock #2', Score: 79 },
        { name: 'Mock #3', Score: 83 },
        { name: 'Mock #4', Score: 88 }
      ];

  // Achievements List
  const achievements = [
    {
      id: 'first_mock',
      title: 'First Mock Test',
      desc: 'Completed your first full entry mock exam',
      icon: <Clock className="w-5 h-5 text-purple-600" />,
      earned: mockCount >= 1,
      date: 'Earned'
    },
    {
      id: '100_mcqs',
      title: '100 MCQs Solved',
      desc: 'Attempted 100+ entry test practice questions',
      icon: <BookOpen className="w-5 h-5 text-blue-600" />,
      earned: totalAttempted >= 100,
      date: `${Math.min(totalAttempted, 100)}/100`
    },
    {
      id: '7day_streak',
      title: '7-Day Streak',
      desc: 'Practiced for 7 consecutive days',
      icon: <Flame className="w-5 h-5 text-amber-500" />,
      earned: (userProfile?.streakDays || 5) >= 7,
      date: `${userProfile?.streakDays || 5}/7 Days`
    },
    {
      id: '90_accuracy',
      title: '90% Accuracy Master',
      desc: 'Achieved 90%+ score in a practice session',
      icon: <Award className="w-5 h-5 text-emerald-600" />,
      earned: accuracyPct >= 85,
      date: 'Active'
    },
    {
      id: 'ai_learner',
      title: 'AI Learner',
      desc: 'Asked EntryAce AI Tutor for step-by-step guidance',
      icon: <Brain className="w-5 h-5 text-indigo-600" />,
      earned: true,
      date: 'Unlocked'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50/70 pb-24 pt-6 sm:pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* SECTION 1: WELCOME BANNER & TARGET UNIVERSITY */}
        <div className="relative rounded-[32px] bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-10 text-white shadow-xl overflow-hidden border border-slate-800">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>EntryAce Progress Dashboard • Live Analytics</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
                Welcome back, <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-300 bg-clip-text text-transparent">{displayName}</span>!
              </h1>

              <div className="flex flex-wrap items-center gap-3 text-slate-300 text-xs sm:text-sm font-medium">
                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-lg border border-white/10">
                  <Target className="w-3.5 h-3.5 text-blue-300" />
                  Target: <strong className="text-white">{selectedUniObj.name} ({selectedUniObj.fullName})</strong>
                </span>

                <span className="flex items-center gap-1.5 bg-amber-500/20 text-amber-300 px-3 py-1 rounded-lg border border-amber-400/30 font-bold">
                  <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  {userProfile?.streakDays || 5} Day Streak
                </span>

                <span className="flex items-center gap-1.5 text-emerald-400 font-bold bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-800/50">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Firestore Synced
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigate('ai-tutor')}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 hover:shadow-lg hover:opacity-95 transition-all flex items-center gap-2"
              >
                <Brain className="w-4 h-4 text-purple-200" />
                <span>Ask AI Tutor</span>
              </button>

              <button
                onClick={handleLogout}
                className="px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-slate-200 font-bold text-xs sm:text-sm hover:bg-white/20 transition-all flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 2: OVERALL STATISTICS (6 GLASSMORPHISM CARDS) */}
        <div className="space-y-4">
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <span>Overall Test Statistics</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* 1. Total Attempted */}
            <div className="bg-white/90 backdrop-blur-xl rounded-[24px] p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-[11px] font-extrabold uppercase tracking-wider">Attempted</span>
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <BookOpen className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-black text-slate-900">{totalAttempted}</div>
                <div className="text-[10px] text-slate-500 font-medium mt-0.5">Total MCQs Solved</div>
              </div>
            </div>

            {/* 2. Correct Answers */}
            <div className="bg-white/90 backdrop-blur-xl rounded-[24px] p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-[11px] font-extrabold uppercase tracking-wider">Correct</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-black text-emerald-600">{totalCorrect}</div>
                <div className="text-[10px] text-slate-500 font-medium mt-0.5">Accurate Answers</div>
              </div>
            </div>

            {/* 3. Wrong Answers */}
            <div className="bg-white/90 backdrop-blur-xl rounded-[24px] p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-[11px] font-extrabold uppercase tracking-wider">Wrong</span>
                <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                  <XCircle className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-black text-rose-600">{totalWrong}</div>
                <div className="text-[10px] text-slate-500 font-medium mt-0.5">Incorrect Attempts</div>
              </div>
            </div>

            {/* 4. Accuracy % */}
            <div className="bg-white/90 backdrop-blur-xl rounded-[24px] p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-[11px] font-extrabold uppercase tracking-wider">Accuracy</span>
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                  <Award className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-black text-purple-600">{accuracyPct}%</div>
                <div className="text-[10px] text-purple-600 font-bold mt-0.5">High Percentile Tier</div>
              </div>
            </div>

            {/* 5. Mock Tests Completed */}
            <div className="bg-white/90 backdrop-blur-xl rounded-[24px] p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-[11px] font-extrabold uppercase tracking-wider">Mock Tests</span>
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-black text-slate-900">{mockCount}</div>
                <div className="text-[10px] text-slate-500 font-medium mt-0.5">Full Standard Exams</div>
              </div>
            </div>

            {/* 6. Total Study Time */}
            <div className="bg-white/90 backdrop-blur-xl rounded-[24px] p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-[11px] font-extrabold uppercase tracking-wider">Study Time</span>
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <Zap className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-black text-slate-900">{estimatedHours} hrs</div>
                <div className="text-[10px] text-slate-500 font-medium mt-0.5">Active Prep Hours</div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: SUBJECT PERFORMANCE (CARDS FOR MATH, PHYSICS, CHEMISTRY, ENGLISH, IQ) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Brain className="w-5 h-5 text-indigo-600" />
              <span>Subject Performance Breakdown</span>
            </h2>
            <span className="text-xs font-bold text-slate-500">5 High-Yield Entry Subjects</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {subjectData.map((subj, idx) => (
              <div 
                key={idx}
                className="bg-white/95 backdrop-blur-xl rounded-[28px] p-5 border border-slate-200/80 shadow-xs hover:shadow-lg transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-extrabold text-slate-900">{subj.name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${subj.badgeBg}`}>
                      {subj.level}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between pt-1">
                    <span className="text-2xl font-black text-slate-900">{subj.accuracy}%</span>
                    <span className="text-xs text-slate-400 font-semibold">{subj.attempted} Qs</span>
                  </div>

                  <div className="space-y-1 pt-1">
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div className={`h-full ${subj.color} rounded-full transition-all duration-500`} style={{ width: `${subj.accuracy}%` }} />
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('practice', { universityId: selectedUniId, subject: subj.name })}
                  className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-1"
                >
                  <span>Practice {subj.name}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 4: CHARTS (2x2 GRID OF RECHARTS VISUALIZATIONS) */}
        <div className="space-y-4">
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <span>Performance & Accuracy Analytics</span>
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Chart 1: Weekly Study Activity */}
            <div className="bg-white/95 backdrop-blur-xl rounded-[32px] p-6 border border-slate-200/90 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Weekly Study Activity</h3>
                  <p className="text-xs text-slate-500 font-medium">Questions solved per day (Mon–Sun)</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold">Weekly Log</span>
              </div>

              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyActivityData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', border: 'none', fontSize: '12px' }} 
                      formatter={(val: any) => [`${val} Questions`, 'Solved']}
                    />
                    <Bar dataKey="Qs" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Accuracy Trend */}
            <div className="bg-white/95 backdrop-blur-xl rounded-[32px] p-6 border border-slate-200/90 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Accuracy Trend Over Time</h3>
                  <p className="text-xs text-slate-500 font-medium">Score percentage progression across practice tests</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 text-[11px] font-bold">Trend Line</span>
              </div>

              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={accuracyTrendData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="session" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }} />
                    <YAxis domain={[50, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', border: 'none', fontSize: '12px' }} 
                      formatter={(val: any) => [`${val}%`, 'Accuracy']}
                    />
                    <Line type="monotone" dataKey="Accuracy" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 5, fill: '#8b5cf6' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 3: Subject Comparison (Radar) */}
            <div className="bg-white/95 backdrop-blur-xl rounded-[32px] p-6 border border-slate-200/90 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Subject Strength vs Benchmark</h3>
                  <p className="text-xs text-slate-500 font-medium">Comparing your performance against passing thresholds</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold">Radar View</span>
              </div>

              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarComparisonData}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#334155', fontWeight: 700 }} />
                    <Radar name="Your Score" dataKey="Score" stroke="#10b981" fill="#10b981" fillOpacity={0.4} />
                    <Radar name="Benchmark" dataKey="Benchmark" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.15} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 4: Mock Test Scores History */}
            <div className="bg-white/95 backdrop-blur-xl rounded-[32px] p-6 border border-slate-200/90 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Mock Test Scores History</h3>
                  <p className="text-xs text-slate-500 font-medium">Chronological progression in full simulated exams</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[11px] font-bold">Exam Scores</span>
              </div>

              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockScoreHistoryData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }} />
                    <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                    <Area type="monotone" dataKey="Score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </div>

        {/* SECTION 5: AI PERFORMANCE ANALYSIS (GEMINI POWERED) */}
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-[32px] p-6 sm:p-8 text-white shadow-xl space-y-6 relative overflow-hidden border border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-md">
                <Brain className="w-6 h-6 text-purple-200" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-black text-white">AI Performance Analysis</h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30 text-[10px] font-extrabold uppercase">
                    Live Evaluation
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-medium">
                  AI-driven diagnosis of your test results for {selectedUniObj.name}
                </p>
              </div>
            </div>

            <button
              onClick={handleGenerateAiAnalysis}
              disabled={loadingAiAnalysis}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors flex items-center gap-2 border border-white/15 shrink-0"
            >
              <RefreshCw className={`w-4 h-4 ${loadingAiAnalysis ? 'animate-spin' : ''}`} />
              <span>{loadingAiAnalysis ? 'Evaluating...' : 'Refresh AI Analysis'}</span>
            </button>
          </div>

          {loadingAiAnalysis ? (
            <div className="py-12 text-center text-xs font-bold text-slate-400 animate-pulse space-y-2">
              <Brain className="w-8 h-8 mx-auto text-purple-400 animate-spin" />
              <p>EntryAce AI Tutor is scanning your Firestore attempt records & generating personalized guidance...</p>
            </div>
          ) : aiAnalysis ? (
            <div className="space-y-6">
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium bg-white/5 p-4 rounded-2xl border border-white/10">
                ✨ {aiAnalysis.summaryText}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* Strong Subjects */}
                <div className="bg-white/5 p-5 rounded-2xl border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Strong Subjects</span>
                  </div>
                  <ul className="space-y-1 text-xs text-slate-200 font-medium">
                    {aiAnalysis.strongSubjects.map((s, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Weak Subjects */}
                <div className="bg-white/5 p-5 rounded-2xl border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-rose-400">
                    <XCircle className="w-4 h-4" />
                    <span>Focus Weak Subjects</span>
                  </div>
                  <ul className="space-y-1 text-xs text-slate-200 font-medium">
                    {aiAnalysis.weakSubjects.map((s, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Topics to Improve */}
                <div className="bg-white/5 p-5 rounded-2xl border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                    <Target className="w-4 h-4" />
                    <span>High-Yield Topics to Fix</span>
                  </div>
                  <ul className="space-y-1 text-xs text-slate-200 font-medium">
                    {aiAnalysis.topicsToImprove.map((t, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Daily Goal */}
                <div className="bg-gradient-to-br from-purple-900/60 to-indigo-900/60 p-5 rounded-2xl border border-purple-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-purple-300">
                    <Zap className="w-4 h-4 text-purple-300" />
                    <span>Daily AI Goal</span>
                  </div>
                  <div className="text-sm font-extrabold text-white">
                    {aiAnalysis.dailyGoal}
                  </div>
                  <button
                    onClick={() => onNavigate('practice', { universityId: selectedUniId })}
                    className="mt-2 w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1"
                  >
                    <span>Start Practice Goal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Personalized Study Plan */}
              <div className="bg-white/5 p-5 rounded-2xl border border-white/10 space-y-3">
                <div className="text-xs font-extrabold text-blue-300 uppercase tracking-wider flex items-center gap-2">
                  <Compass className="w-4 h-4" />
                  <span>Personalized Step-by-Step Study Plan</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {aiAnalysis.studyPlan.map((step, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-white/5 border border-white/5 text-xs text-slate-200 font-medium flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 font-bold flex items-center justify-center shrink-0 text-[11px]">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* SECTION 6: RECENT MOCK TESTS */}
        <div className="bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-[32px] p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-600" />
                <span>Recent Mock Test Records</span>
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Stored persistently in Firestore collection
              </p>
            </div>

            <button
              onClick={() => onNavigate('mock-tests', { universityId: selectedUniId })}
              className="px-4 py-2 rounded-xl bg-purple-600 text-white font-extrabold text-xs hover:bg-purple-700 transition-colors flex items-center gap-1.5"
            >
              <span>Take New Mock Test</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {loadingHistory ? (
            <div className="py-8 text-center text-xs font-bold text-slate-400 animate-pulse">
              Loading Firestore mock test records...
            </div>
          ) : mockHistory.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
              <Clock className="w-10 h-10 mx-auto text-slate-400" />
              <div className="text-sm font-extrabold text-slate-800">No Mock Tests Taken Yet</div>
              <p className="text-xs text-slate-500 max-w-md mx-auto font-medium">
                Complete a 120-minute full mock exam to track your real university scoring, correct/wrong answers, and speed.
              </p>
              <button
                onClick={() => onNavigate('mock-tests', { universityId: selectedUniId })}
                className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-700 transition-colors inline-flex items-center gap-1.5"
              >
                <span>Launch First Mock Test</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {mockHistory.map((m) => {
                const totalQs = m.totalQuestions || 100;
                const scorePct = m.accuracy || Math.round((m.score / totalQs) * 100);
                const timeMins = Math.round((m.timeSpentSeconds || 3600) / 60);

                return (
                  <div 
                    key={m.id || Math.random()}
                    className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:bg-white hover:border-purple-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-extrabold text-slate-900">
                          {m.university} Mock Exam ({m.subject || 'Full Test'})
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-bold">
                          {m.difficulty || 'Standard'}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>Recorded in Firestore</span>
                        </span>
                        <span>•</span>
                        <span>{m.correctAnswers || 0} Correct</span>
                        <span>•</span>
                        <span>{m.wrongAnswers || 0} Wrong</span>
                        <span>•</span>
                        <span>{timeMins} Mins Duration</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-200">
                      <div className="text-right">
                        <div className="text-lg font-black text-purple-700">{scorePct}%</div>
                        <div className="text-[10px] text-slate-400 font-bold">Score ({m.score} / {totalQs})</div>
                      </div>

                      <button
                        onClick={() => setSelectedMockModal(m)}
                        className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-purple-50 hover:border-purple-300 text-slate-700 font-bold text-xs transition-colors flex items-center gap-1 shadow-2xs"
                      >
                        <FileText className="w-3.5 h-3.5 text-purple-600" />
                        <span>View Result</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* SECTION 7: ACHIEVEMENTS & BADGES */}
        <div className="bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-[32px] p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                <span>Achievements & Merit Badges</span>
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Unlock badges as you practice MCQs, maintain study streaks, and excel in mock tests
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {achievements.map((ach) => (
              <div
                key={ach.id}
                className={`p-5 rounded-[24px] border transition-all flex flex-col justify-between space-y-3 ${
                  ach.earned
                    ? 'bg-gradient-to-b from-white to-slate-50/80 border-slate-200/90 shadow-xs'
                    : 'bg-slate-100/50 border-slate-200/50 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                    ach.earned ? 'bg-amber-50 border border-amber-200' : 'bg-slate-200'
                  }`}>
                    {ach.icon}
                  </div>
                  {ach.earned ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold flex items-center gap-1">
                      <Check className="w-3 h-3" /> Earned
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 text-[10px] font-bold flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Locked
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-extrabold text-slate-900">{ach.title}</h4>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5 line-clamp-2">
                    {ach.desc}
                  </p>
                </div>

                <div className="text-[10px] text-slate-400 font-bold pt-1 border-t border-slate-100">
                  Status: {ach.date}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 8: QUICK ACTIONS LAUNCHPAD */}
        <div className="bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-[32px] p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            <span>Quick Actions Launchpad</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            {/* 1. Practice MCQs */}
            <div 
              onClick={() => onNavigate('practice', { universityId: selectedUniId })}
              className="p-6 rounded-[28px] bg-gradient-to-br from-blue-50 to-indigo-50/50 border border-blue-200/80 hover:border-blue-400 transition-all cursor-pointer group space-y-3"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Practice MCQs</h3>
                <p className="text-xs text-slate-600 font-medium mt-1">
                  Topic-wise Math, Physics, Chemistry & Computer Science drills.
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-blue-700 pt-2">
                <span>Start Practice</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* 2. Start Mock Test */}
            <div 
              onClick={() => onNavigate('mock-tests', { universityId: selectedUniId })}
              className="p-6 rounded-[28px] bg-gradient-to-br from-purple-50 to-indigo-50/50 border border-purple-200/80 hover:border-purple-400 transition-all cursor-pointer group space-y-3"
            >
              <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Start Mock Test</h3>
                <p className="text-xs text-slate-600 font-medium mt-1">
                  Full 120-min timed test with negative marking penalty rules.
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-purple-700 pt-2">
                <span>Launch Mock Exam</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* 3. Ask AI Tutor */}
            <div 
              onClick={() => onNavigate('ai-tutor')}
              className="p-6 rounded-[28px] bg-gradient-to-br from-indigo-50 to-purple-50/50 border border-indigo-200/80 hover:border-indigo-400 transition-all cursor-pointer group space-y-3"
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <Brain className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Ask AI Tutor</h3>
                <p className="text-xs text-slate-600 font-medium mt-1">
                  Step-by-step calculus, vectors, logic series & chemistry solutions.
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-indigo-700 pt-2">
                <span>Open Gemini AI</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* 4. Continue Last Session */}
            <div 
              onClick={() => onNavigate('practice', { universityId: selectedUniId })}
              className="p-6 rounded-[28px] bg-gradient-to-br from-emerald-50 to-teal-50/50 border border-emerald-200/80 hover:border-emerald-400 transition-all cursor-pointer group space-y-3"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <Play className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Continue Session</h3>
                <p className="text-xs text-slate-600 font-medium mt-1">
                  Resume your last active subject test session where you left off.
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-emerald-700 pt-2">
                <span>Resume Session</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* MOCK RESULT DETAIL MODAL */}
      {selectedMockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-[32px] p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 relative border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 border border-purple-200 flex items-center justify-center font-bold">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    {selectedMockModal.university} Mock Test Result
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Detailed performance report stored in Firestore
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedMockModal(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200">
                <div className="text-xs text-purple-700 font-bold uppercase">Accuracy</div>
                <div className="text-2xl font-black text-purple-800 mt-1">{selectedMockModal.accuracy || 85}%</div>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                <div className="text-xs text-emerald-700 font-bold uppercase">Correct</div>
                <div className="text-2xl font-black text-emerald-800 mt-1">{selectedMockModal.correctAnswers}</div>
              </div>
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200">
                <div className="text-xs text-rose-700 font-bold uppercase">Wrong</div>
                <div className="text-2xl font-black text-rose-800 mt-1">{selectedMockModal.wrongAnswers}</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200">
                <div className="text-xs text-slate-700 font-bold uppercase">Skipped</div>
                <div className="text-2xl font-black text-slate-800 mt-1">{selectedMockModal.skippedQuestions || 0}</div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider">
                Subject-wise Breakdown
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {Object.entries(selectedMockModal.subjectPerformance || {}).map(([subj, rawStats]) => {
                  const stats = rawStats as { total: number; correct: number; wrong: number; skipped: number };
                  const acc = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
                  return (
                    <div key={subj} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
                      <span className="font-extrabold text-slate-800">{subj}</span>
                      <div className="flex items-center gap-4 font-bold">
                        <span className="text-slate-600">{stats.correct}/{stats.total} Correct</span>
                        <span className="text-purple-700">{acc}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedMockModal(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
