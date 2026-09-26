import React, { useState } from 'react';
import { HeartHandshake, MoonStar } from 'lucide-react';
import { InkText } from './InkText';
import { TarotCard } from '../tarot/TarotCard';
import { toFace } from '../../lib/arcana';
import { inkSchedule } from '../../lib/inkSchedule';
import type { DrawnCard, Interpretation } from '../../types/reading';

interface InterpretationScrollProps {
  interpretation: Interpretation;
  cards: DrawnCard[];
  userName?: string;
}

/** A leitura revelada: página de grimório, não balão de chat. */
export const InterpretationScroll: React.FC<InterpretationScrollProps> = ({ interpretation, cards, userName }) => {
  const [instant, setInstant] = useState(false);
  const schedule = inkSchedule([
    { text: interpretation.opening },
    ...interpretation.cards.map((c) => ({ text: c.text, gap: 700 })),
    { text: interpretation.synthesis, gap: 700 },
    { text: interpretation.invitation, gap: 400 },
  ]);
  const cardCount = interpretation.cards.length;
  const synthesisAt = schedule[1 + cardCount];
  const inviteAt = schedule[2 + cardCount];
  const endAt = schedule[3 + cardCount];

  return (
    <article className={`scroll${instant ? ' is-instant' : ''}`} aria-labelledby="scroll-title">
      <header className="scroll__head">
        <span className="scroll__eyebrow">✦ Leitura de {userName ? userName.split(' ')[0] : 'hoje'}</span>
        <h2 id="scroll-title" className="scroll__title">
          O que as cartas trazem para você
        </h2>
        {!instant && (
          <button type="button" className="scroll__skip" onClick={() => setInstant(true)}>
            Mostrar tudo
          </button>
        )}
      </header>

      <InkText className="scroll__opening" text={interpretation.opening} delay={schedule[0]} />

      {interpretation.cards.map((reading, i) => {
        const card = cards.find((c) => c.position === reading.position);
        const d = schedule[1 + i];
        return (
          <section key={reading.position} className="scroll__card" style={{ animationDelay: `${d - 250}ms` }}>
            {card && <TarotCard face={toFace(card)} flipped className="scroll__mini" />}
            <div>
              <span className="scroll__position">{reading.positionTitle}</span>
              <h3 className="scroll__card-name">{reading.cardName}</h3>
              <InkText text={reading.text} delay={d} />
            </div>
          </section>
        );
      })}

      <section className="scroll__synthesis">
        <span className="scroll__position">Síntese</span>
        <InkText text={interpretation.synthesis} delay={synthesisAt} />
      </section>

      {interpretation.careNote && (
        <p className="scroll__care" style={{ animationDelay: `${inviteAt - 300}ms` }}>
          <HeartHandshake size={16} /> {interpretation.careNote}
        </p>
      )}

      <section className="scroll__invite" style={{ animationDelay: `${inviteAt - 250}ms` }}>
        <span className="scroll__invite-icon" aria-hidden="true">
          <MoonStar size={18} />
        </span>
        <div>
          <span className="scroll__position">Para os próximos 7 dias</span>
          <InkText text={interpretation.invitation} delay={inviteAt} />
        </div>
      </section>

      <p className="scroll__disclaimer" style={{ animationDelay: `${endAt}ms` }}>
        {interpretation.disclaimer}
      </p>
    </article>
  );
};
