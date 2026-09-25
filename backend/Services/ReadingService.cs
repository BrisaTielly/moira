using Moira.Backend.Models;

namespace Moira.Backend.Services;

public class ReadingService : IReadingService
{
    public Task<StartReadingResponseDto> StartReadingAsync(StartReadingRequestDto request)
    {
        if (string.IsNullOrWhiteSpace(request.UserName))
        {
            throw new ArgumentException("O nome do consulente é obrigatório.");
        }

        if (string.IsNullOrWhiteSpace(request.Question) || request.Question.Trim().Length < 5)
        {
            throw new ArgumentException("A pergunta deve conter ao menos 5 caracteres.");
        }

        var readingId = $"rdg_{Guid.NewGuid():N[..10]}_{DateTimeOffset.UtcNow.ToUnixTimeSeconds()}";

        var response = new StartReadingResponseDto(
            Success: true,
            ReadingId: readingId,
            SessionId: string.IsNullOrWhiteSpace(request.SessionId) ? $"sess_{Guid.NewGuid():N}" : request.SessionId,
            UserName: request.UserName.Trim(),
            Question: request.Question.Trim(),
            Timestamp: DateTime.UtcNow,
            Message: "Sua pergunta foi acolhida pelo santuário da Moira. As cartas estão prontas para a tiragem."
        );

        return Task.FromResult(response);
    }
}
