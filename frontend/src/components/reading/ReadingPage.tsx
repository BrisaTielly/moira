import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { InteractiveReadingSection } from '../landing/InteractiveReadingSection';
import type { StartReadingResponse } from '../../types/session';

interface ReadingPageProps {
  userName?: string;
  sessionId: string;
  initialQuestion?: string;
  onBack: () => void;
  onSaveName: (name: string) => void;
  onEditName: () => void;
  onQuestionSubmitted: (response: StartReadingResponse) => void;
}

export const ReadingPage: React.FC<ReadingPageProps> = ({
  userName,
  sessionId,
  initialQuestion,
  onBack,
  onSaveName,
  onEditName,
  onQuestionSubmitted,
}) => (
  <div className="reading-page">
    <header className="reading-header">
      <button type="button" className="reading-header__back" onClick={onBack}>
        <ArrowLeft size={17} />
        Voltar ao início
      </button>
      <span className="reading-header__brand" aria-label="Moira">
        moira <i aria-hidden="true">✦</i>
      </span>
      <span className="reading-header__step">Pergunta · Cartas · Leitura</span>
    </header>

    <main className="reading-page__content">
      <InteractiveReadingSection
        userName={userName}
        sessionId={sessionId}
        initialQuestion={initialQuestion}
        onSaveName={onSaveName}
        onEditName={onEditName}
        onQuestionSubmitted={onQuestionSubmitted}
      />
    </main>
  </div>
);
