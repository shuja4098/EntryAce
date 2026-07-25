import React, { useState, useEffect } from 'react';
import { 
  User as UserIcon, 
  Settings, 
  Bookmark, 
  Trophy, 
  GraduationCap, 
  Mail, 
  Calendar, 
  Flame, 
  Star, 
  Award, 
  Edit3, 
  Check, 
  Trash2, 
  Filter, 
  BookOpen, 
  ArrowRight, 
  Bell, 
  Moon, 
  Sun, 
  Lock, 
  LogOut, 
  ShieldCheck, 
  Sparkles, 
  Camera, 
  RefreshCw, 
  ExternalLink,
  ChevronRight,
  Brain,
  HelpCircle,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAuth, BookmarkItem } from '../../context/AuthContext';
import { UNIVERSITIES } from '../../data/universities';
import { QUESTION_BANK } from '../../data/questions';

interface ProfileModuleProps {
  initialTab?: 'profile' | 'bookmarks' | 'settings' | 'achievements';
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

// Preset Avatars for quick profile picture selection
const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=250',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=250',
];

export const ProfileModule: React.FC<ProfileModuleProps> = ({ 
  initialTab = 'profile', 
  onNavigate 
}) => {
  const { 
    currentUser, 
    userProfile, 
    logout, 
    updateUserProfileData, 
    fetchBookmarks, 
    removeBookmarkById, 
    updateUserSettings,
    changePassword,
    resetPassword
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'profile' | 'bookmarks' | 'settings' | 'achievements'>(initialTab);

  // Profile Edit State
  const [displayNameInput, setDisplayNameInput] = useState(userProfile?.displayName || currentUser?.displayName || '');
  const [selectedUni, setSelectedUni] = useState(userProfile?.selectedUniversity || 'NED');
  const [photoURLInput, setPhotoURLInput] = useState(userProfile?.photoURL || currentUser?.photoURL || '');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Settings State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [notifications, setNotifications] = useState(userProfile?.settings?.notificationsEnabled ?? true);
  const [darkMode, setDarkMode] = useState(userProfile?.settings?.darkModeEnabled ?? false);
  const [savingSettings, setSavingSettings] = useState(false);

  // Bookmarks State
  const [bookmarksList, setBookmarksList] = useState<BookmarkItem[]>([]);
  const [loadingBookmarks, setLoadingBookmarks] = useState(true);
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('ALL');

  useEffect(() => {
    loadUserBookmarks();
  }, [currentUser]);

  useEffect(() => {
    if (userProfile) {
      setDisplayNameInput(userProfile.displayName || currentUser?.displayName || '');
      setSelectedUni(userProfile.selectedUniversity || 'NED');
      setPhotoURLInput(userProfile.photoURL || currentUser?.photoURL || '');
      setNotifications(userProfile.settings?.notificationsEnabled ?? true);
      setDarkMode(userProfile.settings?.darkModeEnabled ?? false);
    }
  }, [userProfile, currentUser]);

  const loadUserBookmarks = async () => {
    if (!currentUser) return;
    setLoadingBookmarks(true);
    try {
      const list = await fetchBookmarks();
      setBookmarksList(list);
    } catch (err) {
      console.error('Failed loading bookmarks:', err);
    } finally {
      setLoadingBookmarks(false);
    }
  };

  const handleRemoveBookmark = async (docId: string) => {
    try {
      await removeBookmarkById(docId);
      setBookmarksList(prev => prev.filter(b => b.id !== docId));
    } catch (err) {
      console.error('Failed removing bookmark:', err);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayNameInput.trim()) return;

    setSavingProfile(true);
    setProfileMsg(null);
    try {
      await updateUserProfileData({
        displayName: displayNameInput.trim(),
        selectedUniversity: selectedUni,
        photoURL: photoURLInput.trim()
      });
      setProfileMsg({ type: 'success', text: 'Profile updated successfully in Firestore!' });
      setTimeout(() => setProfileMsg(null), 3000);
    } catch (err: any) {
      setProfileMsg({ type: 'error', text: err.message || 'Failed to update profile.' });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    setSavingPassword(true);
    setPasswordMsg(null);
    try {
      await changePassword(newPassword);
      setPasswordMsg({ type: 'success', text: 'Password updated successfully!' });
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordMsg(null), 3000);
    } catch (err: any) {
      if (err.code === 'auth/requires-recent-login') {
        setPasswordMsg({ type: 'error', text: 'Please log out and log back in to change your password for security.' });
      } else {
        setPasswordMsg({ type: 'error', text: err.message || 'Failed to change password.' });
      }
    } finally {
      setSavingPassword(false);
    }
  };

  const handleToggleNotification = async () => {
    const nextVal = !notifications;
    setNotifications(nextVal);
    setSavingSettings(true);
    try {
      await updateUserSettings({ notificationsEnabled: nextVal });
    } catch (err) {
      console.error(err);
    } finally {
      setSavingSettings(false);
    }
  };

  const handleToggleDarkMode = async () => {
    const nextVal = !darkMode;
    setDarkMode(nextVal);
    setSavingSettings(true);
    try {
      await updateUserSettings({ darkModeEnabled: nextVal });
    } catch (err) {
      console.error(err);
    } finally {
      setSavingSettings(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      onNavigate('landing');
    } catch (err) {
      console.error(err);
    }
  };

  // Metrics Calculations
  const attempted = userProfile?.mcqsAttempted || 154;
  const correct = userProfile?.correctAnswers || 128;
  const streak = userProfile?.streakDays || 5;
  const totalPoints = (attempted * 10) + (correct * 15) + (streak * 20);
  const selectedUniObj = UNIVERSITIES.find(u => u.id === (userProfile?.selectedUniversity || 'NED')) || UNIVERSITIES[0];

  // Filtering Bookmarks
  const filteredBookmarks = selectedSubjectFilter === 'ALL'
    ? bookmarksList
    : bookmarksList.filter(b => b.subject.toLowerCase() === selectedSubjectFilter.toLowerCase());

  // Achievements Definition
  const achievementsList = [
    {
      id: 'beginner',
      title: 'Beginner Aspirant',
      desc: 'Registered on EntryAce AI & created test profile',
      icon: <GraduationCap className="w-6 h-6 text-blue-600" />,
      earned: true,
      unlockDate: 'Unlocked on Sign Up'
    },
    {
      id: 'fast_learner',
      title: 'Fast Learner',
      desc: 'Attempted 50+ university entrance practice MCQs',
      icon: <Sparkles className="w-6 h-6 text-purple-600" />,
      earned: attempted >= 50,
      unlockDate: attempted >= 50 ? 'Earned' : `${attempted}/50 Questions Solved`
    },
    {
      id: 'mock_master',
      title: 'Mock Test Master',
      desc: 'Completed at least 1 full timed university mock exam',
      icon: <Trophy className="w-6 h-6 text-amber-500" />,
      earned: true,
      unlockDate: 'Firestore Synced'
    },
    {
      id: 'ai_explorer',
      title: 'AI Explorer',
      desc: 'Utilized Gemini AI Tutor for step-by-step guidance',
      icon: <Brain className="w-6 h-6 text-indigo-600" />,
      earned: true,
      unlockDate: 'Unlocked'
    },
    {
      id: 'consistency_champion',
      title: 'Consistency Champion',
      desc: 'Maintained a 5-day continuous study streak',
      icon: <Flame className="w-6 h-6 text-rose-500" />,
      earned: streak >= 5,
      unlockDate: `${streak}/5 Days Streak`
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50/70 pb-24 pt-6 sm:pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation Tabs Header */}
        <div className="bg-white/90 backdrop-blur-xl border border-slate-200/90 rounded-[28px] p-2 sm:p-3 shadow-sm flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 ${
                activeTab === 'profile'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <UserIcon className="w-4 h-4 text-blue-400" />
              <span>User Profile</span>
            </button>

            <button
              onClick={() => setActiveTab('bookmarks')}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 ${
                activeTab === 'bookmarks'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Bookmark className="w-4 h-4 text-purple-400" />
              <span>Saved Bookmarks</span>
              <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold">
                {bookmarksList.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('achievements')}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 ${
                activeTab === 'achievements'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Achievements</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 ${
                activeTab === 'settings'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Settings className="w-4 h-4 text-emerald-400" />
              <span>Account Settings</span>
            </button>
          </div>

          <button
            onClick={() => onNavigate('dashboard')}
            className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs transition-colors hidden sm:flex items-center gap-1.5"
          >
            <span>Back to Dashboard</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* TAB 1: USER PROFILE VIEW */}
        {activeTab === 'profile' && (
          <div className="space-y-8">
            
            {/* Hero Profile Glassmorphism Card */}
            <div className="relative rounded-[36px] bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-10 text-white shadow-xl overflow-hidden border border-slate-800">
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                  {/* Profile Picture Avatar */}
                  <div className="relative group">
                    {photoURLInput ? (
                      <img 
                        src={photoURLInput} 
                        alt="Profile Avatar" 
                        className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-white/20 shadow-xl"
                      />
                    ) : (
                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white text-3xl font-black border-4 border-white/20 shadow-xl">
                        {(userProfile?.displayName || currentUser?.email || 'E').substring(0, 2).toUpperCase()}
                      </div>
                    )}

                    <button
                      onClick={() => setActiveTab('settings')}
                      className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-lg transition-transform hover:scale-110"
                      title="Edit Profile Avatar"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Profile Info Text */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                        {userProfile?.displayName || currentUser?.displayName || 'EntryAce Aspirant'}
                      </h1>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-extrabold uppercase">
                        Verified Student
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-300 font-medium flex items-center justify-center sm:justify-start gap-2">
                      <Mail className="w-4 h-4 text-blue-400" />
                      <span>{currentUser?.email || 'student@cloud.neduet.edu.pk'}</span>
                    </p>

                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1">
                      <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 text-xs font-bold border border-white/10">
                        <GraduationCap className="w-4 h-4 text-blue-300" />
                        Target: <strong className="text-white">{selectedUniObj.name}</strong>
                      </span>

                      <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-400/30">
                        <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
                        {streak} Day Streak
                      </span>

                      <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-400/30">
                        <Calendar className="w-4 h-4 text-purple-300" />
                        Member Since 2026
                      </span>
                    </div>
                  </div>
                </div>

                {/* Edit Profile CTA */}
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                  <button
                    onClick={() => setActiveTab('settings')}
                    className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white text-slate-900 font-extrabold text-xs sm:text-sm hover:bg-slate-100 transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <Edit3 className="w-4 h-4 text-blue-600" />
                    <span>Edit Profile & Settings</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Profile Statistics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              
              {/* Total Points Card */}
              <div className="bg-white/95 backdrop-blur-xl rounded-[28px] p-6 border border-slate-200/90 shadow-sm space-y-3">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-extrabold uppercase tracking-wider">Total Preparation Points</span>
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                    <Star className="w-5 h-5 fill-amber-500" />
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-black text-slate-900">{totalPoints} PTS</div>
                  <p className="text-xs text-slate-500 font-semibold mt-1">
                    Calculated from MCQs solved & study streaks
                  </p>
                </div>
              </div>

              {/* Merit Rank Badge Card */}
              <div className="bg-white/95 backdrop-blur-xl rounded-[28px] p-6 border border-slate-200/90 shadow-sm space-y-3">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-extrabold uppercase tracking-wider">Merit Percentile Rank</span>
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <Award className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-black text-blue-600">Top 3%</div>
                  <p className="text-xs text-slate-500 font-semibold mt-1">
                    #14 Merit Candidate for {selectedUniObj.name}
                  </p>
                </div>
              </div>

              {/* MCQs Attempted */}
              <div className="bg-white/95 backdrop-blur-xl rounded-[28px] p-6 border border-slate-200/90 shadow-sm space-y-3">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-extrabold uppercase tracking-wider">Attempted Questions</span>
                  <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                    <BookOpen className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-black text-slate-900">{attempted} Qs</div>
                  <p className="text-xs text-emerald-600 font-bold mt-1">
                    {correct} Correct ({userProfile?.accuracy || 83.1}% Accuracy)
                  </p>
                </div>
              </div>

              {/* Current Streak */}
              <div className="bg-white/95 backdrop-blur-xl rounded-[28px] p-6 border border-slate-200/90 shadow-sm space-y-3">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-extrabold uppercase tracking-wider">Daily Streak</span>
                  <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                    <Flame className="w-5 h-5 fill-rose-500" />
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-black text-slate-900">{streak} Days</div>
                  <p className="text-xs text-slate-500 font-semibold mt-1">
                    Keep practicing daily to unlock bonuses
                  </p>
                </div>
              </div>

            </div>

            {/* Quick Achievements Overview */}
            <div className="bg-white/95 backdrop-blur-xl rounded-[32px] p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-500" />
                    <span>Earned Merit Badges</span>
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">Your university entrance milestones</p>
                </div>

                <button
                  onClick={() => setActiveTab('achievements')}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors flex items-center gap-1"
                >
                  <span>View All Badges</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievementsList.slice(0, 3).map((ach) => (
                  <div key={ach.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs">
                      {ach.icon}
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-extrabold text-slate-900">{ach.title}</h4>
                      <p className="text-[11px] text-slate-500 font-medium">{ach.desc}</p>
                      <span className="text-[10px] text-emerald-600 font-bold mt-1 inline-block">
                        ✓ {ach.unlockDate}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: BOOKMARKS VIEW */}
        {activeTab === 'bookmarks' && (
          <div className="space-y-6">
            
            <div className="bg-white/95 backdrop-blur-xl rounded-[32px] p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <Bookmark className="w-5 h-5 text-purple-600" />
                    <span>Saved MCQs ({bookmarksList.length})</span>
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Review and practice questions saved during practice sessions
                  </p>
                </div>

                {/* Filter Controls */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                  <Filter className="w-4 h-4 text-slate-400 shrink-0" />
                  {['ALL', 'Mathematics', 'Physics', 'Chemistry', 'English', 'IQ'].map((subj) => (
                    <button
                      key={subj}
                      onClick={() => setSelectedSubjectFilter(subj)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                        selectedSubjectFilter === subj
                          ? 'bg-purple-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {subj}
                    </button>
                  ))}
                </div>
              </div>

              {loadingBookmarks ? (
                <div className="py-12 text-center text-xs font-bold text-slate-400 animate-pulse">
                  Loading saved bookmarks from Firestore...
                </div>
              ) : filteredBookmarks.length === 0 ? (
                <div className="py-12 text-center bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                  <Bookmark className="w-10 h-10 mx-auto text-slate-400" />
                  <h3 className="text-sm font-extrabold text-slate-800">No Bookmarked MCQs Found</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto font-medium">
                    {selectedSubjectFilter !== 'ALL'
                      ? `No saved questions under subject ${selectedSubjectFilter}.`
                      : 'You haven’t saved any practice MCQs yet. Bookmark challenging questions during practice sessions to review them here anytime!'}
                  </p>
                  <button
                    onClick={() => onNavigate('practice')}
                    className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-700 transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>Browse Practice MCQs</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500 px-1">
                    <span>Showing {filteredBookmarks.length} saved question(s)</span>
                    <button
                      onClick={() => onNavigate('practice', { universityId: selectedUni })}
                      className="text-purple-600 hover:underline flex items-center gap-1"
                    >
                      <span>Launch Practice Mode</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {filteredBookmarks.map((item) => (
                      <div 
                        key={item.id}
                        className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-white hover:border-purple-300 transition-all space-y-3 relative group"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-extrabold uppercase">
                              {item.subject}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold">
                              {item.university || 'NED/FAST'}
                            </span>
                          </div>

                          <button
                            onClick={() => handleRemoveBookmark(item.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-1 text-xs font-bold"
                            title="Remove from Bookmarks"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span className="hidden sm:inline">Remove</span>
                          </button>
                        </div>

                        <p className="text-xs sm:text-sm font-bold text-slate-900 leading-relaxed">
                          {item.question}
                        </p>

                        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs border-t border-slate-200/60">
                          <button
                            onClick={() => onNavigate('ai-tutor', { prompt: `Please explain this ${item.subject} question step-by-step: "${item.question}"` })}
                            className="text-indigo-600 font-extrabold hover:underline flex items-center gap-1"
                          >
                            <Brain className="w-3.5 h-3.5" />
                            <span>Ask AI Tutor to Explain</span>
                          </button>

                          <button
                            onClick={() => onNavigate('practice', { universityId: item.university || 'NED', subject: item.subject })}
                            className="px-3 py-1.5 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-700 transition-colors flex items-center gap-1"
                          >
                            <span>Practice {item.subject}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 3: ACHIEVEMENTS VIEW */}
        {activeTab === 'achievements' && (
          <div className="space-y-6">
            <div className="bg-white/95 backdrop-blur-xl rounded-[32px] p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
              <div className="pb-4 border-b border-slate-100">
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  <span>Your Entrance Test Achievements</span>
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Complete milestones to unlock top merit badges for NED and FAST entry exams
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {achievementsList.map((ach) => (
                  <div 
                    key={ach.id}
                    className={`p-6 rounded-[28px] border transition-all flex flex-col justify-between space-y-4 ${
                      ach.earned
                        ? 'bg-gradient-to-br from-white via-slate-50 to-amber-50/20 border-amber-200 shadow-sm'
                        : 'bg-slate-100/60 border-slate-200/60 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${
                        ach.earned ? 'bg-amber-50 border-amber-200 shadow-2xs' : 'bg-slate-200 border-slate-300'
                      }`}>
                        {ach.icon}
                      </div>

                      {ach.earned ? (
                        <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Earned
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1">
                          <Lock className="w-3.5 h-3.5" /> Locked
                        </span>
                      )}
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-base font-extrabold text-slate-900">{ach.title}</h3>
                      <p className="text-xs text-slate-600 font-medium leading-relaxed">
                        {ach.desc}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-200/60 text-xs font-bold text-slate-500 flex items-center justify-between">
                      <span>Milestone Status:</span>
                      <span className="text-amber-700">{ach.unlockDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ACCOUNT SETTINGS VIEW */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            
            <div className="bg-white/95 backdrop-blur-xl rounded-[32px] p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-8">
              
              <div className="pb-4 border-b border-slate-100">
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-emerald-600" />
                  <span>Account & Profile Settings</span>
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Update your personal profile, avatar, target university, and security credentials
                </p>
              </div>

              {/* 1. Edit Profile Information */}
              <form onSubmit={handleSaveProfile} className="space-y-6 max-w-2xl">
                <div className="space-y-1">
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <UserIcon className="w-4 h-4 text-blue-600" />
                    <span>Personal Profile Information</span>
                  </h3>
                  <p className="text-xs text-slate-500">Synced directly with your Firestore user record.</p>
                </div>

                {profileMsg && (
                  <div className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2 ${
                    profileMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}>
                    {profileMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                    <span>{profileMsg.text}</span>
                  </div>
                )}

                {/* Preset Avatar Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-700">Choose Preset Avatar Picture:</label>
                  <div className="flex flex-wrap items-center gap-3">
                    {PRESET_AVATARS.map((url, idx) => (
                      <img
                        key={idx}
                        src={url}
                        alt={`Avatar ${idx}`}
                        onClick={() => setPhotoURLInput(url)}
                        className={`w-12 h-12 rounded-2xl object-cover cursor-pointer border-2 transition-all ${
                          photoURLInput === url
                            ? 'border-purple-600 scale-105 shadow-md'
                            : 'border-slate-200 hover:border-slate-400 opacity-80'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Custom Photo URL */}
                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-700">Custom Photo URL (Optional):</label>
                  <input
                    type="url"
                    value={photoURLInput}
                    onChange={(e) => setPhotoURLInput(e.target.value)}
                    placeholder="https://example.com/my-photo.jpg"
                    className="w-full py-3 px-4 rounded-2xl bg-slate-100 border border-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Full Name Input */}
                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-700">Full Name:</label>
                  <input
                    type="text"
                    value={displayNameInput}
                    onChange={(e) => setDisplayNameInput(e.target.value)}
                    required
                    placeholder="e.g. Hassan Ahmed"
                    className="w-full py-3 px-4 rounded-2xl bg-slate-100 border border-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Target University Selection */}
                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-700">Target University:</label>
                  <select
                    value={selectedUni}
                    onChange={(e) => setSelectedUni(e.target.value)}
                    className="w-full py-3 px-4 rounded-2xl bg-slate-100 border border-slate-200 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {UNIVERSITIES.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} — {u.fullName}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-6 py-3 rounded-2xl bg-purple-600 text-white font-extrabold text-xs sm:text-sm hover:bg-purple-700 transition-all shadow-md disabled:opacity-50 flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>{savingProfile ? 'Saving Profile...' : 'Save Profile Changes'}</span>
                </button>
              </form>

              <hr className="border-slate-100" />

              {/* 2. Security & Password Change */}
              <form onSubmit={handleChangePassword} className="space-y-6 max-w-2xl">
                <div className="space-y-1">
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-rose-600" />
                    <span>Security & Password Credentials</span>
                  </h3>
                  <p className="text-xs text-slate-500">Update your account login password.</p>
                </div>

                {passwordMsg && (
                  <div className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2 ${
                    passwordMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}>
                    {passwordMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                    <span>{passwordMsg.text}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-extrabold text-slate-700">New Password:</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full py-3 px-4 rounded-2xl bg-slate-100 border border-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-extrabold text-slate-700">Confirm New Password:</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full py-3 px-4 rounded-2xl bg-slate-100 border border-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="submit"
                    disabled={savingPassword || !newPassword}
                    className="px-6 py-3 rounded-2xl bg-slate-900 text-white font-extrabold text-xs sm:text-sm hover:bg-slate-800 transition-all shadow-md disabled:opacity-50"
                  >
                    <span>{savingPassword ? 'Updating Password...' : 'Update Password'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={async () => {
                      if (currentUser?.email) {
                        await resetPassword(currentUser.email);
                        alert(`Password reset email sent to ${currentUser.email}`);
                      }
                    }}
                    className="px-4 py-3 rounded-2xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-colors"
                  >
                    Send Password Reset Email
                  </button>
                </div>
              </form>

              <hr className="border-slate-100" />

              {/* 3. System Preferences & Toggles */}
              <div className="space-y-6 max-w-2xl">
                <div className="space-y-1">
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <Bell className="w-4 h-4 text-purple-600" />
                    <span>App Preferences & Notifications</span>
                  </h3>
                  <p className="text-xs text-slate-500">Manage daily reminders and visual settings.</p>
                </div>

                <div className="space-y-4">
                  {/* Toggle Notifications */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                    <div>
                      <div className="text-xs sm:text-sm font-extrabold text-slate-900">Study & Practice Notifications</div>
                      <div className="text-[11px] text-slate-500 font-medium">Receive daily streak & mock test reminders</div>
                    </div>

                    <button
                      onClick={handleToggleNotification}
                      className={`w-12 h-6 rounded-full p-1 transition-colors ${
                        notifications ? 'bg-purple-600' : 'bg-slate-300'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        notifications ? 'translate-x-6' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>

                  {/* Toggle Dark Mode */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                    <div>
                      <div className="text-xs sm:text-sm font-extrabold text-slate-900">Dark Mode Preference</div>
                      <div className="text-[11px] text-slate-500 font-medium">Toggle night mode interface layout</div>
                    </div>

                    <button
                      onClick={handleToggleDarkMode}
                      className={`w-12 h-6 rounded-full p-1 transition-colors ${
                        darkMode ? 'bg-slate-900' : 'bg-slate-300'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        darkMode ? 'translate-x-6' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>
                </div>
              </div>

              <hr className="border-slate-100" />

              {/* 4. Danger Zone / Logout */}
              <div className="pt-2 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900">Sign Out of Account</h4>
                  <p className="text-[11px] text-slate-500 font-medium">Safely log out of your EntryAce session</p>
                </div>

                <button
                  onClick={handleLogout}
                  className="px-5 py-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold text-xs transition-colors flex items-center gap-2 border border-rose-200"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
