/**
 * Calcula quando cada seção da leitura começa a "surgir como tinta",
 * para que abertura → cartas → síntese → convite apareçam em sequência.
 */
export interface InkSection {
  text: string;
  /** Pausa extra depois da seção (ms). */
  gap?: number;
}

export const WORD_STEP_MS = 22;

export function inkSchedule(sections: InkSection[], start = 300, step = WORD_STEP_MS): number[] {
  const delays: number[] = [];
  let cursor = start;
  for (const section of sections) {
    delays.push(cursor);
    const words = section.text.trim() ? section.text.trim().split(/\s+/).length : 0;
    cursor += words * step + (section.gap ?? 500);
  }
  delays.push(cursor); // fim: quando o restante (avisos) pode aparecer
  return delays;
}
