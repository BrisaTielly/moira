import { describe, expect, it, vi } from 'vitest';
import { ApiError, NETWORK_MESSAGE, TIMEOUT_MESSAGE, postJson } from '../apiClient';

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

describe('postJson', () => {
  it('envia JSON para /api e devolve o corpo', async () => {
    const fetchImpl = vi.fn(async () => json(200, { ok: true }));
    const result = await postJson<{ ok: boolean }>('/readings/question', { a: 1 }, { fetchImpl });

    expect(result.ok).toBe(true);
    const [url, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe('/api/readings/question');
    expect(init.method).toBe('POST');
    expect(init.body).toBe('{"a":1}');
  });

  it('traduz erro de domínio do backend (código, mensagem, repetível)', async () => {
    const fetchImpl = vi.fn(async () =>
      json(503, { code: 'interpretation_unavailable', error: 'Tente de novo.', retryable: true }));

    const err = await postJson('/x', {}, { fetchImpl }).catch((e: unknown) => e);
    expect(err).toBeInstanceOf(ApiError);
    expect(err).toMatchObject({ code: 'interpretation_unavailable', status: 503, retryable: true, message: 'Tente de novo.' });
  });

  it('402 da degustação não é repetível', async () => {
    const fetchImpl = vi.fn(async () => json(402, { code: 'free_reading_used', error: 'Já usada', retryable: false }));
    await expect(postJson('/x', {}, { fetchImpl })).rejects.toMatchObject({ code: 'free_reading_used', retryable: false });
  });

  it('falha de rede vira erro repetível com mensagem amigável', async () => {
    const fetchImpl = vi.fn(async () => {
      throw new TypeError('fetch failed');
    });
    await expect(postJson('/x', {}, { fetchImpl })).rejects.toMatchObject({ code: 'network', retryable: true, message: NETWORK_MESSAGE });
  });

  it('timeout aborta a requisição e é repetível', async () => {
    const fetchImpl = vi.fn((_url: string, init?: RequestInit) =>
      new Promise<Response>((_, reject) => {
        init?.signal?.addEventListener('abort', () => reject(new DOMException('aborted', 'AbortError')));
      }));
    await expect(postJson('/x', {}, { fetchImpl: fetchImpl as unknown as typeof fetch, timeoutMs: 10 }))
      .rejects.toMatchObject({ code: 'timeout', retryable: true, message: TIMEOUT_MESSAGE });
  });

  it('5xx sem corpo (backend desligado atrás do proxy) é repetível', async () => {
    const fetchImpl = vi.fn(async () => new Response('Bad Gateway', { status: 502 }));
    await expect(postJson('/x', {}, { fetchImpl })).rejects.toMatchObject({ code: 'http_502', retryable: true });
  });
});
