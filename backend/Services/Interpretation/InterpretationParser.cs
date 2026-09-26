using System.Text.Json;
using Moira.Backend.Domain;

namespace Moira.Backend.Services.Interpretation;

/// <summary>Valida o JSON devolvido pelo modelo. Qualquer desvio = rejeitado (o serviço usa a versão segura).</summary>
public static class InterpretationParser
{
    private const int MaxSectionLength = 1200;

    public static bool TryParse(string raw, out InterpretationDraft? draft)
    {
        draft = null;
        if (string.IsNullOrWhiteSpace(raw)) return false;

        var json = StripFences(raw);
        try
        {
            using var doc = JsonDocument.Parse(json);
            var root = doc.RootElement;
            if (root.ValueKind != JsonValueKind.Object) return false;

            var opening = ReadString(root, "abertura");
            var synthesis = ReadString(root, "sintese");
            var invitation = ReadString(root, "convite");
            if (opening is null || synthesis is null || invitation is null) return false;

            if (!root.TryGetProperty("cartas", out var cards) || cards.ValueKind != JsonValueKind.Array) return false;

            var texts = new string?[Spread.CardsPerReading];
            foreach (var card in cards.EnumerateArray())
            {
                if (card.ValueKind != JsonValueKind.Object) return false;
                if (!card.TryGetProperty("posicao", out var pos) || !pos.TryGetInt32(out var index)) return false;
                if (index < 0 || index >= texts.Length || texts[index] is not null) return false;
                texts[index] = ReadString(card, "texto");
                if (texts[index] is null) return false;
            }
            if (texts.Any(t => t is null)) return false;

            draft = new InterpretationDraft(opening, texts.Select(t => t!).ToList(), synthesis, invitation);
            return true;
        }
        catch (JsonException)
        {
            return false;
        }
    }

    private static string? ReadString(JsonElement obj, string name)
    {
        if (!obj.TryGetProperty(name, out var value) || value.ValueKind != JsonValueKind.String) return null;
        var text = value.GetString()?.Trim();
        if (string.IsNullOrEmpty(text) || text.Length > MaxSectionLength) return null;
        return text;
    }

    private static string StripFences(string raw)
    {
        var text = raw.Trim();
        if (text.StartsWith("```"))
        {
            var firstNewLine = text.IndexOf('\n');
            if (firstNewLine >= 0) text = text[(firstNewLine + 1)..];
            if (text.EndsWith("```")) text = text[..^3];
        }
        // Tolera texto em volta do objeto (alguns modelos gratuitos "conversam" antes do JSON).
        var start = text.IndexOf('{');
        var end = text.LastIndexOf('}');
        return start >= 0 && end > start ? text[start..(end + 1)] : text;
    }
}
