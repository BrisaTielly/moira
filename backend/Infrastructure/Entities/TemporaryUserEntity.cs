namespace Moira.Backend.Infrastructure.Entities;

public sealed class TemporaryUserEntity
{
    public required string SessionId { get; set; }

    public required string UserName { get; set; }

    public required DateTime CreatedAt { get; set; }
}
