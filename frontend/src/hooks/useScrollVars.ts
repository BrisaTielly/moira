import { useEffect, type RefObject } from 'react';
import { pageProgress, sectionProgress } from '../lib/motion';

/**
 * Publica a rolagem como variáveis CSS no <html> (--sy em px sem unidade, --page-progress 0..1).
 * Um único listener com rAF alimenta parallax e a barra de progresso sem re-render do React.
 */
export function usePageScrollVars(): void {
  useEffect(() => {
    const root = document.documentElement;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      root.style.setProperty('--sy', String(Math.round(y)));
      root.style.setProperty(
        '--page-progress',
        pageProgress(y, root.scrollHeight, window.innerHeight).toFixed(4),
      );
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);
}

/** Escreve `--progress` (0..1) no próprio elemento conforme ele atravessa a viewport. */
export function useSectionProgressVar(ref: RefObject<HTMLElement | null>, anchor = 0.6): void {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      el.style.setProperty(
        '--progress',
        sectionProgress(rect.top, rect.height, window.innerHeight, anchor).toFixed(4),
      );
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [ref, anchor]);
}

