import React, { useState } from 'react';
import { 
  GraduationCap, 
  Sparkles, 
  Mail, 
  Lock, 
  User as UserIcon, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Brain, 
  ShieldCheck, 
  Trophy,
  KeyRound,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AuthPageProps {
  initialMode?: 'login' | 'signup';
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ initialMode = 'login', onNavigate }) => {
  const { login, signup, loginWithGoogle, resetPassword } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>(initialMode);
  
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Map Firebase errors to human friendly text
  const formatAuthError = (errCode: string): string => {
    if (errCode.includes('user-not-found') || errCode.includes('wrong-password') || errCode.includes('invalid-credential')) {
      return 'Invalid email address or password. Please try again.';
    }
    if (errCode.includes('email-already-in-use')) {
      return 'An account with this email address already exists. Try logging in.';
    }
    if (errCode.includes('weak-password')) {
      return 'Password should be at least 6 characters long.';
    }
    if (errCode.includes('invalid-email')) {
      return 'Please enter a valid email address.';
    }
    if (errCode.includes('popup-closed-by-user')) {
      return 'Google sign-in popup was closed before completion.';
    }
    return 'Authentication failed. Please check your credentials and try again.';
  };

  // Handle Login Submit
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!email.trim() || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      setLoading(true);
      await login(email.trim(), password);
      setSuccessMsg('Successfully logged in! Redirecting to Dashboard...');
      setTimeout(() => {
        onNavigate('dashboard');
      }, 800);
    } catch (err: any) {
      console.error('Login Error:', err);
      setError(formatAuthError(err.message || ''));
    } finally {
      setLoading(false);
    }
  };

  // Handle Signup Submit
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify your password.');
      return;
    }

    try {
      setLoading(true);
      await signup(name.trim(), email.trim(), password);
      setSuccessMsg('Account created successfully! Redirecting to Dashboard...');
      setTimeout(() => {
        onNavigate('dashboard');
      }, 800);
    } catch (err: any) {
      console.error('Signup Error:', err);
      setError(formatAuthError(err.message || ''));
    } finally {
      setLoading(false);
    }
  };

  // Handle Google Auth
  const handleGoogleSignIn = async () => {
    setError(null);
    setSuccessMsg(null);
    try {
      setLoading(true);
      await loginWithGoogle();
      setSuccessMsg('Google sign in successful! Redirecting to Dashboard...');
      setTimeout(() => {
        onNavigate('dashboard');
      }, 800);
    } catch (err: any) {
      console.error('Google Auth Error:', err);
      setError(formatAuthError(err.message || ''));
    } finally {
      setLoading(false);
    }
  };

  // Handle Forgot Password
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!email.trim()) {
      setError('Please enter your email address to receive password reset instructions.');
      return;
    }

    try {
      setLoading(true);
      await resetPassword(email.trim());
      setSuccessMsg(`Password reset link sent to ${email.trim()}. Please check your inbox.`);
    } catch (err: any) {
      console.error('Reset Password Error:', err);
      setError(formatAuthError(err.message || ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50/60 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Background Soft Orbs */}
      <div className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] bg-blue-100/70 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-[-100px] left-[-100px] w-[500px] h-[500px] bg-purple-100/70 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="w-full max-w-5xl bg-white/80 backdrop-blur-xl border border-white rounded-[32px] shadow-2xl shadow-blue-900/10 overflow-hidden grid grid-cols-1 lg:grid-cols-12 my-auto">
        
        {/* LEFT SIDE: Educational Illustration & Brand Showcase */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle Ambient Orbs */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/20 rounded-full blur-2xl pointer-events-none" />

          {/* Top Logo */}
          <div className="relative z-10 space-y-6">
            <div 
              onClick={() => onNavigate('landing')}
              className="inline-flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-blue-500/30 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-white">
                  Entry<span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Ace</span>
                </span>
                <span className="ml-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-900/80 text-purple-300 border border-purple-700/50">
                  AI Prep
                </span>
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                Official NED & FAST Prep
              </span>
              <h2 className="text-2xl sm:text-3xl font-black leading-tight">
                Master Your Entry Test with{' '}
                <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-300 bg-clip-text text-transparent">
                  Gemini AI
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                Join thousands of engineering and CS aspirants getting step-by-step Gemini AI explanations and realistic exam simulation.
              </p>
            </div>
          </div>

          {/* Center Illustration Mockup */}
          <div className="relative z-10 py-8 my-auto space-y-3">
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2 backdrop-blur-md">
              <div className="flex items-center justify-between text-xs font-bold text-purple-300">
                <span className="flex items-center gap-1.5">
                  <Brain className="w-4 h-4 text-purple-400" />
                  Gemini AI Tutor
                </span>
                <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/80 px-2 py-0.5 rounded">
                  99.4% Accuracy
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-normal italic">
                "Instant step-by-step breakdown for complex Calculus integration and Physics vectors."
              </p>
            </div>

            <div className="space-y-2 pt-2 text-xs font-semibold text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>10,000+ Past Paper MCQs</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Timed Exam Simulator with -0.25 Penalty</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Topic-Wise Aggregate Radar</span>
              </div>
            </div>
          </div>

          {/* Bottom Footer Note */}
          <div className="relative z-10 pt-4 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>© 2026 EntryAce AI</span>
            <span className="flex items-center gap-1 text-slate-300 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Secure Firebase Auth
            </span>
          </div>

        </div>


        {/* RIGHT SIDE: Auth Form (Login / Signup / Forgot) */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
          
          {/* Header Switcher */}
          {mode !== 'forgot' && (
            <div className="flex items-center justify-between pb-6 border-b border-slate-100 mb-6">
              <div>
                <h3 className="text-2xl font-extrabold text-slate-900">
                  {mode === 'login' ? 'Welcome back!' : 'Create an Account'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                  {mode === 'login' 
                    ? 'Enter your details to access your entry test portal.' 
                    : 'Start your journey to NED & FAST university admission.'}
                </p>
              </div>

              {/* Mode Toggle Pills */}
              <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200/70">
                <button
                  type="button"
                  onClick={() => { setMode('login'); setError(null); setSuccessMsg(null); }}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    mode === 'login'
                      ? 'bg-white text-blue-600 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => { setMode('signup'); setError(null); setSuccessMsg(null); }}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    mode === 'signup'
                      ? 'bg-white text-blue-600 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Sign Up
                </button>
              </div>
            </div>
          )}

          {/* Header for Forgot Password Mode */}
          {mode === 'forgot' && (
            <div className="pb-6 border-b border-slate-100 mb-6 space-y-2">
              <button
                type="button"
                onClick={() => { setMode('login'); setError(null); setSuccessMsg(null); }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </button>
              <h3 className="text-2xl font-extrabold text-slate-900">
                Reset Password
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Enter your registered email address and we'll send you a password reset link.
              </p>
            </div>
          )}

          {/* Feedback Messages */}
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm font-medium flex items-start gap-3 animate-fade-in">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
              <div className="flex-1">{error}</div>
            </div>
          )}

          {successMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-medium flex items-start gap-3 animate-fade-in">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 mt-0.5" />
              <div className="flex-1">{successMsg}</div>
            </div>
          )}

          {/* LOGIN FORM */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="student@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50/80 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 bg-slate-50/80 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="rememberMe" className="text-xs font-semibold text-slate-600 cursor-pointer">
                  Remember me on this device
                </label>
              </div>

              {/* Submit Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold text-sm shadow-md shadow-blue-500/20 hover:shadow-lg hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Log In to EntryAce</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* SIGNUP FORM */}
          {mode === 'signup' && (
            <form onSubmit={handleSignup} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Muhammad Saad"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50/80 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="student@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50/80 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Password Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="At least 6 chars"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50/80 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Re-enter password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50/80 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Show Password toggle */}
              <div className="flex items-center justify-between text-xs text-slate-500">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showPassword ? 'Hide Passwords' : 'Show Passwords'}</span>
                </button>
                <span>Min 6 characters</span>
              </div>

              {/* Submit Signup Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold text-sm shadow-md shadow-blue-500/20 hover:shadow-lg hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Free Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* FORGOT PASSWORD FORM */}
          {mode === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Your Registered Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="student@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50/80 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold text-sm shadow-md shadow-blue-500/20 hover:shadow-lg hover:opacity-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending email...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Send Reset Email</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* OR DIVIDER */}
          {mode !== 'forgot' && (
            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200/80" />
              </div>
              <span className="relative bg-white px-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
                Or
              </span>
            </div>
          )}

          {/* GOOGLE SIGN IN BUTTON */}
          {mode !== 'forgot' && (
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-3 px-6 rounded-2xl bg-white border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 hover:border-slate-300 shadow-2xs transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          )}

          {/* Bottom Prompt */}
          <div className="pt-6 text-center text-xs text-slate-500 font-medium">
            {mode === 'login' ? (
              <p>
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('signup'); setError(null); setSuccessMsg(null); }}
                  className="font-bold text-blue-600 hover:underline"
                >
                  Create one for free
                </button>
              </p>
            ) : mode === 'signup' ? (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('login'); setError(null); setSuccessMsg(null); }}
                  className="font-bold text-blue-600 hover:underline"
                >
                  Log in here
                </button>
              </p>
            ) : null}
          </div>

        </div>

      </div>
    </div>
  );
};
