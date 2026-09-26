using Moira.Backend.Domain;
using Moira.Backend.Services.Readings;
using Moira.Backend.Services.Safety;

namespace Moira.Backend.Services.Interpretation;

/// <summary>Tudo o que a interpretação precisa saber: pergunta, cartas, posições e significados.</summary>
public sealed record InterpretationContext(
    string UserName,
    string Question,
    IReadOnlyList<DrawnCard> Cards,
    SensitiveDomain Domains)
{
    public static InterpretationContext From(ReadingRecord record)
    {
        if (record.Drawn is null || record.Drawn.Count != Spread.CardsPerReading)
            throw new InvalidOperationException("A leitura ainda não tem as três cartas escolhidas.");
        return new InterpretationContext(record.UserName, record.Question, record.Drawn, record.Safety.Domains);
    }
}

/// <summary>Mensagens enviadas ao modelo + o contexto estruturado (usado pelo modelo de template).</summary>
public sealed record ModelRequest(string SystemPrompt, string UserPrompt, InterpretationContext Context);

/// <summary>Resultado já validado, antes de virar DTO.</summary>
public sealed record InterpretationDraft(
    string Opening,
    IReadOnlyList<string> CardTexts,
    string Synthesis,
    string Invitation)
{
    public IEnumerable<string> AllTexts() => new[] { Opening, Synthesis, Invitation }.Concat(CardTexts);
}
