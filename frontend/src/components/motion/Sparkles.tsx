import React from 'react';

export interface SparkleSpec {
  top: string;
  left: string;
  size: number;
  /** atraso do brilho, em segundos */
  d: number;
}

const DEFAULT_SPARKLES: SparkleSpec[] = [
  { top: '14%', left: '46%', size: 12, d: 0 },
  { top: '72%', left: '6%', size: 10, d: 1.2 },
  { top: '8%', left: '92%', size: 14, d: 2.1 },
  { top: '86%', left: '58%', size: 9, d: 0.6 },
  { top: '40%', left: '2%', size: 8, d: 2.8 },
];

export const Sparkles4: React.FC<{ items?: SparkleSpec[] }> = ({ items = DEFAULT_SPARKLES }) => (
  <div className="sparkles" aria-hidden="true">
    {items.map((s, i) => (
      <i key={i} style={{ top: s.top, left: s.left, fontSize: s.size, ['--d' as string]: s.d }}>
        ✦
      </i>
    ))}
  </div>
);

