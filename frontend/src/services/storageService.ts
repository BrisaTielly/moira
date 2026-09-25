import type { SessionData } from '../types/session';

const STORAGE_KEY = 'moira_session';

function generateSessionId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `sess_${crypto.randomUUID()}`;
  }
  return `sess_${Math.random().toString(36).substring(2, 10)}_${Date.now().toString(36)}`;
}

export const storageService = {
  getSession(): SessionData | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as SessionData;
      if (parsed && typeof parsed.userName === 'string' && parsed.userName.trim().length > 0) {
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  },

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

  clearSession(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // no-op
    }
  }
};
