import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { AuthPage } from './components/Auth/AuthPage';
import { ProtectedRoute } from './components/Auth/ProtectedRoute';
import { Dashboard } from './components/Dashboard';
import { PracticeModule } from './components/Practice/PracticeModule';
import { MockTestModule } from './components/MockTest/MockTestModule';
import { AITutor } from './components/AITutor';
import { FloatingAskAI } from './components/FloatingAskAI';
import { ProfileModule } from './components/Profile/ProfileModule';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [navParams, setNavParams] = useState<Record<string, any>>({});
  const [isPageTransitioning, setIsPageTransitioning] = useState<boolean>(false);

  const handleNavigate = (page: string, params?: Record<string, any>) => {
    setIsPageTransitioning(true);
    setCurrentPage(page);
    if (params) {
      setNavParams(params);
    } else {
      setNavParams({});
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });

    setTimeout(() => {
      setIsPageTransitioning(false);
    }, 250);
  };

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans antialiased relative">
        {/* Top Loading Progress Bar for Page Navigation */}
        {isPageTransitioning && (
          <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 animate-pulse" />
        )}

        <Navbar onNavigate={handleNavigate} currentPage={currentPage} />
        
        <main className={`flex-1 transition-opacity duration-200 ${isPageTransitioning ? 'opacity-85' : 'opacity-100'}`}>
          {currentPage === 'landing' && (
            <LandingPage onNavigate={handleNavigate} />
          )}

          {currentPage === 'login' && (
            <AuthPage initialMode="login" onNavigate={handleNavigate} />
          )}

          {currentPage === 'signup' && (
            <AuthPage initialMode="signup" onNavigate={handleNavigate} />
          )}

          {currentPage === 'dashboard' && (
            <ProtectedRoute onNavigate={handleNavigate}>
              <Dashboard onNavigate={handleNavigate} />
            </ProtectedRoute>
          )}

          {(currentPage === 'practice' || currentPage === 'universities') && (
            <PracticeModule 
              initialUniversityId={navParams.universityId || 'NED'}
              initialSubject={navParams.subject}
              onNavigateAI={(prompt) => handleNavigate('ai-tutor', { prompt })}
              onNavigateHome={() => handleNavigate('dashboard')}
            />
          )}

          {(currentPage === 'mock-tests' || currentPage === 'mock-test') && (
            <ProtectedRoute onNavigate={handleNavigate}>
              <MockTestModule
                initialUniversity={navParams.universityId || 'NED'}
                onBackToDashboard={() => handleNavigate('dashboard')}
                onOpenAITutorWithContext={(q) => {
                  const correctOpt = q.options.find(o => o.id === q.correctOptionId)?.text;
                  const prompt = `Please explain this ${q.universityId} entry test question step-by-step:\n\nSubject: ${q.subject}\nTopic: ${q.topic}\nQuestion: ${q.question}\nCorrect Answer: ${correctOpt}\nExplanation: ${q.explanation}`;
                  handleNavigate('ai-tutor', { prompt });
                }}
              />
            </ProtectedRoute>
          )}

          {currentPage === 'ai-tutor' && (
            <AITutor
              initialPrompt={navParams.prompt}
              onNavigateHome={() => handleNavigate('dashboard')}
            />
          )}

          {(currentPage === 'profile' || currentPage === 'bookmarks' || currentPage === 'settings' || currentPage === 'achievements') && (
            <ProtectedRoute onNavigate={handleNavigate}>
              <ProfileModule
                initialTab={(currentPage as any)}
                onNavigate={handleNavigate}
              />
            </ProtectedRoute>
          )}
        </main>

        <Footer onNavigate={handleNavigate} />
        <FloatingAskAI currentPage={currentPage} onNavigate={handleNavigate} />
      </div>
    </AuthProvider>
  );
}
