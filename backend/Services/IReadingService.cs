using Moira.Backend.Models;

namespace Moira.Backend.Services;

public interface IReadingService
{
    Task<StartReadingResponseDto> StartReadingAsync(StartReadingRequestDto request);

    Task<ReadingResponseDto?> GetReadingAsync(string readingId, string? sessionId);
}
