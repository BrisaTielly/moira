import type { StartReadingRequest, StartReadingResponse } from '../types/session';

export const readingService = {
  /**
   * Envia a pergunta do consulente para o contrato mockado de início de leitura.
   * Simula a latência ritualística de rede e validação.
   */
  async submitQuestion(
    request: StartReadingRequest,
    simulateError: boolean = false
  ): Promise<StartReadingResponse> {
    // Simula a latência de comunicação / preparação da leitura
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (simulateError) {
      throw new Error('Não foi possível conectar ao santuário agora. Verifique sua conexão e tente novamente.');
    }

    if (!request.userName || request.userName.trim().length === 0) {
      throw new Error('O nome é obrigatório para iniciar a leitura.');
    }

    if (!request.question || request.question.trim().length < 5) {
      throw new Error('Por favor, formule uma pergunta com ao menos 5 caracteres.');
    }

    const readingId = `rdg_${Math.random().toString(36).substring(2, 10)}_${Date.now().toString(36)}`;

    return {
      success: true,
      readingId,
      sessionId: request.sessionId,
      userName: request.userName.trim(),
      question: request.question.trim(),
      timestamp: new Date().toISOString(),
      message: 'Sua pergunta foi acolhida pelo portal da Moira. As cartas estão prontas para serem reveladas.',
    };
  }
};
