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
