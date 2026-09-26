import type { SupportMessage } from './session';

export interface DrawnCard {
  position: number;
  positionTitle: string;
  positionMeaning: string;
  number: number;
  numeral: string;
  name: string;
  keywords: string[];
}

export interface DrawResponse {
  readingId: string;
  picks: number[];
  cards: DrawnCard[];
}

export interface CardReading {
  position: number;
  positionTitle: string;
  cardName: string;
  text: string;
}

export interface Interpretation {
  opening: string;
  cards: CardReading[];
  synthesis: string;
  invitation: string;
  careNote: string | null;
  disclaimer: string;
  source: 'model' | 'template' | 'fallback';
}

export interface InterpretationResponse {
  readingId: string;
  status: 'ready' | 'support';
  cards: DrawnCard[];
  interpretation: Interpretation | null;
  support: SupportMessage | null;
}
