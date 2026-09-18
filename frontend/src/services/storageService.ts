import type { SessionData } from '../types/session';

const STORAGE_KEY = 'moira_session';

function generateSessionId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `sess_${crypto.randomUUID()}`;
  }
  return `sess_${Math.random().toString(36).substring(2, 11)}_${Date.now().toString(36)}`;
}

export const storageService = {
  /**
   * Obtém a sessão armazenada no navegador
   */
  getSession(): SessionData | null {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return null;
      const parsed = JSON.parse(data) as SessionData;
      if (parsed && typeof parsed.userName === 'string' && parsed.userName.trim().length > 0) {
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  },

  /**
   * Cria ou atualiza a sessão com o nome do usuário
   */
  saveUserName(name: string): SessionData {
    const existing = this.getSession();
    const now = new Date().toISOString();
    const updated: SessionData = {
      sessionId: existing?.sessionId || generateSessionId(),
      userName: name.trim(),
      question: existing?.question,
      createdAt: existing?.createdAt || now,
      updatedAt: now,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  /**
   * Salva a pergunta do usuário na sessão existente
   */
  saveQuestion(question: string): SessionData {
    const existing = this.getSession();
    const now = new Date().toISOString();
    const updated: SessionData = {
      sessionId: existing?.sessionId || generateSessionId(),
      userName: existing?.userName || '',
      question: question.trim(),
      createdAt: existing?.createdAt || now,
      updatedAt: now,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  /**
   * Limpa a sessão local
   */
  clearSession(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // no-op
    }
  }
};
