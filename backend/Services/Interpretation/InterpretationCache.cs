using System.Collections.Concurrent;
using Moira.Backend.Models;

namespace Moira.Backend.Services.Interpretation;

/// <summary>
/// Uma interpretação por leitura ("single flight"): chamadas repetidas ou simultâneas compartilham
/// o mesmo resultado, então "Tentar novamente" nunca gera outra leitura nem gasta outra chamada ao modelo.
/// Falhas são descartadas para permitir uma nova tentativa limpa.
/// </summary>
public sealed class InterpretationCache
{
    private readonly ConcurrentDictionary<string, Lazy<Task<InterpretationDto>>> _entries = new();

    public async Task<InterpretationDto> GetOrCreateAsync(string readingId, Func<Task<InterpretationDto>> factory)
    {
        var entry = _entries.GetOrAdd(readingId, _ => new Lazy<Task<InterpretationDto>>(factory));
        try
        {
            return await entry.Value;
        }
        catch
        {
            _entries.TryRemove(new KeyValuePair<string, Lazy<Task<InterpretationDto>>>(readingId, entry));
            throw;
        }
    }
}
