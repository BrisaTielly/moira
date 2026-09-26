using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;

namespace Moira.Backend.Services.Safety;

public enum RiskLevel
{
    None,
    /// <summary>Sinais de autolesão, ideação suicida ou perigo imediato: não há leitura de tarot.</summary>
    Crisis,
}

[Flags]
public enum SensitiveDomain
{
    None = 0,
    Medical = 1,
    Legal = 2,
    Financial = 4,
}

public sealed record SafetyAssessment(RiskLevel Risk, SensitiveDomain Domains, bool ViolenceRisk)
{
    public static readonly SafetyAssessment Safe = new(RiskLevel.None, SensitiveDomain.None, false);
    public bool IsCrisis => Risk == RiskLevel.Crisis;
}

public interface ISafetyScreener
{
    SafetyAssessment Assess(string text);
}

/// <summary>
/// Triagem determinística (pt-BR) feita ANTES de qualquer chamada ao modelo.
/// Heurística conservadora: prefere acolher um falso positivo a deixar passar um risco real.
/// Deve ser complementada por um classificador dedicado (ver docs/DECISOES-E-PENDENCIAS.md).
/// </summary>
public sealed class KeywordSafetyScreener : ISafetyScreener
{
    // Os padrões são aplicados sobre texto normalizado: minúsculo, sem acentos, espaços simples.
    private static readonly Regex[] SelfHarmPatterns = Compile(
        @"\bsuicid",                                   // suicídio, suicidar, suicida
        @"\bme matar\b",
        @"\bmatar a mim\b",
        @"\b(quero|queria|vou|penso em|pensando em) morrer\b",
        @"\bnao (quero|aguento) mais (viver|estar aqui|existir)\b",
        @"\b(acabar|tirar|terminar) com a (minha )?(propria )?vida\b",
        @"\btirar (a )?minha (propria )?vida\b",
        @"\b(me cortar|me corto|me cortando)\b",
        @"\bautolesao\b|\bauto lesao\b|\bautomutila",
        @"\b(me machucar|me machuco|me ferir)\b",
        @"\boverdose\b",
        @"\b(me jogar|pular) (da|de uma|de um|do) (ponte|predio|janela|sacada|viaduto)\b",
        @"\bsumir (de vez|para sempre|pra sempre)\b",
        @"\bmelhor (se eu|sem mim)\b.*\b(morresse|nao existisse|nao estivesse)\b",
        @"\bnao (vejo|tenho) (mais )?(sentido|motivo) (em|para|pra) viver\b");

    private static readonly Regex[] ViolencePatterns = Compile(
        @"\b(ele|ela|meu marido|meu namorado|meu ex|minha esposa|minha namorada|alguem) (vai|quer|ameacou|ameaca|disse que vai) me matar\b",
        @"\b(estou|to|tou) sendo (agredida|agredido|ameacada|ameacado|espancada|espancado)\b",
        @"\bme (bate|bateu|agride|agrediu|espanca|espancou)\b",
        @"\bviolencia domestica\b",
        @"\b(vou|quero) matar (ele|ela|alguem|meu|minha)\b");

    private static readonly Regex[] MedicalPatterns = Compile(
        @"\b(doenca|diagnostic|sintoma|remedio|medicament|tratamento|cirurgia|exame|cancer|tumor|depressao|ansiedade|medico|medica|terapia|gravidez|gravida|psiquiatr)");

    private static readonly Regex[] LegalPatterns = Compile(
        @"\b(processo judicial|processar|advogad|justica|juiz|tribunal|divorcio|guarda (do|da|dos|das) filh|pensao|contrato|heranca|inventario|prisao)");

    private static readonly Regex[] FinancialPatterns = Compile(
        @"\b(investi|acoes|bolsa de valores|cripto|bitcoin|emprestimo|divida|financiamento|aposta|apostar|bet\b|consorcio|poupanca|dinheiro)");

    public SafetyAssessment Assess(string text)
    {
        if (string.IsNullOrWhiteSpace(text)) return SafetyAssessment.Safe;
        var normalized = Normalize(text);

        var selfHarm = SelfHarmPatterns.Any(p => p.IsMatch(normalized));
        var violence = ViolencePatterns.Any(p => p.IsMatch(normalized));

        var domains = SensitiveDomain.None;
        if (MedicalPatterns.Any(p => p.IsMatch(normalized))) domains |= SensitiveDomain.Medical;
        if (LegalPatterns.Any(p => p.IsMatch(normalized))) domains |= SensitiveDomain.Legal;
        if (FinancialPatterns.Any(p => p.IsMatch(normalized))) domains |= SensitiveDomain.Financial;

        var risk = selfHarm || violence ? RiskLevel.Crisis : RiskLevel.None;
        return new SafetyAssessment(risk, domains, violence);
    }

    public static string Normalize(string text)
    {
        var decomposed = text.ToLowerInvariant().Normalize(NormalizationForm.FormD);
        var sb = new StringBuilder(decomposed.Length);
        foreach (var ch in decomposed)
        {
            if (CharUnicodeInfo.GetUnicodeCategory(ch) != UnicodeCategory.NonSpacingMark)
                sb.Append(ch);
        }
        // Pontuação vira espaço para os padrões casarem com frases naturais.
        var clean = Regex.Replace(sb.ToString(), @"[^\p{L}\p{N}]+", " ");
        return Regex.Replace(clean, @"\s+", " ").Trim();
    }

    private static Regex[] Compile(params string[] patterns) =>
        patterns
            .Select(p => new Regex(p, RegexOptions.Compiled | RegexOptions.CultureInvariant, TimeSpan.FromMilliseconds(200)))
            .ToArray();
}
