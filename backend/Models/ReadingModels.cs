namespace Moira.Backend.Models;

public record StartReadingRequestDto(
    string SessionId,
    string UserName,
    string Question
);

public record StartReadingResponseDto(
    bool Success,
    string ReadingId,
    string SessionId,
    string UserName,
    string Question,
    DateTime Timestamp,
    string Message
);

public record DrawnCardResponseDto(
    string CardId,
    string Name,
    string Meaning,
    int Position,
    int Order
);

public record ReadingResponseDto(
    string ReadingId,
    string SessionId,
    string Question,
    DateTime CreatedAt,
    IReadOnlyList<DrawnCardResponseDto> Cards
);
