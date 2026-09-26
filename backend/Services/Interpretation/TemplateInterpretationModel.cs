using System.Text.Json;

namespace Moira.Backend.Services.Interpretation;

/// <summary>
/// Interpretação sem IA, montada a partir do catálogo. Serve para: (1) rodar o produto sem chave/custo,
/// (2) ser a resposta SEGURA quando o modelo devolve algo fora das regras. Determinística e testável.
/// </summary>
public sealed class TemplateInterpretationModel : IInterpretationModel
{
    public string Name => "template";

    public Task<string> CompleteAsync(ModelRequest request, CancellationToken cancellationToken)
    {
        var ctx = request.Context;
        var first = FirstName(ctx.UserName);
        var cards = ctx.Cards;

        var payload = new
        {
            abertura =
                $"{first}, obrigada por trazer a sua pergunta com tanta sinceridade. " +
                "As cartas não vêm decidir por você: elas iluminam ângulos para você olhar com mais calma.",
            cartas = cards.Select(c => new
            {
                posicao = c.Position.Index,
                texto =
                    $"Em \"{c.Position.Title}\", {c.Card.Name} aparece falando de {Join(c.Card.Keywords)}. " +
                    $"{c.Card.Light} Ao mesmo tempo, vale observar com carinho: {Lower(c.Card.Shadow)} " +
                    $"{c.Card.ReflectionQuestion}",
            }),
            sintese =
                $"Juntas, {cards[0].Card.Name}, {cards[1].Card.Name} e {cards[2].Card.Name} desenham um movimento: " +
                $"reconhecer {cards[0].Card.Keywords[0]}, apoiar-se em {cards[1].Card.Keywords[0]} " +
                $"e seguir na direção de {cards[2].Card.Keywords[0]}. " +
                "Não é uma sentença sobre o que vai acontecer, e sim um espelho para você escolher com mais clareza.",
            convite =
                $"Nos próximos 7 dias, observe quando {cards[1].Card.Name} aparece no seu dia a dia: " +
                $"um gesto de {cards[1].Card.Keywords[0]}, por menor que seja. Anote o que perceber; " +
                "vale conversarmos sobre isso na sua próxima leitura.",
        };

        return Task.FromResult(JsonSerializer.Serialize(payload));
    }

    private static string FirstName(string name)
    {
        var first = name.Trim().Split(' ', StringSplitOptions.RemoveEmptyEntries).FirstOrDefault() ?? name;
        return first.Length == 0 ? "Querida consulente" : char.ToUpperInvariant(first[0]) + first[1..];
    }

    private static string Join(IReadOnlyList<string> words) =>
        words.Count switch
        {
            0 => "transformação",
            1 => words[0],
            _ => string.Join(", ", words.Take(words.Count - 1)) + " e " + words[^1],
        };

    private static string Lower(string text) =>
        string.IsNullOrEmpty(text) ? text : char.ToLowerInvariant(text[0]) + text[1..];
}
