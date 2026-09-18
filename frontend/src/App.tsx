import { useState } from 'react';
import { Header } from './components/layout/Header';
import { Shell } from './components/layout/Shell';
import { NameStep } from './components/onboarding/NameStep';
import { QuestionStep } from './components/onboarding/QuestionStep';
import { storageService } from './services/storageService';
import type { SessionData, StartReadingResponse } from './types/session';

export function App() {
  const [session, setSession] = useState<SessionData | null>(() => storageService.getSession());
  const [currentStep, setCurrentStep] = useState<'name' | 'question'>(() => {
    const existing = storageService.getSession();
    return existing && existing.userName ? 'question' : 'name';
  });

  const handleSaveName = (name: string) => {
    const updatedSession = storageService.saveUserName(name);
    setSession(updatedSession);
    setCurrentStep('question');
  };

  const handleEditName = () => {
    setCurrentStep('name');
  };

  const handleQuestionSubmitted = (response: StartReadingResponse) => {
    // Atualiza a sessão com a pergunta confirmada
    const updatedSession = storageService.saveQuestion(response.question);
    setSession(updatedSession);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: 'var(--bg-parchment)',
      }}
    >
      <Header
        userName={session?.userName}
        onEditName={session?.userName ? handleEditName : undefined}
        showNameBadge={currentStep === 'question'}
      />

      <Shell>
        {currentStep === 'name' && (
          <NameStep
            initialName={session?.userName || ''}
            onSaveName={handleSaveName}
          />
        )}

        {currentStep === 'question' && session && (
          <QuestionStep
            userName={session.userName}
            sessionId={session.sessionId}
            initialQuestion={session.question || ''}
            onEditName={handleEditName}
            onQuestionSubmitted={handleQuestionSubmitted}
          />
        )}
      </Shell>

      {/* Rodapé Discreto e Ritualístico */}
      <footer
        style={{
          borderTop: '1px solid var(--border-subtle)',
          padding: '20px 32px',
          textAlign: 'center',
          fontSize: '13px',
          color: 'var(--text-faint)',
          backgroundColor: 'var(--bg-parchment-light)',
          marginTop: 'auto',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', maxWidth: '1280px', margin: '0 auto' }}>
          <span>Moira · Santuário Pessoal de Tarot & Escuta</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>Sessão local ativa</span>
            <span>•</span>
            <button
              type="button"
              onClick={() => {
                storageService.clearSession();
                setSession(null);
                setCurrentStep('name');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                textDecoration: 'underline',
                cursor: 'pointer',
                fontSize: '12px',
              }}
            >
              Reiniciar sessão
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
