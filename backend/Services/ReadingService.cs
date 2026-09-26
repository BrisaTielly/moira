using Moira.Backend.Domain;
using Moira.Backend.Models;
using Moira.Backend.Services.Readings;
using Moira.Backend.Services.Safety;

namespace Moira.Backend.Services;

public class ReadingService(
    IReadingStore store,
    IDeckShuffler shuffler,
    ISafetyScreener screener,
    IFreeReadingPolicy freePolicy,
    TimeProvider clock) : IReadingService
{
    public const int MaxQuestionLength = 500;
    public const int MaxNameLength = 50;

    public Task<StartReadingResponseDto> StartReadingAsync(StartReadingRequestDto request)
    {
        var userName = request.UserName?.Trim() ?? string.Empty;
        var question = request.Question?.Trim() ?? string.Empty;

        if (userName.Length == 0)
            throw new ArgumentException("O nome do consulente é obrigatório.");
        if (userName.Length > MaxNameLength)
            throw new ArgumentException($"O nome deve ter no máximo {MaxNameLength} caracteres.");
        if (question.Length < 5)
            throw new ArgumentException("A pergunta deve conter ao menos 5 caracteres.");
        if (question.Length > MaxQuestionLength)
            throw new ArgumentException($"A pergunta deve ter no máximo {MaxQuestionLength} caracteres.");

        var sessionId = string.IsNullOrWhiteSpace(request.SessionId) || request.SessionId == "sess_temp"
            ? $"sess_{Guid.NewGuid():N}"
            : request.SessionId.Trim();

        var readingId = $"rdg_{Guid.NewGuid().ToString("N")[..10]}_{clock.GetUtcNow().ToUnixTimeSeconds()}";

        // 1) Segurança primeiro: acolhimento nunca depende de limite gratuito.
        var safety = screener.Assess(question);

        // 2) Degustação: uma leitura gratuita por sessão.
        if (!safety.IsCrisis && freePolicy.HasUsedAnother(sessionId, readingId))
            throw new FreeReadingUsedException();

        var record = new ReadingRecord
        {
            ReadingId = readingId,
            SessionId = sessionId,
            UserName = userName,
            Question = question,
            CreatedAt = clock.GetUtcNow(),
            Safety = safety,
            Table = safety.IsCrisis ? [] : shuffler.DealTable(Spread.TableSlots),
        };
        store.Add(record);

        var response = new StartReadingResponseDto(
            Success: true,
            ReadingId: readingId,
            SessionId: sessionId,
            UserName: userName,
            Question: question,
            Timestamp: clock.GetUtcNow().UtcDateTime,
            Message: safety.IsCrisis
                ? "Antes de qualquer carta, queremos cuidar de você."
                : "Sua pergunta foi acolhida pela Moira. As cartas estão prontas para o ritual.",
            Status: safety.IsCrisis ? "support" : "ready",
            TableSlots: safety.IsCrisis ? 0 : Spread.TableSlots,
            CardsToPick: safety.IsCrisis ? 0 : Spread.CardsPerReading,
            Support: safety.IsCrisis ? SupportContent.For(safety).ToDto() : null);

        return Task.FromResult(response);
    }

    public DrawResponseDto Draw(string readingId, DrawRequestDto request)
    {
        var record = store.Find(readingId, request.SessionId) ?? throw new ReadingNotFoundException();

        if (record.Safety.IsCrisis)
            throw new ReadingConflictException("support_only", "Esta conversa pede acolhimento, não uma tiragem.");

        lock (record.Sync)
        {
            // Idempotente: uma vez escolhidas, as cartas não mudam (sem "re-sorteio" por repetição).
            if (record.Drawn is not null)
                return new DrawResponseDto(readingId, record.Picks ?? [], record.Drawn.Select(d => d.ToDto()).ToList());

            var picks = request.Picks ?? [];
            if (picks.Length != Spread.CardsPerReading)
                throw new ArgumentException($"Escolha exatamente {Spread.CardsPerReading} cartas.");
            if (picks.Distinct().Count() != picks.Length)
                throw new ArgumentException("Cada carta só pode ser escolhida uma vez.");
            if (picks.Any(p => p < 0 || p >= record.Table.Count))
                throw new ArgumentException("Essa posição não existe na mesa.");

            record.Drawn = picks
                .Select((slot, i) => new DrawnCard(Spread.Positions[i], ArcanaCatalog.ByNumber(record.Table[slot])))
                .ToList();
            record.Picks = picks;

            return new DrawResponseDto(readingId, picks, record.Drawn.Select(d => d.ToDto()).ToList());
        }
    }
}
