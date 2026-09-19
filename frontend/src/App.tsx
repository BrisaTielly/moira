import { useState } from 'react';
import { Navbar } from './components/layout/Navbar';
import { HeroSection } from './components/landing/HeroSection';
import { InteractiveReadingSection } from './components/landing/InteractiveReadingSection';
import { HowItWorksSection } from './components/landing/HowItWorksSection';
import { FeatureCardsSection } from './components/landing/FeatureCardsSection';
import { FaqSection } from './components/landing/FaqSection';
import { Footer } from './components/layout/Footer';
import { storageService } from './services/storageService';
import type { SessionData, StartReadingResponse } from './types/session';

export function App() {
  const [session, setSession] = useState<SessionData | null>(() => storageService.getSession());
  const [editingName, setEditingName] = useState(false);

  const scrollToReading = () => {
    const el = document.getElementById('leitura');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSaveName = (name: string) => {
    const updated = storageService.saveUserName(name);
    setSession(updated);
    setEditingName(false);
  };

  const handleEditName = () => {
    setEditingName(true);
    scrollToReading();
  };

  const handleQuestionSubmitted = (response: StartReadingResponse) => {
    const updated = storageService.saveQuestion(response.question);
    setSession(updated);
  };

  const handleResetSession = () => {
    storageService.clearSession();
    setSession(null);
    setEditingName(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
        onStartReading={scrollToReading}
      />

      <main style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <HeroSection onStartReading={scrollToReading} />

        <InteractiveReadingSection
          userName={editingName ? undefined : session?.userName}
          sessionId={session?.sessionId || 'sess_temp'}
          initialQuestion={session?.question || ''}
          onSaveName={handleSaveName}
          onEditName={handleEditName}
          onQuestionSubmitted={handleQuestionSubmitted}
        />

        <HowItWorksSection />

        <FeatureCardsSection />

        <FaqSection />
      </main>

      <Footer
        onResetSession={handleResetSession}
        hasActiveSession={!!session?.userName}
      />
    </div>
  );
}

export default App;
