import React, { useEffect, useReducer } from 'react';
import { ArrowDown, RotateCcw, Scissors, Shuffle } from 'lucide-react';
import { CardBack } from '../tarot/TarotCard';
import { initialRitualState, ritualHint, ritualReducer } from '../../lib/ritualPreview';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const DECK_SIZE = 6;
const SHUFFLE_MS = 1150;
const CUT_MS = 800;

/**
 * Prévia interativa do ritual (efeito IKEA): a visitante embaralha e corta o baralho.
 * A lógica de estados vive em `ritualReducer`; aqui só agendamos o fim das animações.
 */
export const RitualDeck: React.FC = () => {
  const [state, dispatch] = useReducer(ritualReducer, initialRitualState);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (state.phase === 'shuffling') {
      const id = window.setTimeout(() => dispatch({ type: 'SHUFFLE_DONE' }), reduced ? 0 : SHUFFLE_MS);
      return () => window.clearTimeout(id);
    }
    if (state.phase === 'cutting') {
      const id = window.setTimeout(() => dispatch({ type: 'CUT_DONE' }), reduced ? 0 : CUT_MS);
      return () => window.clearTimeout(id);
    }
  }, [state.phase, state.shuffles, reduced]);

  const busy = state.phase === 'shuffling' || state.phase === 'cutting';
  const half = Math.floor(DECK_SIZE / 2);

  return (
    <div className="viz">
      <div className={`deck deck--${state.phase}`} aria-hidden="true">
        {Array.from({ length: DECK_SIZE }, (_, i) => (
          <div
            key={`${state.shuffles}-${i}`}
            className={`deck__card ${i >= half ? 'deck__card--top' : 'deck__card--bottom'}`}
            style={{ ['--i' as string]: i, ['--dir' as string]: i % 2 ? 1 : -1, zIndex: i }}
          >
            <CardBack />
          </div>
        ))}
      </div>

      <div className="deck__controls">
        <p className="deck__hint" aria-live="polite">
          {ritualHint(state.phase)}
        </p>

        {state.error && (
          <p className="deck__error" role="alert">
            {state.error}
          </p>
        )}

        <div className="deck__buttons">
          {state.phase === 'ready' ? (
            <>
              <button type="button" className="btn-pill btn-outline" onClick={() => dispatch({ type: 'RESET' })}>
                <RotateCcw size={15} /> Recomeçar
              </button>
              <a href="#revelacao" className="btn-pill btn-plum">
                Ver a revelação <ArrowDown size={15} />
              </a>
            </>
          ) : (
            <>
              <button
                type="button"
                className="btn-pill btn-outline"
                onClick={() => dispatch({ type: 'SHUFFLE' })}
                disabled={busy}
              >
                <Shuffle size={15} /> {state.shuffles > 0 ? 'Embaralhar de novo' : 'Embaralhar'}
              </button>
              <button
                type="button"
                className="btn-pill btn-plum"
                onClick={() => dispatch({ type: 'CUT' })}
                disabled={busy}
              >
                <Scissors size={15} /> Cortar
              </button>
            </>
          )}
        </div>

        {state.shuffles > 0 && (
          <span className="deck__count">
            Embaralhado {state.shuffles}× com a sua intenção
          </span>
        )}
      </div>
    </div>
  );
};
