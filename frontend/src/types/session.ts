export interface SessionData {
  sessionId: string;
  userName: string;
  question?: string;
  /** Última leitura revelada nesta sessão (para "Rever minha leitura"). */
  lastReadingId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StartReadingRequest {
  sessionId: string;
  userName: string;
  question: string;
}

export interface SupportResource {
  name: string;
  contact: string;
  description: string;
}

export interface SupportMessage {
  title: string;
  message: string;
  resources: SupportResource[];
}

export interface StartReadingResponse {
  success: boolean;
  readingId: string;
  sessionId: string;
  userName: string;
  question: string;
  timestamp: string;
  message: string;
  /** "ready" segue para o ritual; "support" mostra acolhimento (sem tarot). */
  status: 'ready' | 'support';
  /** Quantas cartas viradas para baixo aparecem na mesa (o conteúdo fica no servidor). */
  tableSlots: number;
  cardsToPick: number;
  support: SupportMessage | null;
}
