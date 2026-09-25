import type { StartReadingRequest, StartReadingResponse } from '../types/session';

export const readingService = {
  async submitQuestion(
    request: StartReadingRequest,
    simulateError: boolean = false
  ): Promise<StartReadingResponse> {
    // Simula a latência de processamento ritualístico
    await new Promise((resolve) => setTimeout(resolve, 750));

    if (simulateError) {
      throw new Error('Não foi possível conectar ao santuário agora. Verifique sua conexão e tente novamente.');
    }

    if (!request.userName || request.userName.trim().length === 0) {
      throw new Error('O nome é obrigatório para iniciar a leitura.');
    }

    if (!request.question || request.question.trim().length < 5) {
      throw new Error('Por favor, formule uma pergunta com ao menos 5 caracteres.');
    }

    const readingId = `rdg_${Math.random().toString(36).substring(2, 9)}_${Date.now().toString(36)}`;

    return {
      success: true,
      readingId,
      sessionId: request.sessionId,
      userName: request.userName.trim(),
      question: request.question.trim(),
      timestamp: new Date().toISOString(),
      message: 'Sua pergunta foi acolhida pela Moira. As cartas estão prontas para a tiragem.',
    };
  }
};
