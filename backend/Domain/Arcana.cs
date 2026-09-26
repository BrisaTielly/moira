namespace Moira.Backend.Domain;

/// <summary>Um Arcano Maior com o significado usado para montar o contexto da leitura.</summary>
/// <param name="Number">0 a 21.</param>
/// <param name="Numeral">Numeral romano impresso na carta ("0" para O Louco).</param>
/// <param name="Name">Nome em português.</param>
/// <param name="Keywords">Palavras-chave simbólicas.</param>
/// <param name="Light">O que a carta ilumina quando aparece (leitura construtiva).</param>
/// <param name="Shadow">O que ela pede para observar com cuidado (sem tom de ameaça).</param>
/// <param name="ReflectionQuestion">Pergunta de reflexão que a carta devolve à consulente.</param>
public sealed record ArcanaCard(
    int Number,
    string Numeral,
    string Name,
    IReadOnlyList<string> Keywords,
    string Light,
    string Shadow,
    string ReflectionQuestion);

/// <summary>Posição da tiragem de 3 cartas. Reflexiva, nunca temporal/preditiva.</summary>
public sealed record SpreadPosition(int Index, string Title, string Meaning);

/// <summary>Carta sorteada numa posição.</summary>
public sealed record DrawnCard(SpreadPosition Position, ArcanaCard Card);

public static class Spread
{
    /// <summary>Quantas cartas viradas para baixo a consulente vê na mesa para escolher.</summary>
    public const int TableSlots = 12;

    /// <summary>Quantas cartas compõem a leitura.</summary>
    public const int CardsPerReading = 3;

    public static readonly IReadOnlyList<SpreadPosition> Positions =
    [
        new(0, "O que pesa", "o que tem pesado ou pedido atenção neste momento"),
        new(1, "O que sustenta", "o recurso interno ou apoio que já está disponível"),
        new(2, "O caminho", "a atitude ou direção que a reflexão sugere explorar"),
    ];
}
