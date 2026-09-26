import { ApiError, postJson } from './apiClient';
import type { StartReadingRequest, StartReadingResponse } from '../types/session';
import type { DrawResponse, InterpretationResponse } from '../types/reading';

export const readingService = {
  async submitQuestion(request: StartReadingRequest, simulateError = false): Promise<StartReadingResponse> {
    if (simulateError) {
      // Chave de teste manual (só aparece em desenvolvimento).
      throw new ApiError('network', 'Não foi possível conectar ao santuário agora. Verifique sua conexão e tente novamente.', 0, true);
    }
    return postJson<StartReadingResponse>('/readings/question', request);
  },

  /** O servidor sorteia; aqui só enviamos QUAIS posições da mesa foram tocadas. */
  drawCards(readingId: string, sessionId: string, picks: number[]): Promise<DrawResponse> {
    return postJson<DrawResponse>(`/readings/${encodeURIComponent(readingId)}/draw`, { sessionId, picks });
  },

  getInterpretation(readingId: string, sessionId: string): Promise<InterpretationResponse> {
    return postJson<InterpretationResponse>(`/readings/${encodeURIComponent(readingId)}/interpretation`, { sessionId });
  },
};
