import { useEffect, useState } from 'react';

/**
 * Relógio simples (ms) que começa quando `active` vira true e para após `duration`.
 * Com `skip` (ex.: movimento reduzido) salta direto para o fim.
 */
export function useElapsed(active: boolean, duration: number, skip = false): number {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!active || skip) return;
    const start = performance.now();
    const id = window.setInterval(() => {
      const now = performance.now() - start;
      setElapsed(now);
      if (now > duration + 200) window.clearInterval(id);
    }, 100);
    return () => window.clearInterval(id);
  }, [active, duration, skip]);

  if (active && skip) return Number.POSITIVE_INFINITY;
  return elapsed;
}
