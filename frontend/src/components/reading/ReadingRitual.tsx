import React, { useEffect, useReducer, useRef } from 'react';
import { AlertTriangle, ArrowRight, RotateCcw, Scissors, Shuffle } from 'lucide-react';
import { CardBack, TarotCard } from '../tarot/TarotCard';
import { RitualTable } from './RitualTable';
import { OracleLoading } from './OracleLoading';
import { InterpretationScroll } from './InterpretationScroll';
import { SupportPanel } from './SupportPanel';
import { ContinuationTeaser } from './ContinuationTeaser';
import { Sparkles4 } from '../motion/Sparkles';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { toFace } from '../../lib/arcana';
import { initialRitualState, ritualHint, ritualReducer } from '../../lib/ritualPreview';
import {
  createFlow,
  createReviewFlow,
  flowReducer,
  pendingRequest,
  progressStep,
  type FlowAction,
} from '../../lib/readingFlow';
import { ApiError } from '../../services/apiClient';
import { readingService } from '../../services/readingService';
import type { StartReadingResponse } from '../../types/session';

export type RitualSource =
  | { kind: 'new'; start: StartReadingResponse }
  | { kind: 'review'; readingId: string }
  | { kind: 'limit' };

interface ReadingRitualProps {
  source: RitualSource;
  sessionId: string;
  userName?: string;
  lastReadingId?: string;
  onStepChange?: (step: 1 | 2 | 3) => void;
  onRevealed?: (readingId: string, sessionId: string) => void;
  onReview?: (readingId: string) => void;
  onExit: () => void;
}

const SHUFFLE_MS = 1150;
const CUT_MS = 800;
const FLIP_STAGGER_MS = 650;

function toFailure(err: unknown, step: 'draw' | 'interpret'): FlowAction {
  if (err instanceof ApiError && err.code === 'free_reading_used') return { type: 'LIMIT' };
  if (err instanceof ApiError) return { type: 'FAIL', step, message: err.message, retryable: err.retryable || err.code === 'too_many_requests' };
  return { type: 'FAIL', step, message: 'Algo inesperado aconteceu. Suas cartas estão guardadas; tente novamente.', retryable: true };
}

