namespace Moira.Backend.Models;

// ---------- Pergunta ----------

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
    string Message,
    // "ready" (segue para o ritual) ou "support" (acolhimento, sem tarot).
    string Status,
    // Quantas cartas viradas para baixo a mesa mostra. O conteúdo delas fica no servidor.
    int TableSlots,
    int CardsToPick,
    SupportMessageDto? Support
);

// ---------- Escolha das cartas ----------

public record DrawRequestDto(string SessionId, int[] Picks);

public record DrawnCardDto(
    int Position,
    string PositionTitle,
    string PositionMeaning,
    int Number,
    string Numeral,
    string Name,
    IReadOnlyList<string> Keywords
);

public record DrawResponseDto(string ReadingId, IReadOnlyList<int> Picks, IReadOnlyList<DrawnCardDto> Cards);

// ---------- Interpretação ----------

public record InterpretationRequestDto(string SessionId);

public record CardReadingDto(int Position, string PositionTitle, string CardName, string Text);

public record InterpretationDto(
    string Opening,
    IReadOnlyList<CardReadingDto> Cards,
    string Synthesis,
    // Loop aberto: o que observar nos próximos dias (ancora a próxima sessão).
    string Invitation,
    // Nota de cuidado quando a pergunta toca saúde, questões jurídicas ou dinheiro.
    string? CareNote,
    string Disclaimer,
    // "model", "template" ou "fallback" (resposta segura após falha de validação).
    string Source
);

public record InterpretationResponseDto(
    string ReadingId,
    string Status,
    IReadOnlyList<DrawnCardDto> Cards,
    InterpretationDto? Interpretation,
    SupportMessageDto? Support
);

// ---------- Acolhimento / erros ----------

public record SupportResourceDto(string Name, string Contact, string Description);

public record SupportMessageDto(string Title, string Message, IReadOnlyList<SupportResourceDto> Resources);

public record ApiErrorDto(string Code, string Error, bool Retryable);
