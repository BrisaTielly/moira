/**
 * Roteiro da prévia de conversa do Hero.
 * A prévia "acontece" diante da visitante: a Moira digita, as cartas se revelam uma a uma
 * e a síntese fecha com um convite para continuar (loop aberto / Zeigarnik).
 */

export type HeroStep =
  | 'greeting'
  | 'question'
  | 'intro'
  | 'card1'
  | 'card2'
  | 'card3'
  | 'synthesis';

export interface HeroBeat {
  step: HeroStep;
  /** Momento (ms) em que o passo aparece, contado a partir do início da prévia. */
  at: number;
  /** Mensagens da Moira mostram "digitando…" antes de aparecer. */
  fromMoira: boolean;
}

export const TYPING_LEAD_MS = 700;

export const HERO_TIMELINE: readonly HeroBeat[] = [
  { step: 'greeting', at: 700, fromMoira: true },
  { step: 'question', at: 1900, fromMoira: false },
  { step: 'intro', at: 3300, fromMoira: true },
  { step: 'card1', at: 3900, fromMoira: false },
  { step: 'card2', at: 4350, fromMoira: false },
  { step: 'card3', at: 4800, fromMoira: false },
  { step: 'synthesis', at: 6300, fromMoira: true },
];

/** Duração total do roteiro (último passo). */
export function timelineDuration(timeline: readonly HeroBeat[] = HERO_TIMELINE): number {
  return timeline.reduce((max, beat) => Math.max(max, beat.at), 0);
}

/** Passos visíveis após `elapsed` ms. Valores inválidos não mostram nada. */
export function visibleSteps(
  elapsed: number,
  timeline: readonly HeroBeat[] = HERO_TIMELINE,
): Set<HeroStep> {
  const visible = new Set<HeroStep>();
  if (Number.isNaN(elapsed)) return visible;
  for (const beat of timeline) {
    if (elapsed >= beat.at) visible.add(beat.step);
  }
  return visible;
}

/** A Moira está "digitando" logo antes de cada mensagem dela. */
export function isTypingAt(
  elapsed: number,
  timeline: readonly HeroBeat[] = HERO_TIMELINE,
  lead = TYPING_LEAD_MS,
): boolean {
  if (!Number.isFinite(elapsed)) return false;
  return timeline.some(
    (beat) => beat.fromMoira && elapsed >= beat.at - lead && elapsed < beat.at,
  );
}
