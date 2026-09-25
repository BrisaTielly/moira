import { useEffect, useRef, useState } from 'react';

interface InViewOptions {
  /** Mantém `true` depois da primeira aparição (padrão). */
  once?: boolean;
  rootMargin?: string;
  threshold?: number;
}

/** Observa quando um elemento entra na viewport. Sem IntersectionObserver, considera visível. */
export function useInView<T extends Element>({
  once = true,
  rootMargin = '0px 0px -12% 0px',
  threshold = 0.15,
}: InViewOptions = {}) {
  const ref = useRef<T | null>(null);
  // Sem IntersectionObserver (navegadores antigos/SSR), tudo aparece de imediato.
  const [inView, setInView] = useState(() => typeof IntersectionObserver === 'undefined');

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { rootMargin, threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [once, rootMargin, threshold]);

  return { ref, inView };
}
