using Moira.Backend.Domain;
using Moira.Backend.Services.Safety;

namespace Moira.Backend.Services.Readings;

/// <summary>Estado de uma leitura mantido SOMENTE no servidor (a mesa sorteada nunca vai ao cliente).</summary>
public sealed class ReadingRecord
{
    public required string ReadingId { get; init; }
    public required string SessionId { get; init; }
    public required string UserName { get; init; }
    public required string Question { get; init; }
    public required DateTimeOffset CreatedAt { get; init; }
    public required SafetyAssessment Safety { get; init; }

    /// <summary>Números dos arcanos virados para baixo na mesa, na ordem das posições visíveis.</summary>
    public required IReadOnlyList<int> Table { get; init; }

    /// <summary>Cartas escolhidas (null até a consulente escolher).</summary>
    public IReadOnlyList<DrawnCard>? Drawn { get; set; }

    /// <summary>Posições da mesa escolhidas pela consulente, na ordem das posições da tiragem.</summary>
    public IReadOnlyList<int>? Picks { get; set; }

    /// <summary>Trava para operações que alteram o registro.</summary>
    public object Sync { get; } = new();
}
