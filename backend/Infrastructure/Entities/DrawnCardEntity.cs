using Moira.Backend.Models;

namespace Moira.Backend.Infrastructure.Entities;

public sealed class DrawnCardEntity
{
    public required string ReadingId { get; set; }

    public required string CardId { get; set; }

    public CardEntity Card { get; set; } = null!;

    public required DrawPosition Position { get; set; }

    public required int Order { get; set; }
}
