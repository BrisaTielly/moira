/** Arcanos usados nas prévias da landing (placeholder até as ilustrações finais). */

export type ArcanaGlyph = 'star' | 'strength' | 'world' | 'moon' | 'sun' | 'sigil';

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

/** Glifo provisório por arcano; os demais usam o selo com o numeral até chegarem as ilustrações. */
const GLYPHS: Partial<Record<number, ArcanaGlyph>> = { 8: 'strength', 17: 'star', 18: 'moon', 19: 'sun', 21: 'world' };

export function glyphFor(number: number): ArcanaGlyph {
  return GLYPHS[number] ?? 'sigil';
}

export function toFace(card: { number: number; numeral: string; name: string }): ArcanaFace {
  return { numeral: card.numeral, name: card.name, glyph: glyphFor(card.number) };
}
