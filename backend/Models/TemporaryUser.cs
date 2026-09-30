namespace Moira.Backend.Models;

public sealed record TemporaryUser(
    string SessionId,
    string UserName,
    DateTime CreatedAt
);
