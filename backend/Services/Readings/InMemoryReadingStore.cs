using System.Collections.Concurrent;

namespace Moira.Backend.Services.Readings;

/// <summary>
/// Armazenamento em memória (sem banco nesta fase). Perde tudo ao reiniciar o processo
/// e não funciona com mais de uma instância. Ver docs/DECISOES-E-PENDENCIAS.md.
/// </summary>
public sealed class InMemoryReadingStore(TimeProvider clock) : IReadingStore
{
    public static readonly TimeSpan Ttl = TimeSpan.FromHours(24);
    private readonly ConcurrentDictionary<string, ReadingRecord> _records = new();

    public void Add(ReadingRecord record)
    {
        PruneExpired();
        _records[record.ReadingId] = record;
    }

    public ReadingRecord? Find(string readingId, string sessionId)
    {
        if (string.IsNullOrWhiteSpace(readingId) || string.IsNullOrWhiteSpace(sessionId)) return null;
        if (!_records.TryGetValue(readingId, out var record)) return null;
        if (clock.GetUtcNow() - record.CreatedAt > Ttl) return null;
        // Sessão diferente responde como "não encontrada" para não revelar que a leitura existe.
        return string.Equals(record.SessionId, sessionId, StringComparison.Ordinal) ? record : null;
    }

    private void PruneExpired()
    {
        var now = clock.GetUtcNow();
        foreach (var (id, record) in _records)
        {
            if (now - record.CreatedAt > Ttl) _records.TryRemove(id, out _);
        }
    }
}
