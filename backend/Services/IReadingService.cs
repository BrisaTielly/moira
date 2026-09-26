using Moira.Backend.Models;

namespace Moira.Backend.Services;

public interface IReadingService
{
    Task<StartReadingResponseDto> StartReadingAsync(StartReadingRequestDto request);

    /// <summary>Revela as cartas das posições escolhidas na mesa. Idempotente: repetir não troca as cartas.</summary>
    DrawResponseDto Draw(string readingId, DrawRequestDto request);
}
