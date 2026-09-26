using System.Collections.Concurrent;

namespace Moira.Backend.Services.Readings;

/// <summary>Regra da degustação: uma leitura completa gratuita por sessão.</summary>
public interface IFreeReadingPolicy
{
    /// <summary>true se a sessão ainda pode receber a interpretação desta leitura.</summary>
    bool CanUse(string sessionId, string readingId);

    /// <summary>true se a sessão já consumiu a leitura gratuita com OUTRA leitura.</summary>
    bool HasUsedAnother(string sessionId, string readingId);

    void MarkUsed(string sessionId, string readingId);
}

/// <summary>
/// Controle em memória por sessionId. É contornável (limpar o navegador gera outra sessão);
/// o rate limit por IP reduz abuso até existir conta/identidade. Ver docs/DECISOES-E-PENDENCIAS.md.
/// </summary>
public sealed class InMemoryFreeReadingPolicy : IFreeReadingPolicy
{
    private readonly ConcurrentDictionary<string, string> _usedBySession = new();

    public bool CanUse(string sessionId, string readingId) =>
        !_usedBySession.TryGetValue(sessionId, out var used) || used == readingId;

    public bool HasUsedAnother(string sessionId, string readingId) => !CanUse(sessionId, readingId);

    public void MarkUsed(string sessionId, string readingId) =>
        _usedBySession.TryAdd(sessionId, readingId);
}
