import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  GraduationCap, 
  CheckCircle2, 
  Brain, 
  Clock, 
  Award, 
  Target, 
  BookOpen, 
  BarChart3, 
  Zap, 
  Lock, 
  ChevronRight, 
  ShieldCheck,
  Star,
  Users,
  Smartphone,
  Check,
  TrendingUp,
  HelpCircle,
  Sparkle
} from 'lucide-react';
import { UNIVERSITIES } from '../data/universities';
import { TESTIMONIALS } from '../data/testimonials';
import { HeroIllustration } from './HeroIllustration';

interface LandingPageProps {
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const [selectedDemoTab, setSelectedDemoTab] = useState<'math' | 'physics'>('math');
  const [showDemoExplanation, setShowDemoExplanation] = useState(false);

  const activeUniversities = UNIVERSITIES.filter(u => u.status === 'active');
  const comingSoonUniversities = UNIVERSITIES.filter(u => u.status === 'coming_soon');

  // Feature cards data
  const features = [
    {
      icon: BookOpen,
      title: 'Subject-wise MCQs',
      desc: 'Master Mathematics, Physics, Computer Science, English, and Analytical IQ with categorized topic-by-topic question banks.',
      color: 'bg-blue-50 text-blue-600 border-blue-100',
      target: 'practice',
    },
    {
      icon: Clock,
      title: 'Timed Mock Tests',
      desc: 'Simulate the exact test atmosphere of NED and FAST with countdown timers, automatic page navigation, and negative marking (-0.25).',
      color: 'bg-purple-50 text-purple-600 border-purple-100',
      target: 'mock-tests',
    },
    {
      icon: Brain,
      title: 'AI Tutor',
      desc: 'Get instant line-by-line step-by-step solutions, speed shortcuts, and formula derivations for any tricky question in milliseconds.',
      color: 'bg-indigo-50 text-indigo-600 border-indigo-100',
      target: 'ai-tutor',
    },
    {
      icon: TrendingUp,
      title: 'Progress Tracking',
      desc: 'Keep track of your total attempted questions, test scores, daily streaks, and aggregate trends in a clean personal dashboard.',
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      target: 'dashboard',
    },
    {
      icon: BarChart3,
      title: 'Smart Analytics',
      desc: 'Pinpoint your weak topics automatically with accuracy charts, so you can focus revision on areas that boost your aggregate.',
      color: 'bg-amber-50 text-amber-600 border-amber-100',
      target: 'dashboard',
    },
    {
      icon: Smartphone,
      title: 'Practice Anytime',
      desc: 'Seamlessly practice on your smartphone, tablet, or laptop with an ultra-responsive, mobile-first student interface.',
      color: 'bg-rose-50 text-rose-600 border-rose-100',
      target: 'practice',
    },
  ];

  // Why choose stats
  const stats = [
    { value: '10,000+', label: 'Practice Questions', sub: 'Verified test-pattern MCQs' },
    { value: '2.0x', label: 'AI Powered Learning', sub: 'Instant AI step-by-step solver' },
    { value: '100%', label: 'Real Exam Simulation', sub: 'Exact timing & negative marking rules' },
    { value: '98%', label: 'Performance Analytics', sub: 'Topic-wise weakness identification' },
  ];