export const ReadingRitual: React.FC<ReadingRitualProps> = ({
  source,
  sessionId,
  userName,
  lastReadingId,
  onStepChange,
  onRevealed,
  onReview,
  onExit,
}) => {
  const reduced = useReducedMotion();
  const readingId = source.kind === 'new' ? source.start.readingId : source.kind === 'review' ? source.readingId : '';
  const effectiveSession = source.kind === 'new' ? source.start.sessionId : sessionId;

  const [flow, dispatch] = useReducer(flowReducer, source, (src): ReturnType<typeof createFlow> => {
    if (src.kind === 'review') return createReviewFlow();
    if (src.kind === 'limit') return { ...createFlow({ tableSlots: 0, cardsToPick: 3 }), stage: 'limit' };
    return createFlow({
      tableSlots: src.start.tableSlots,
      cardsToPick: src.start.cardsToPick,
      support: src.start.status === 'support' ? src.start.support : null,
    });
  });
  const [ritual, ritualDispatch] = useReducer(ritualReducer, initialRitualState);

  // ---- Indicador de etapa no cabeçalho ----
  useEffect(() => {
    onStepChange?.(progressStep(flow.stage));
  }, [flow.stage, onStepChange]);

  // ---- Animações do embaralhar/cortar ----
  useEffect(() => {
    if (ritual.phase === 'shuffling') {
      const id = window.setTimeout(() => ritualDispatch({ type: 'SHUFFLE_DONE' }), reduced ? 0 : SHUFFLE_MS);
      return () => window.clearTimeout(id);
    }
    if (ritual.phase === 'cutting') {
      const id = window.setTimeout(() => ritualDispatch({ type: 'CUT_DONE' }), reduced ? 0 : CUT_MS);
      return () => window.clearTimeout(id);
    }
  }, [ritual.phase, ritual.shuffles, reduced]);

  // ---- Requisições (idempotentes no servidor: repetir é seguro) ----
  const pending = pendingRequest(flow);
  const picksKey = flow.picks.join(',');
  useEffect(() => {
    if (!pending || !readingId) return;
    let cancelled = false;

    if (pending === 'draw') {
      readingService
        .drawCards(readingId, effectiveSession, picksKey.split(',').map(Number))
        .then((res) => !cancelled && dispatch({ type: 'DRAW_OK', cards: res.cards }))
        .catch((err: unknown) => !cancelled && dispatch(toFailure(err, 'draw')));
    } else {
      readingService
        .getInterpretation(readingId, effectiveSession)
        .then((res) => {
          if (cancelled) return;
          if (res.status === 'support' && res.support) dispatch({ type: 'SUPPORT', support: res.support });
          else if (res.interpretation) dispatch({ type: 'INTERPRET_OK', interpretation: res.interpretation, cards: res.cards });
          else dispatch({ type: 'FAIL', step: 'interpret', message: 'A leitura voltou incompleta. Tente novamente.', retryable: true });
        })
        .catch((err: unknown) => !cancelled && dispatch(toFailure(err, 'interpret')));
    }
    return () => {
      cancelled = true;
    };
  }, [pending, readingId, effectiveSession, picksKey]);

  // ---- Tempo da revelação das cartas ----
  useEffect(() => {
    if (flow.stage !== 'revealing') return;
    const total = reduced ? 0 : FLIP_STAGGER_MS * 3 + 900;
    const id = window.setTimeout(() => dispatch({ type: 'REVEAL_DONE' }), total);
    return () => window.clearTimeout(id);
  }, [flow.stage, reduced]);

  // ---- Leitura revelada: vira página do Grimório local ----
  const savedRef = useRef(false);
  useEffect(() => {
    if (flow.stage === 'revealed' && !savedRef.current && readingId) {
      savedRef.current = true;
      onRevealed?.(readingId, effectiveSession);
    }
  }, [flow.stage, readingId, effectiveSession, onRevealed]);

  // ---------- Render ----------
  if (flow.stage === 'support' && flow.support) {
    return <SupportPanel support={flow.support} onBack={onExit} />;
  }

  if (flow.stage === 'limit') {
    return (
      <div className="altar altar--limit">
        <Sparkles4 />
        <ContinuationTeaser variant="limit" />
        {lastReadingId && onReview && (
          <button type="button" className="btn-pill btn-ghost altar__review" onClick={() => onReview(lastReadingId)}>
            Rever minha leitura revelada
          </button>
        )}
      </div>
    );
  }

  const showCards = flow.cards && (flow.stage === 'revealing' || flow.stage === 'interpreting' || flow.stage === 'revealed' || (flow.stage === 'error' && flow.error?.step === 'interpret'));

  return (
    <div className={`altar altar--${flow.stage}`}>
      <Sparkles4 />

      {flow.stage === 'ritual' && (
        <div className="altar__stage">
          <div className="altar__intro">
            <span className="altar__eyebrow">Passo 2 · O ritual</span>
            <h2 className="altar__title">Segure a sua pergunta no coração</h2>
            {source.kind === 'new' && <p className="altar__question">“{source.start.question}”</p>}
          </div>

          <div className={`deck deck--big deck--${ritual.phase}`} aria-hidden="true">
            {Array.from({ length: 7 }, (_, i) => (
              <div
                key={`${ritual.shuffles}-${i}`}
                className={`deck__card ${i >= 3 ? 'deck__card--top' : 'deck__card--bottom'}`}
                style={{ ['--i' as string]: i, ['--dir' as string]: i % 2 ? 1 : -1, zIndex: i }}
              >
                <CardBack />
              </div>
            ))}
          </div>

          <div className="altar__controls">
            <p className="altar__lead" aria-live="polite">{ritualHint(ritual.phase)}</p>
            {ritual.error && <p className="altar__notice" role="alert">{ritual.error}</p>}
            <div className="altar__buttons">
              {ritual.phase === 'ready' ? (
                <button type="button" className="btn-pill btn-cream btn-lg btn-shine" onClick={() => dispatch({ type: 'RITUAL_DONE' })}>
                  Abrir a mesa <ArrowRight size={18} />
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    className="btn-pill btn-glass"
                    disabled={ritual.phase === 'shuffling' || ritual.phase === 'cutting'}
                    onClick={() => ritualDispatch({ type: 'SHUFFLE' })}
                  >
                    <Shuffle size={16} /> {ritual.shuffles > 0 ? 'Embaralhar de novo' : 'Embaralhar'}
                  </button>
                  <button
                    type="button"
                    className="btn-pill btn-cream"
                    disabled={ritual.phase === 'shuffling' || ritual.phase === 'cutting'}
                    onClick={() => ritualDispatch({ type: 'CUT' })}
                  >
                    <Scissors size={16} /> Cortar o baralho
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {(flow.stage === 'choosing' || flow.stage === 'drawing' || (flow.stage === 'error' && flow.error?.step === 'draw')) && (
        <RitualTable
          slots={flow.tableSlots}
          picks={flow.picks}
          cardsToPick={flow.cardsToPick}
          notice={flow.stage === 'drawing' ? 'Revelando as suas cartas…' : flow.notice}
          onToggle={(slot) => dispatch({ type: 'TOGGLE_PICK', slot })}
          onConfirm={() => dispatch({ type: 'CONFIRM_PICKS' })}
        />
      )}

      {showCards && flow.cards && (
        <div className="reveal">
          {flow.cards.map((card, i) => (
            <div key={card.position} className="reveal__slot">
              <span className="reveal__position">{card.positionTitle}</span>
              <TarotCard face={toFace(card)} flipped delay={source.kind === 'review' ? 0 : 250 + i * FLIP_STAGGER_MS} />
              <span className="reveal__name" style={{ animationDelay: `${source.kind === 'review' ? 0 : 900 + i * FLIP_STAGGER_MS}ms` }}>
                {card.numeral} · {card.name}
              </span>
            </div>
          ))}
        </div>
      )}

      {flow.stage === 'interpreting' && <OracleLoading cards={flow.cards} />}

      {flow.stage === 'error' && flow.error && (
        <div className="altar__error" role="alert">
          <AlertTriangle size={20} />
          <p>{flow.error.message}</p>
          {flow.error.retryable ? (
            <button type="button" className="btn-pill btn-cream" onClick={() => dispatch({ type: 'RETRY' })}>
              <RotateCcw size={16} /> Tentar novamente
            </button>
          ) : (
            <button type="button" className="btn-pill btn-glass" onClick={onExit}>
              Voltar ao início
            </button>
          )}
        </div>
      )}

      {flow.stage === 'revealed' && flow.interpretation && flow.cards && (
        <>
          <InterpretationScroll interpretation={flow.interpretation} cards={flow.cards} userName={userName} />
          <ContinuationTeaser />
        </>
      )}
    </div>
  );
};
