/**
 * Cliente HTTP mínimo para o backend da Moira.
 * Em desenvolvimento, o Vite encaminha /api para o .NET (ver vite.config.ts), então
 * nenhuma chave, prompt ou URL de provedor de IA existe no código do navegador.
 */

export const API_BASE = (import.meta.env.VITE_API_BASE as string | undefined) ?? '/api';
export const DEFAULT_TIMEOUT_MS = 45_000;

export class ApiError extends Error {
  readonly code: string;
  readonly status: number;
  readonly retryable: boolean;

  constructor(code: string, message: string, status: number, retryable: boolean) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.retryable = retryable;
  }
}

export const NETWORK_MESSAGE =
  'Não conseguimos falar com a Moira agora. Verifique sua conexão e tente novamente.';
export const TIMEOUT_MESSAGE =
  'A leitura está demorando mais que o normal. Suas cartas estão guardadas; tente novamente.';

interface ErrorBody {
  code?: string;
  error?: string;
  retryable?: boolean;
}

export async function postJson<T>(
  path: string,
  body: unknown,
  { timeoutMs = DEFAULT_TIMEOUT_MS, fetchImpl = fetch }: { timeoutMs?: number; fetchImpl?: typeof fetch } = {},
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  let response: Response;
  try {
    response = await fetchImpl(`${API_BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (err) {
    const aborted = err instanceof DOMException && err.name === 'AbortError';
    throw new ApiError(aborted ? 'timeout' : 'network', aborted ? TIMEOUT_MESSAGE : NETWORK_MESSAGE, 0, true);
  } finally {
    clearTimeout(timer);
  }

  if (response.ok) {
    try {
      return (await response.json()) as T;
    } catch {
      throw new ApiError('invalid_response', NETWORK_MESSAGE, response.status, true);
    }
  }

  let data: ErrorBody = {};
  try {
    data = (await response.json()) as ErrorBody;
  } catch {
    // corpo vazio ou não-JSON (ex.: proxy sem backend rodando)
  }

  const retryable = data.retryable ?? (response.status >= 500 || response.status === 429);
  throw new ApiError(
    data.code ?? `http_${response.status}`,
    data.error ?? (response.status >= 500 ? NETWORK_MESSAGE : 'Algo não saiu como esperado. Tente novamente.'),
    response.status,
    retryable,
  );
}