  return (
    <div className="relative overflow-hidden bg-slate-50/50 text-slate-900 selection:bg-purple-100 selection:text-purple-900">
      
      {/* Background Subtle Mesh / Gradients (Sleek Interface) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[700px] pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] bg-blue-100/80 rounded-full blur-[120px] opacity-70" />
        <div className="absolute top-[100px] left-[-100px] w-[500px] h-[500px] bg-purple-100/80 rounded-full blur-[120px] opacity-70" />
      </div>

      {/* Floating AI Assistant Widget */}
      <div 
        onClick={() => onNavigate('ai-tutor')}
        className="fixed bottom-6 right-6 w-52 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-slate-100/90 flex flex-col gap-2.5 z-40 hidden sm:flex hover:scale-105 transition-transform cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">AI Assistant Live</span>
        </div>
        <div className="bg-slate-50 p-2 rounded-lg text-[11px] text-slate-600 italic">
          "Need help solving a Physics equation step-by-step?"
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); onNavigate('ai-tutor'); }}
          className="w-full h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white text-[10px] font-bold shadow-xs hover:opacity-95 transition-opacity"
        >
          Ask AI Tutor
        </button>
      </div>

      {/* SECTION 1: HERO SECTION */}
      <section className="relative pt-10 pb-16 sm:pt-16 sm:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50/90 border border-blue-200/80 text-blue-700 text-xs font-bold shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                <span>🚀 AI-Powered Preparation Platform</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                Ace Your University Entry Test with{' '}
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  AI Guidance
                </span>
              </h1>

              {/* Description */}
              <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
                The smartest, most comprehensive entry test preparation platform for Pakistan's top engineering and CS universities. Master official NED & FAST exam patterns with instant step-by-step AI explanations.
              </p>

              {/* Hero Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button
                  onClick={() => onNavigate('signup')}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold text-base shadow-xl shadow-blue-500/20 hover:shadow-2xl hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => onNavigate('ai-tutor')}
                  className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white border border-slate-200/90 text-slate-800 font-bold text-base shadow-xs hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2.5"
                >
                  <div className="w-6 h-6 rounded-lg bg-purple-100 flex items-center justify-center text-purple-700">
                    <Brain className="w-4 h-4" />
                  </div>
                  <span>Try AI Tutor</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs font-semibold text-slate-500">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Aligned with 2026 Test Syllabus</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>FAST Negative Marking Calc</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>No Credit Card Required</span>
                </div>
              </div>

            </div>

            {/* Right Column: Interactive Illustration / Dashboard Mockup */}
            <div className="lg:col-span-5">
              <HeroIllustration />
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 2: FEATURES SECTION */}
      <section id="features" className="py-20 bg-white border-y border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold mb-3">
              <Zap className="w-3.5 h-3.5" /> Core Capabilities
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Powerful Features Designed for High Scores
            </h2>
            <p className="mt-3 text-slate-600 text-base">
              Everything you need to practice, learn, analyze, and excel in engineering & CS entrance exams.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feat, index) => {
              const Icon = feat.icon;
              return (
                <div
                  key={index}
                  onClick={() => onNavigate(feat.target)}
                  className="bg-white/90 backdrop-blur-md rounded-[28px] p-7 border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between group cursor-pointer active:scale-[0.99]"
                >
                  <div>
                    <div className={`w-12 h-12 rounded-2xl ${feat.color} border flex items-center justify-center font-bold mb-5 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {feat.title}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>

                  <div className="pt-6 flex items-center gap-1.5 text-xs font-bold text-blue-600 group-hover:text-purple-600 group-hover:translate-x-1 transition-all">
                    <span>Explore Feature</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* SECTION 3: UNIVERSITIES SECTION */}
      <section id="universities" className="py-20 bg-slate-50/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold mb-3">
              <Target className="w-3.5 h-3.5" /> Supported Universities
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Target Your Dream University Entry Test
            </h2>
            <p className="mt-3 text-slate-600 text-base">
              Prepared according to official past papers, subject weightages, and exact time durations.
            </p>
          </div>

          {/* Active Universities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {activeUniversities.map((uni) => (
              <div 
                key={uni.id}
                className="bg-white/80 backdrop-blur-xl border border-white p-6 sm:p-8 rounded-[32px] shadow-xl shadow-blue-900/5 hover:border-blue-200 transition-all hover:-translate-y-1 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Active Prep
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {uni.passingCriteria}
                    </span>
                  </div>

                  <div className="flex items-center gap-5 mb-5">
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${uni.logoAccent} flex items-center justify-center text-white font-black text-2xl shadow-lg border border-white/40 group-hover:scale-105 transition-transform shrink-0`}>
                      {uni.name.substring(0, 4)}
                    </div>
                    <div>
                      <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {uni.name}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">{uni.fullName}</p>
                    </div>
                  </div>

                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    {uni.shortDesc}
                  </p>

                  <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50/90 border border-slate-100 mb-6">
                    <div>
                      <div className="text-[11px] text-slate-500 font-medium">MCQs</div>
                      <div className="text-lg font-bold text-slate-900">{uni.totalQuestions}</div>
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-500 font-medium">Duration</div>
                      <div className="text-lg font-bold text-slate-900">{uni.timeLimitMinutes} Mins</div>
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-500 font-medium">Negative Mark</div>
                      <div className="text-lg font-bold text-slate-900">
                        {uni.negativeMarking ? '-0.25' : 'None'}
                      </div>
                    </div>
                  </div>

                  {/* Subjects */}
                  <div className="space-y-2 mb-8">
                    <div className="text-xs font-semibold text-slate-500">Subject Breakdown:</div>
                    <div className="flex flex-wrap gap-2">
                      {uni.subjects.map((sub, idx) => (
                        <span 
                          key={idx}
                          className="px-3 py-1 rounded-full bg-slate-100/90 text-slate-700 text-xs font-medium border border-slate-200/60"
                        >
                          {sub.name} ({sub.mcqCount})
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => onNavigate('practice', { universityId: uni.id })}
                    className="flex-1 py-3.5 px-5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold text-sm shadow-md shadow-blue-500/20 hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <span>Practice {uni.name}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onNavigate('practice', { universityId: uni.id, mode: 'mock' })}
                    className="py-3.5 px-5 rounded-2xl bg-slate-100 text-slate-800 font-bold text-sm hover:bg-slate-200 transition-colors flex items-center gap-1.5"
                  >
                    <Clock className="w-4 h-4 text-slate-600" />
                    <span>Mock Test</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Coming Soon Container */}
          <div className="bg-white/40 backdrop-blur-sm border border-white/80 p-6 sm:p-8 rounded-[24px]">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                Coming Soon to EntryAce AI
              </h4>
              <div className="h-px flex-1 mx-4 bg-slate-200" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {comingSoonUniversities.map((uni) => (
                <div 
                  key={uni.id}
                  className="bg-white/70 p-4 rounded-2xl border border-white flex flex-col items-center text-center opacity-80 hover:opacity-100 transition-all hover:scale-105 shadow-xs"
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${uni.logoAccent} flex items-center justify-center text-white font-black text-sm mb-2 shadow-xs`}>
                    {uni.name.substring(0, 3)}
                  </div>
                  <h5 className="font-bold text-slate-800 text-sm">{uni.name}</h5>
                  <span className="text-[10px] text-slate-400 font-medium mt-0.5">{uni.fullName.split(' ')[0]} Admission</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 4: WHY CHOOSE ENTRYACE AI (STATISTICS) */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5" /> High Impact Results
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Why EntryAce AI is the Top Choice for Aspirants
            </h2>
            <p className="mt-3 text-slate-300 text-base">
              Engineered specifically to transform preparation into guaranteed university admission seats.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div 
                key={idx}
                className="bg-slate-800/80 border border-slate-700/80 p-8 rounded-3xl text-center space-y-2 backdrop-blur-md shadow-lg"
              >
                <div className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-lg font-bold text-white pt-1">{stat.label}</div>
                <p className="text-xs text-slate-400">{stat.sub}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 5: TESTIMONIALS SECTION */}
      <section id="testimonials" className="py-20 bg-white border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold mb-3">
              <Star className="w-3.5 h-3.5 fill-emerald-600" /> Student Success Stories
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Loved by Top Entry Test Rankers
            </h2>
            <p className="mt-3 text-slate-600 text-base">
              See how students secured their dream engineering & CS seats in NED, FAST, and NUST.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((item) => (
              <div 
                key={item.id}
                className="bg-slate-50/80 rounded-[28px] p-7 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-6 hover:border-blue-200 hover:shadow-md transition-all"
              >
                <div className="space-y-4">
                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>

                  <p className="text-slate-700 text-sm leading-relaxed italic">
                    "{item.quote}"
                  </p>
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-slate-200/60">
                  <img 
                    src={item.avatar} 
                    alt={item.name} 
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-xs"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{item.name}</h4>
                    <p className="text-xs text-blue-600 font-semibold">{item.university}</p>
                    <span className="inline-block mt-0.5 px-2 py-0.2 rounded text-[10px] bg-emerald-100 text-emerald-800 font-bold">
                      {item.score}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 6: FINAL CTA SECTION */}
      <section className="py-20 bg-slate-50/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="relative rounded-[36px] bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-10 sm:p-16 text-white text-center shadow-2xl overflow-hidden">
            <div className="absolute -top-24 -left-24 w-72 h-72 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-purple-900/30 rounded-full blur-2xl" />

            <div className="max-w-3xl mx-auto relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-bold border border-white/20">
                <Sparkles className="w-3.5 h-3.5" /> Admissions 2026 Batch
              </div>

              <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                Start Preparing Today
              </h2>
              <p className="text-blue-100 text-base sm:text-lg max-w-2xl mx-auto">
                Join thousands of students practicing for NED, FAST, and top university entrance exams with instant AI tutoring.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => onNavigate('signup')}
                  className="w-full sm:w-auto px-9 py-4 rounded-2xl bg-white text-slate-900 font-bold text-base shadow-xl hover:bg-slate-50 hover:scale-105 transition-all"
                >
                  Create Free Account
                </button>
                <button
                  onClick={() => onNavigate('practice')}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/30 text-white font-bold text-base hover:bg-white/20 transition-all"
                >
                  Start Practicing Immediately
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
};
