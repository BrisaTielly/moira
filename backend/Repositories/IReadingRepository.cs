using Moira.Backend.Models;

namespace Moira.Backend.Repositories;

public interface IReadingRepository
{
    Task<IReadOnlyList<Card>> GetAvailableCardsAsync(CancellationToken cancellationToken = default);

    Task<TemporaryUser?> FindTemporaryUserAsync(string sessionId, CancellationToken cancellationToken = default);

    Task SaveReadingAsync(TemporaryUser temporaryUser, Reading reading, CancellationToken cancellationToken = default);

    Task<Reading?> FindReadingAsync(string readingId, string sessionId, CancellationToken cancellationToken = default);
}
