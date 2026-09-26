import React from 'react';

interface InkTextProps {
  text: string;
  /** Atraso inicial (ms) para encadear seções. */
  delay?: number;
  /** Intervalo entre palavras (ms). */
  step?: number;
  as?: 'p' | 'div';
  className?: string;
}

/** Texto que "surge como tinta", palavra por palavra. Com movimento reduzido, aparece inteiro. */
export const InkText: React.FC<InkTextProps> = ({ text, delay = 0, step = 22, as = 'p', className = '' }) => {
  const words = text.split(/(\s+)/);
  let index = 0;
  const content = words.map((word, i) => {
    if (/^\s+$/.test(word)) return word;
    const d = delay + index++ * step;
    return (
      <span key={i} className="ink-word" style={{ animationDelay: `${d}ms` }}>
        {word}
      </span>
    );
  });
  const Tag = as;
  return <Tag className={`ink ${className}`}>{content}</Tag>;
};
