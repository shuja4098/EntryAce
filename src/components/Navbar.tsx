import React, { useState } from 'react';
import { Sparkles, GraduationCap, ArrowRight, Menu, X, BookOpen, Brain, ShieldCheck, User as UserIcon, LogOut, LayoutDashboard, Bookmark, Settings, Trophy } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onNavigate?: (page: string, params?: Record<string, any>) => void;
  currentPage?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPage = 'landing' }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser, userProfile, logout } = useAuth();

  const handleNavClick = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    }
    setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      handleNavClick('landing');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const userName = currentUser?.displayName || userProfile?.displayName || currentUser?.email?.split('@')[0] || 'User';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/85 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo */}
          <div 
            onClick={() => handleNavClick('landing')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-slate-900">
                  Entry<span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Ace</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-100 text-purple-700 border border-purple-200">
                  <Sparkles className="w-2.5 h-2.5" /> AI
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                University Entrance Prep Platform
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/70 p-1.5 rounded-full border border-slate-200/60">
            <button
              onClick={() => handleNavClick('landing')}
              className={`px-4 py-1.5 text-xs sm:text-sm font-medium rounded-full transition-colors ${
                currentPage === 'landing'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('universities')}
              className={`px-4 py-1.5 text-xs sm:text-sm font-medium rounded-full transition-colors flex items-center gap-1.5 ${
                currentPage === 'universities'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Universities</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-blue-100 text-blue-700 font-bold">
                2 Active
              </span>
            </button>
            <button
              onClick={() => handleNavClick('practice')}
              className={`px-4 py-1.5 text-xs sm:text-sm font-medium rounded-full transition-colors ${
                currentPage === 'practice'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              MCQ Practice
            </button>
            <button
              onClick={() => handleNavClick('mock-tests')}
              className={`px-4 py-1.5 text-xs sm:text-sm font-medium rounded-full transition-colors ${
                currentPage === 'mock-tests' || currentPage === 'mock-test'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Mock Tests
            </button>
            <button
              onClick={() => handleNavClick('ai-tutor')}
              className={`px-4 py-1.5 text-xs sm:text-sm font-medium rounded-full transition-colors flex items-center gap-1 ${
                currentPage === 'ai-tutor'
                  ? 'bg-white text-purple-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Brain className="w-3.5 h-3.5 text-purple-500" />
              AI Tutor
            </button>
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-2">
            {currentUser ? (
              <>
                <button
                  onClick={() => handleNavClick('dashboard')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    currentPage === 'dashboard'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 text-blue-600" />
                  <span>Dashboard</span>
                </button>

                <button
                  onClick={() => handleNavClick('bookmarks')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    currentPage === 'bookmarks'
                      ? 'bg-purple-50 text-purple-700 border border-purple-200'
                      : 'text-slate-700 hover:text-purple-600 hover:bg-slate-50'
                  }`}
                  title="Saved Bookmarks"
                >
                  <Bookmark className="w-4 h-4 text-purple-600" />
                  <span className="hidden lg:inline">Bookmarks</span>
                </button>

                <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                  <button
                    onClick={() => handleNavClick('profile')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all ${
                      currentPage === 'profile' || currentPage === 'settings'
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
                    }`}
                  >
                    {userProfile?.photoURL || currentUser?.photoURL ? (
                      <img 
                        src={userProfile?.photoURL || currentUser?.photoURL} 
                        alt="User Avatar" 
                        className="w-5 h-5 rounded-full object-cover"
                      />
                    ) : (
                      <UserIcon className="w-4 h-4 text-blue-600" />
                    )}
                    <span className="text-xs font-bold max-w-[100px] truncate">{userName}</span>
                  </button>

                  <button
                    onClick={handleLogout}
                    title="Log Out"
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleNavClick('login')}
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors"
                >
                  Log In
                </button>
                <button
                  onClick={() => handleNavClick('signup')}
                  className="relative group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-semibold text-sm shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-indigo-500/30 transition-all hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3">
          <div className="flex flex-col space-y-2">
            <button
              onClick={() => handleNavClick('landing')}
              className="text-left px-3 py-2 text-base font-medium text-slate-800 rounded-lg hover:bg-slate-100"
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('universities')}
              className="text-left px-3 py-2 text-base font-medium text-slate-800 rounded-lg hover:bg-slate-100 flex items-center justify-between"
            >
              <span>Universities</span>
              <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">NED & FAST</span>
            </button>
            <button
              onClick={() => handleNavClick('practice')}
              className="text-left px-3 py-2 text-base font-medium text-slate-800 rounded-lg hover:bg-slate-100"
            >
              MCQ Practice
            </button>
            <button
              onClick={() => handleNavClick('mock-tests')}
              className="text-left px-3 py-2 text-base font-medium text-slate-800 rounded-lg hover:bg-slate-100"
            >
              Mock Tests
            </button>
            <button
              onClick={() => handleNavClick('ai-tutor')}
              className="text-left px-3 py-2 text-base font-medium text-purple-700 bg-purple-50 rounded-lg flex items-center gap-2"
            >
              <Brain className="w-4 h-4" />
              AI Tutor
            </button>

            {currentUser && (
              <>
                <div className="pt-2 border-t border-slate-100 space-y-1">
                  <div className="px-3 py-1 text-xs font-bold text-slate-400 uppercase tracking-wider">User Account</div>
                  <button
                    onClick={() => handleNavClick('dashboard')}
                    className="w-full text-left px-3 py-2 text-sm font-bold text-slate-800 rounded-lg hover:bg-slate-100 flex items-center gap-2"
                  >
                    <LayoutDashboard className="w-4 h-4 text-blue-600" />
                    <span>Dashboard</span>
                  </button>
                  <button
                    onClick={() => handleNavClick('profile')}
                    className="w-full text-left px-3 py-2 text-sm font-bold text-slate-800 rounded-lg hover:bg-slate-100 flex items-center gap-2"
                  >
                    <UserIcon className="w-4 h-4 text-purple-600" />
                    <span>User Profile</span>
                  </button>
                  <button
                    onClick={() => handleNavClick('bookmarks')}
                    className="w-full text-left px-3 py-2 text-sm font-bold text-slate-800 rounded-lg hover:bg-slate-100 flex items-center gap-2"
                  >
                    <Bookmark className="w-4 h-4 text-purple-600" />
                    <span>Saved Bookmarks</span>
                  </button>
                  <button
                    onClick={() => handleNavClick('settings')}
                    className="w-full text-left px-3 py-2 text-sm font-bold text-slate-800 rounded-lg hover:bg-slate-100 flex items-center gap-2"
                  >
                    <Settings className="w-4 h-4 text-emerald-600" />
                    <span>Account Settings</span>
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            {currentUser ? (
              <button
                onClick={handleLogout}
                className="w-full py-2.5 text-center text-sm font-bold text-rose-600 border border-rose-200 bg-rose-50 rounded-xl"
              >
                Log Out
              </button>
            ) : (
              <>
                <button
                  onClick={() => handleNavClick('login')}
                  className="w-full py-2.5 text-center text-sm font-semibold text-slate-700 border border-slate-200 rounded-xl"
                >
                  Log In
                </button>
                <button
                  onClick={() => handleNavClick('signup')}
                  className="w-full py-2.5 text-center text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-md"
                >
                  Get Started Free
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
