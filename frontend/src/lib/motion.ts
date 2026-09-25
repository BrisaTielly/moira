/**
 * Utilitários puros de movimento/rolagem.
 * Sem acesso a DOM aqui — os hooks de UI apenas repassam medidas para estas funções,
 * o que as mantém testáveis e previsíveis.
 */

export function clamp(value: number, min = 0, max = 1): number {
  if (Number.isNaN(value)) return min;
  return Math.min(max, Math.max(min, value));
}

/**
 * Progresso (0..1) de uma seção em relação a uma "linha de leitura" na viewport.
 * 0 = o topo da seção ainda não cruzou a linha; 1 = a seção inteira já passou por ela.
 * `anchor` é a posição da linha (0 = topo da tela, 1 = rodapé da tela).
 */
export function sectionProgress(
  top: number,
  height: number,
  viewportHeight: number,
  anchor = 0.6,
): number {
  if (!(height > 0) || !(viewportHeight > 0) || !Number.isFinite(top)) return 0;
  const line = viewportHeight * clamp(anchor);
  return clamp((line - top) / height);
}

/** Progresso (0..1) de rolagem da página inteira. */
export function pageProgress(scrollY: number, scrollHeight: number, viewportHeight: number): number {
  const scrollable = scrollHeight - viewportHeight;
  if (!(scrollable > 0) || !Number.isFinite(scrollY)) return 0;
  return clamp(scrollY / scrollable);
}

/** Atraso escalonado (ms) para entradas em cascata, com teto para listas longas. */
export function staggerDelay(index: number, step = 90, base = 0, max = 900): number {
  if (!Number.isFinite(index) || index < 0) return base;
  return Math.min(base + Math.floor(index) * step, Math.max(base, max));
}
