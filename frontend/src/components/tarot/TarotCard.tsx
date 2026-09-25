import React from 'react';
import type { ArcanaFace, ArcanaGlyph } from '../../lib/arcana';

/** Traços simples de linha (placeholder até as ilustrações finais do baralho). */
const Glyph: React.FC<{ type: ArcanaGlyph }> = ({ type }) => {
  const common = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.4,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  switch (type) {
    case 'star':
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <path {...common} d="M24 6l3.6 12.4L40 22l-12.4 3.6L24 38l-3.6-12.4L8 22l12.4-3.6z" />
          <circle cx="11" cy="10" r="1.2" fill="currentColor" />
          <circle cx="38" cy="36" r="1.2" fill="currentColor" />
          <circle cx="37" cy="9" r="0.9" fill="currentColor" />
          <path {...common} d="M10 42c5-3 9-3 14 0s9 3 14 0" />
        </svg>
      );
    case 'strength':
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <path {...common} d="M24 12c-2.5-2.6-4.4-3.6-6.4-3.6a3.6 3.6 0 0 0 0 7.2c2 0 3.9-1 6.4-3.6s4.4-3.6 6.4-3.6a3.6 3.6 0 0 1 0 7.2c-2 0-3.9-1-6.4-3.6z" />
          <circle {...common} cx="24" cy="30" r="9" />
          <path {...common} d="M20 29c1 1 2 1.5 4 1.5s3-.5 4-1.5M21 26h.01M27 26h.01" />
          <path {...common} d="M15 30c-3-1-4-4-3-7M33 30c3-1 4-4 3-7M18 38c-2 2-2 4-1 5M30 38c2 2 2 4 1 5" />
        </svg>
      );
    case 'world':
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <ellipse {...common} cx="24" cy="24" rx="12" ry="17" />
          <path {...common} d="M24 15c-2 3-2 6 0 8s2 6 0 10M20 22l8 3" />
          <circle cx="8" cy="8" r="1.5" fill="currentColor" />
          <circle cx="40" cy="8" r="1.5" fill="currentColor" />
          <circle cx="8" cy="40" r="1.5" fill="currentColor" />
          <circle cx="40" cy="40" r="1.5" fill="currentColor" />
        </svg>
      );
    case 'moon':
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <path {...common} d="M30 10a14 14 0 1 0 0 28a11 11 0 0 1 0-28z" />
        </svg>
      );
    case 'sun':
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <circle {...common} cx="24" cy="24" r="8" />
          <path
            {...common}
            d="M24 6v6M24 36v6M6 24h6M36 24h6M11 11l4 4M33 33l4 4M11 37l4-4M33 15l4-4"
          />
        </svg>
      );
  }
};

/** Verso do baralho Moira: lua ao centro de um sol de raios finos. */
export const CardBack: React.FC = () => (
  <div className="tc-back" aria-hidden="true">
    <svg viewBox="0 0 100 160" preserveAspectRatio="xMidYMid meet">
      <rect x="6" y="6" width="88" height="148" rx="5" className="tc-back__frame" />
      <rect x="10" y="10" width="80" height="140" rx="3" className="tc-back__frame tc-back__frame--thin" />
      <g className="tc-back__rays">
        {Array.from({ length: 24 }, (_, i) => (
          <line
            key={i}
            x1="50"
            y1="80"
            x2={50 + Math.cos((i * Math.PI) / 12) * (i % 2 ? 22 : 32)}
            y2={80 + Math.sin((i * Math.PI) / 12) * (i % 2 ? 22 : 32)}
          />
        ))}
      </g>
      <circle cx="50" cy="80" r="12" className="tc-back__disc" />
      <path d="M54 71a10 10 0 1 0 0 18a8 8 0 0 1 0-18z" className="tc-back__moon" />
    </svg>
  </div>
);

export const CardFace: React.FC<{ face: ArcanaFace }> = ({ face }) => (
  <div className="tc-face">
    <span className="tc-face__numeral">{face.numeral}</span>
    <div className="tc-face__art">
      <Glyph type={face.glyph} />
    </div>
    <span className="tc-face__name">{face.name}</span>
  </div>
);

interface TarotCardProps {
  face: ArcanaFace;
  flipped: boolean;
  /** Atraso (ms) do giro — usado para revelar em sequência. */
  delay?: number;
  className?: string;
}

/** Carta com giro 3D entre verso e face. */
export const TarotCard: React.FC<TarotCardProps> = ({ face, flipped, delay = 0, className = '' }) => (
  <div
    className={`tc${flipped ? ' is-flipped' : ''}${className ? ` ${className}` : ''}`}
    style={{ ['--flip-delay' as string]: `${delay}ms` }}
    aria-label={flipped ? `${face.numeral} · ${face.name}` : 'Carta virada para baixo'}
    role="img"
  >
    <div className="tc__inner">
      <div className="tc__side tc__side--back">
        <CardBack />
      </div>
      <div className="tc__side tc__side--front">
        <CardFace face={face} />
      </div>
    </div>
  </div>
);
