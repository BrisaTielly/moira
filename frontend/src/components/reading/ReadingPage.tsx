import React, { useCallback, useState } from 'react';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { InteractiveReadingSection } from '../landing/InteractiveReadingSection';
import { ReadingRitual, type RitualSource } from './ReadingRitual';
import type { StartReadingResponse } from '../../types/session';

interface ReadingPageProps {
  userName?: string;
  sessionId: string;
  initialQuestion?: string;
  lastReadingId?: string;
  onBack: () => void;
  onSaveName: (name: string) => void;
  onEditName: () => void;
  onQuestionSubmitted: (response: StartReadingResponse) => void;
  onReadingRevealed: (readingId: string, sessionId: string) => void;
}

const STEPS = ['Pergunta', 'Cartas', 'Leitura'] as const;

export const ReadingPage: React.FC<ReadingPageProps> = ({
  userName,
  sessionId,
  initialQuestion,
  lastReadingId,
  onBack,
  onSaveName,
  onEditName,
  onQuestionSubmitted,
  onReadingRevealed,
}) => {
  const [source, setSource] = useState<RitualSource | null>(null);
  const [ritualStep, setRitualStep] = useState<1 | 2 | 3>(2);
  const step = source ? ritualStep : 1;

  const handleSubmitted = (response: StartReadingResponse) => {
    onQuestionSubmitted(response);
    setSource({ kind: 'new', start: response });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStep = useCallback((s: 1 | 2 | 3) => setRitualStep(s), []);
  const review = (readingId: string) => setSource({ kind: 'review', readingId });

  return (
    <div className="reading-page">
      <header className="reading-header">
        <button type="button" className="reading-header__back" onClick={onBack}>
          <ArrowLeft size={17} />
          Voltar ao início
        </button>
        <span className="reading-header__brand" aria-label="Moira">
          moira <i aria-hidden="true">✦</i>
        </span>
        <ol className="reading-header__step" aria-label="Etapas da leitura">
          {STEPS.map((label, i) => (
            <li
              key={label}
              className={i + 1 === step ? 'is-current' : i + 1 < step ? 'is-done' : ''}
              aria-current={i + 1 === step ? 'step' : undefined}
            >
              {label}
            </li>
          ))}
        </ol>
      </header>

      <main className="reading-page__content">
        {source ? (
          <ReadingRitual
            key={source.kind === 'new' ? source.start.readingId : source.kind === 'review' ? source.readingId : 'limit'}
            source={source}
            sessionId={sessionId}
            userName={userName}
            lastReadingId={lastReadingId}
            onStepChange={handleStep}
            onRevealed={onReadingRevealed}
            onReview={review}
            onExit={onBack}
          />
        ) : (
          <>
            {lastReadingId && (
              <div className="reading-return">
                <BookOpen size={16} />
                <span>Você já tem uma leitura revelada.</span>
                <button type="button" onClick={() => review(lastReadingId)}>
                  Rever minha leitura
                </button>
              </div>
            )}
            <InteractiveReadingSection
              userName={userName}
              sessionId={sessionId}
              initialQuestion={initialQuestion}
              onSaveName={onSaveName}
              onEditName={onEditName}
              onQuestionSubmitted={handleSubmitted}
              onFreeReadingUsed={() => setSource({ kind: 'limit' })}
            />
          </>
        )}
      </main>
    </div>
  );
};
