import React, { useEffect, useState } from 'react';
import type { DrawnCard } from '../../types/reading';

/** Espera ritual enquanto a interpretação é tecida no servidor. */
export const OracleLoading: React.FC<{ cards: DrawnCard[] | null }> = ({ cards }) => {
  const phrases = [
    'A Moira está lendo as suas cartas…',
    ...(cards ?? []).map((c) => `Ouvindo o que ${c.name} diz sobre “${c.positionTitle.toLowerCase()}”…`),
    'Tecendo o fio entre as cartas e a sua pergunta…',
  ];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setIndex((i) => i + 1), 2600);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="oracle" role="status" aria-live="polite">
      <div className="oracle__orb" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <p key={index % phrases.length} className="oracle__phrase">
        {phrases[index % phrases.length]}
      </p>
    </div>
  );
};
