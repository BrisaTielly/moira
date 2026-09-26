using System.Text.RegularExpressions;

namespace Moira.Backend.Services.Safety;

public interface IOutputGuard
{
    /// <summary>Lista de violações encontradas no texto gerado (vazia = aprovado).</summary>
    IReadOnlyList<string> Check(string text);
}

/// <summary>
/// Última barreira antes do texto chegar à tela: bloqueia certezas/previsões,
/// ordens em temas médicos, jurídicos ou financeiros e linguagem de medo.
/// Se algo passar, o serviço troca a resposta por uma versão segura.
/// </summary>
public sealed class RegexOutputGuard : IOutputGuard
{
    private static readonly (string Rule, Regex Pattern)[] Rules =
    [
        ("certeza", Rx(@"\b(com certeza|certamente|sem duvida|garanto|e garantido|com toda certeza) (vai|voce vai|ira|acontecera|tera)")),
        ("previsao", Rx(@"\b(as cartas|o tarot|o destino) (garantem|garante|preveem|preve|determinam|determina)\b")),
        ("previsao", Rx(@"\b(vai|ira) (morrer|adoecer|falir|ser demitida|ser demitido|perder tudo)\b")),
        ("medo", Rx(@"\b(maldicao|amaldicoad|praga|mau olhado|castigo divino)\b")),
        ("medico", Rx(@"\b(pare|deixe|pode parar|nao precisa) (de )?(tomar|usar) (o |a |os |as |seu |sua )?(remedio|medicament|tratamento)")),
        ("medico", Rx(@"\bvoce (tem|esta com) (cancer|depressao|ansiedade|transtorno|doenca)\b")),
        ("medico", Rx(@"\b(nao|sem) (precisa|necessidade) de (medico|medica|terapia|psicologo|psicologa|psiquiatra)")),
        ("financeiro", Rx(@"\b(invista|compre|venda|aposte|faca o emprestimo|pegue o emprestimo)\b")),
        ("juridico", Rx(@"\b(nao precisa de advogad|assine o contrato|nao assine|entre com o processo|desista do processo)")),
    ];

    public IReadOnlyList<string> Check(string text)
    {
        if (string.IsNullOrWhiteSpace(text)) return ["vazio"];
        var normalized = KeywordSafetyScreener.Normalize(text);
        return Rules
            .Where(r => r.Pattern.IsMatch(normalized))
            .Select(r => r.Rule)
            .Distinct()
            .ToList();
    }

    private static Regex Rx(string pattern) =>
        new(pattern, RegexOptions.Compiled | RegexOptions.CultureInvariant, TimeSpan.FromMilliseconds(200));
}
