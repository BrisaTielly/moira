using Moira.Backend.Models;
using Moira.Backend.Repositories;

namespace Moira.Backend.Services;

public class ReadingService(IReadingRepository readingRepository, DrawService drawService) : IReadingService
{
    public async Task<StartReadingResponseDto> StartReadingAsync(StartReadingRequestDto request)
    {
        if (string.IsNullOrWhiteSpace(request.UserName))
        {
            throw new ArgumentException("O nome do consulente é obrigatório.");
        }

        if (string.IsNullOrWhiteSpace(request.Question) || request.Question.Trim().Length < 5)
        {
            throw new ArgumentException("A pergunta deve conter ao menos 5 caracteres.");
        }

        var sessionId = string.IsNullOrWhiteSpace(request.SessionId)
            ? $"sess_{Guid.NewGuid():N}"
            : request.SessionId;

        var readingId = $"rdg_{Guid.NewGuid().ToString("N")[..10]}_{DateTimeOffset.UtcNow.ToUnixTimeSeconds()}";
        var timestamp = DateTime.UtcNow;

        var existingUser = await readingRepository.FindTemporaryUserAsync(sessionId);

        var temporaryUser = existingUser is null
            ? new TemporaryUser(
                SessionId: sessionId,
                UserName: request.UserName.Trim(),
                CreatedAt: timestamp)
            : existingUser with { UserName = request.UserName.Trim() };

        var availableCards = await readingRepository.GetAvailableCardsAsync();

        var selectedCardIds = availableCards
            .OrderBy(_ => Random.Shared.Next())
            .Select(card => card.Id)
            .Take(3)
            .ToArray();

        var draw = drawService.Create(availableCards, selectedCardIds);

        var reading = new Reading(
            ReadingId: readingId,
            SessionId: sessionId,
            Question: request.Question.Trim(),
            CreatedAt: timestamp,
            Cards: draw.Cards
        );

        await readingRepository.SaveReadingAsync(temporaryUser, reading);

        return new StartReadingResponseDto(
            Success: true,
            ReadingId: readingId,
            SessionId: sessionId,
            UserName: request.UserName.Trim(),
            Question: request.Question.Trim(),
            Timestamp: timestamp,
            Message: "Sua pergunta foi acolhida pelo santuário da Moira. As cartas estão prontas para a tiragem."
        );
    }

    public async Task<ReadingResponseDto?> GetReadingAsync(string readingId, string? sessionId)
    {
        if (string.IsNullOrWhiteSpace(readingId))
        {
            throw new ArgumentException("O identificador da leitura é obrigatório.");
        }

        if (string.IsNullOrWhiteSpace(sessionId))
        {
            throw new ArgumentException("A identidade temporária é obrigatória para recuperar a tiragem.");
        }

        var reading = await readingRepository.FindReadingAsync(readingId, sessionId);

        if (reading is null)
        {
            return null;
        }

        return new ReadingResponseDto(
            ReadingId: reading.ReadingId,
            SessionId: reading.SessionId,
            Question: reading.Question,
            CreatedAt: reading.CreatedAt,
            Cards: reading.Cards
                .Select(card => new DrawnCardResponseDto(
                    CardId: card.Card.Id,
                    Name: card.Card.Name,
                    Meaning: card.Card.Meaning,
                    Position: (int)card.Position,
                    Order: card.Order))
                .ToList()
        );
    }
}
