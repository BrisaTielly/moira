import React from 'react';
import { ArrowRight } from 'lucide-react';
import { CardBack } from '../tarot/TarotCard';

interface RitualTableProps {
  slots: number;
  picks: number[];
  cardsToPick: number;
  notice: string | null;
  onToggle: (slot: number) => void;
  onConfirm: () => void;
}

/** A mesa: cartas viradas para baixo. O que há em cada uma só o servidor sabe. */
export const RitualTable: React.FC<RitualTableProps> = ({ slots, picks, cardsToPick, notice, onToggle, onConfirm }) => {
  const complete = picks.length === cardsToPick;
  return (
    <div className="altar__stage">
      <div className="altar__intro">
        <h2 className="altar__title">Escolha {cardsToPick} cartas para a sua leitura</h2>
        <p className="altar__lead">Concentre-se na sua pergunta e escolha, com o coração, as cartas que mais te chamam.</p>
      </div>

      <div className="table" role="group" aria-label="Cartas na mesa">
        {Array.from({ length: slots }, (_, slot) => {
          const order = picks.indexOf(slot);
          const selected = order >= 0;
          return (
            <button
              key={slot}
              type="button"
              className={`table__card${selected ? ' is-selected' : ''}`}
              style={{ ['--i' as string]: slot }}
              aria-pressed={selected}
              aria-label={selected ? `Carta ${slot + 1}, escolhida em ${order + 1}º lugar` : `Carta ${slot + 1}`}
              onClick={() => onToggle(slot)}
            >
              <CardBack />
              {selected && <span className="table__badge">{order + 1}</span>}
            </button>
          );
        })}
      </div>

      <div className="altar__footer">
        <div>
          <strong className="altar__count">
            {picks.length} de {cardsToPick} cartas escolhidas
          </strong>
          <span className="altar__hint" aria-live="polite">
            {notice ?? 'Toque novamente para desfazer.'}
          </span>
        </div>
        <button type="button" className="btn-pill btn-cream btn-lg" disabled={!complete} onClick={onConfirm}>
          Revelar minhas cartas <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};
