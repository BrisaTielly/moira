/** Arcanos usados nas prévias da landing (placeholder até as ilustrações finais). */

export type ArcanaGlyph = 'star' | 'strength' | 'world' | 'moon' | 'sun';

export interface ArcanaFace {
  numeral: string;
  name: string;
  glyph: ArcanaGlyph;
}

export const SAMPLE_SPREAD: ArcanaFace[] = [
  { numeral: 'XVII', name: 'A Estrela', glyph: 'star' },
  { numeral: 'VIII', name: 'A Força', glyph: 'strength' },
  { numeral: 'XXI', name: 'O Mundo', glyph: 'world' },
];
