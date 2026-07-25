import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Lock, ArrowRight, GraduationCap, Sparkles } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, onNavigate }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-purple-600/10 border border-purple-200 flex items-center justify-center animate-spin">
          <Sparkles className="w-6 h-6 text-purple-600" />
        </div>
        <div className="text-center space-y-1">
          <h3 className="text-sm font-extrabold text-slate-800">Verifying Session...</h3>
          <p className="text-xs text-slate-500 font-medium">Loading EntryAce student profile</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4 sm:p-6 bg-slate-50/50">
        <div className="max-w-md w-full bg-white/90 backdrop-blur-xl rounded-[32px] p-8 border border-slate-200/90 shadow-lg text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-600 border border-amber-200/80 flex items-center justify-center mx-auto shadow-xs">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-extrabold uppercase">
              Authentication Required
            </span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Access Protected Portal</h2>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Please log in or register a free EntryAce AI account to view your personalized dashboard, practice questions, saved bookmarks, and AI study sessions.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => onNavigate('login')}
              className="w-full py-3 px-4 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>Log In to Account</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('signup')}
              className="w-full py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm transition-colors"
            >
              Create Free Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
