using Moira.Backend.Domain;
using Moira.Backend.Models;
using Moira.Backend.Services.Readings;
using Moira.Backend.Services.Safety;

namespace Moira.Backend.Services.Interpretation;

public interface IInterpretationService
{
    Task<InterpretationResponseDto> GetInterpretationAsync(string readingId, InterpretationRequestDto request, CancellationToken cancellationToken);
}

public sealed class InterpretationService(
    IReadingStore store,
    IFreeReadingPolicy freePolicy,
    IInterpretationModel model,
    TemplateInterpretationModel safeTemplate,
    PromptBuilder prompts,
    IOutputGuard guard,
    ISafetyScreener screener,
    InterpretationCache cache,
    ILogger<InterpretationService> logger) : IInterpretationService
{
    public const string Disclaimer =
        "O Tarot da Moira é uma ferramenta de reflexão e autoconhecimento. " +
        "Ele não prevê o futuro e não substitui orientação médica, psicológica, jurídica ou financeira.";

    public async Task<InterpretationResponseDto> GetInterpretationAsync(
        string readingId, InterpretationRequestDto request, CancellationToken cancellationToken)
    {
        var record = store.Find(readingId, request.SessionId) ?? throw new ReadingNotFoundException();

        // Defesa em profundidade: reavalia a pergunta mesmo que a triagem inicial tenha passado.
        var safety = record.Safety.IsCrisis ? record.Safety : screener.Assess(record.Question);
        if (safety.IsCrisis)
        {
            return new InterpretationResponseDto(readingId, "support", [], null, SupportContent.For(safety).ToDto());
        }

        if (record.Drawn is null)
            throw new ReadingConflictException("cards_not_drawn", "Escolha as suas três cartas antes da revelação.");

        if (!freePolicy.CanUse(record.SessionId, readingId))
            throw new FreeReadingUsedException();

        // O trabalho compartilhado não usa o token da requisição: se esta aba fechar,
        // a leitura continua e fica pronta para a próxima tentativa.
        var interpretation = await cache
            .GetOrCreateAsync(readingId, () => GenerateAsync(record))
            .WaitAsync(cancellationToken);

        freePolicy.MarkUsed(record.SessionId, readingId);

        return new InterpretationResponseDto(
            readingId, "ready", record.Drawn.Select(d => d.ToDto()).ToList(), interpretation, null);
    }

    private async Task<InterpretationDto> GenerateAsync(ReadingRecord record)
    {
        var context = InterpretationContext.From(record);
        var request = prompts.Build(context);

        var raw = await model.CompleteAsync(request, CancellationToken.None); // ModelUnavailableException sobe
        var source = model is TemplateInterpretationModel ? "template" : "model";

        if (!InterpretationParser.TryParse(raw, out var draft) || draft is null)
        {
            logger.LogWarning("Leitura {ReadingId}: resposta do modelo fora do formato; usando versão segura.", record.ReadingId);
            (draft, source) = (await SafeDraftAsync(request), "fallback");
        }
        else
        {
            var violations = draft.AllTexts().SelectMany(guard.Check).Distinct().ToList();
            if (violations.Count > 0)
            {
                logger.LogWarning("Leitura {ReadingId}: resposta barrada pela guarda ({Rules}); usando versão segura.",
                    record.ReadingId, string.Join(",", violations));
                (draft, source) = (await SafeDraftAsync(request), "fallback");
            }
        }

        return new InterpretationDto(
            Opening: draft.Opening,
            Cards: context.Cards
                .Select((c, i) => new CardReadingDto(c.Position.Index, c.Position.Title, c.Card.Name, draft.CardTexts[i]))
                .ToList(),
            Synthesis: draft.Synthesis,
            Invitation: draft.Invitation,
            CareNote: CareNoteFor(context.Domains),
            Disclaimer: Disclaimer,
            Source: source);
    }

    private async Task<InterpretationDraft> SafeDraftAsync(ModelRequest request)
    {
        var raw = await safeTemplate.CompleteAsync(request, CancellationToken.None);
        return InterpretationParser.TryParse(raw, out var draft) && draft is not null
            ? draft
            : throw new InvalidOperationException("O template seguro gerou um formato inválido.");
    }

    public static string? CareNoteFor(SensitiveDomain domains)
    {
        var who = new List<string>();
        if (domains.HasFlag(SensitiveDomain.Medical)) who.Add("um profissional de saúde");
        if (domains.HasFlag(SensitiveDomain.Legal)) who.Add("um advogado ou advogada");
        if (domains.HasFlag(SensitiveDomain.Financial)) who.Add("um profissional de finanças");
        if (who.Count == 0) return null;

        var list = who.Count == 1 ? who[0] : string.Join(", ", who.Take(who.Count - 1)) + " e " + who[^1];
        return $"Sua pergunta toca um tema importante. As cartas ajudam a refletir, mas a decisão prática merece a orientação de {list}.";
    }
}
