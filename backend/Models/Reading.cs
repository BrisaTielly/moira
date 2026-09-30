namespace Moira.Backend.Models;

public sealed record Reading(
    string ReadingId,
    string SessionId,
    string Question,
    DateTime CreatedAt,
    IReadOnlyList<DrawnCard> Cards
);
