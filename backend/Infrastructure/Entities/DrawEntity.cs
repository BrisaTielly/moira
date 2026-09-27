namespace Moira.Backend.Infrastructure.Entities;

public sealed class DrawEntity
{
    public required string ReadingId { get; set; }

    public required string SessionId { get; set; }

    public required string Question { get; set; }

    public required DateTime CreatedAt { get; set; }

    public List<DrawnCardEntity> Cards { get; set; } = [];
}
