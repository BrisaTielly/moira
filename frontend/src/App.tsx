import { useCallback, useEffect, useState } from 'react';
import { Navbar } from './components/layout/Navbar';
import { HeroSection } from './components/landing/HeroSection';
import { ThemesMarquee } from './components/landing/ThemesMarquee';
import { BeforeAfterSection } from './components/landing/BeforeAfterSection';
import { FinalCtaSection } from './components/landing/FinalCtaSection';
import { usePageScrollVars } from './hooks/useScrollVars';
import { HowItWorksSection } from './components/landing/HowItWorksSection';
import { FeatureCardsSection } from './components/landing/FeatureCardsSection';
import { FaqSection } from './components/landing/FaqSection';
import { Footer } from './components/layout/Footer';
import { ReadingPage } from './components/reading/ReadingPage';
import { storageService } from './services/storageService';
import type { SessionData, StartReadingResponse } from './types/session';

export function App() {
  const [session, setSession] = useState<SessionData | null>(() => storageService.getSession());
  const [editingName, setEditingName] = useState(false);
  const [route, setRoute] = useState(() => window.location.pathname === '/leitura' ? 'reading' : 'home');
  usePageScrollVars();

  useEffect(() => {
    const handlePopState = () => {
      setRoute(window.location.pathname === '/leitura' ? 'reading' : 'home');
      window.scrollTo({ top: 0 });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: '/' | '/leitura') => {
    window.history.pushState({}, '', path);
    setRoute(path === '/leitura' ? 'reading' : 'home');
    window.scrollTo({ top: 0 });
  };

  const startReading = () => navigate('/leitura');
  const returnHome = () => {
    setEditingName(false);
    navigate('/');
  };

  const handleSaveName = (name: string) => {
    const updated = storageService.saveUserName(name);
    setSession(updated);
    setEditingName(false);
  };

  const handleEditName = () => {
    setEditingName(true);
    if (route !== 'reading') {
      startReading();
    }
  };

  const handleQuestionSubmitted = (response: StartReadingResponse) => {
    const updated = storageService.saveQuestion(response.question);
    setSession(updated);
  };

  const handleReadingRevealed = useCallback((readingId: string, sessionId: string) => {
    const updated = storageService.saveReading(readingId, sessionId);
    if (updated) setSession(updated);
  }, []);

  const handleResetSession = () => {
    storageService.clearSession();
    setSession(null);
    setEditingName(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (route === 'reading') {
    return (
      <ReadingPage
        userName={editingName ? undefined : session?.userName}
        sessionId={session?.sessionId || 'sess_temp'}
        initialQuestion={session?.question || ''}
        lastReadingId={session?.lastReadingId}
        onBack={returnHome}
        onSaveName={handleSaveName}
        onEditName={handleEditName}
        onQuestionSubmitted={handleQuestionSubmitted}
        onReadingRevealed={handleReadingRevealed}
      />
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: 'var(--bg-page)',
      }}
    >
      <Navbar
        userName={session?.userName}
        onEditName={handleEditName}
        onStartReading={startReading}
      />

      <main style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <HeroSection onStartReading={startReading} />

        <ThemesMarquee />

        <BeforeAfterSection />

        <HowItWorksSection />

        <FeatureCardsSection />

        <FaqSection />

        <FinalCtaSection
          onStartReading={startReading}
          userName={editingName ? undefined : session?.userName}
        />
      </main>

      <Footer
        onResetSession={handleResetSession}
        hasActiveSession={!!session?.userName}
      />
    </div>
  );
}

export default App;
