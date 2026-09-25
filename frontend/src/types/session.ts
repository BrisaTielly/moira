export interface SessionData {
  sessionId: string;
  userName: string;
  question?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StartReadingRequest {
  sessionId: string;
  userName: string;
  question: string;
}

export interface StartReadingResponse {
  success: boolean;
  readingId: string;
  sessionId: string;
  userName: string;
  question: string;
  timestamp: string;
  message: string;
}
