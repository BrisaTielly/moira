import React from 'react';
import { useInView } from '../../hooks/useInView';

type RevealVariant = 'up' | 'left' | 'right' | 'scale' | 'fade';

interface RevealProps {
  children: React.ReactNode;
  /** Atraso em ms antes da entrada. */
  delay?: number;
  variant?: RevealVariant;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
}

/** Entrada suave (fade + blur + deslocamento) quando o bloco aparece na rolagem. */
export const Reveal: React.FC<RevealProps> = ({
  children,
  delay = 0,
  variant = 'up',
  className = '',
  style,
  id,
}) => {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      id={id}
      className={`rv rv--${variant}${inView ? ' is-in' : ''}${className ? ` ${className}` : ''}`}
      style={{ ...style, ['--rv-delay' as string]: `${delay}ms` }}
    >
      {children}
    </div>
  );
};
