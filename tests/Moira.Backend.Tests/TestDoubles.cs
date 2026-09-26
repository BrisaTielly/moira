using Moira.Backend.Services;
using Moira.Backend.Services.Interpretation;
using Moira.Backend.Services.Readings;

namespace Moira.Backend.Tests;

/// <summary>Mesa previsível: posição i da mesa = arcano i (ou a lista informada).</summary>
public sealed class FixedShuffler(params int[] table) : IDeckShuffler
{
    public IReadOnlyList<int> DealTable(int slots) =>
        table.Length > 0 ? table.Take(slots).ToArray() : Enumerable.Range(0, slots).ToArray();
}

/// <summary>Modelo falso: registra as chamadas e responde conforme o roteiro do teste.</summary>
public sealed class FakeModel(Func<ModelRequest, int, Task<string>> respond) : IInterpretationModel
{
    private int _calls;
    public int Calls => _calls;
    public ModelRequest? LastRequest { get; private set; }
    public string Name => "fake";

    public Task<string> CompleteAsync(ModelRequest request, CancellationToken cancellationToken)
    {
        var call = Interlocked.Increment(ref _calls);
        LastRequest = request;
        return respond(request, call);
    }

    public static string ValidJson(string extra = "") =>
        $$"""
        {
          "abertura": "Sua pergunta chega com coragem. Vamos olhar juntos.{{extra}}",
          "cartas": [
            { "posicao": 0, "texto": "Esta carta convida a reconhecer o que pesa." },
            { "posicao": 1, "texto": "Aqui aparece o que já te sustenta." },
            { "posicao": 2, "texto": "Um caminho possível é explorar com calma." }
          ],
          "sintese": "Juntas, as cartas sugerem um movimento gentil.",
          "convite": "Nos próximos 7 dias, observe um pequeno gesto de coragem."
        }
        """;

    public static FakeModel Returning(string json) => new((_, _) => Task.FromResult(json));

    public static FakeModel Failing() =>
        new((_, _) => throw new ModelUnavailableException("teste"));
}
