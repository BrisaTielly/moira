namespace Moira.Backend.Services.Interpretation;

/// <summary>
/// Fronteira com o modelo de linguagem. Implementações: <see cref="TemplateInterpretationModel"/>
/// (offline, sem custo) e <see cref="OpenAiCompatibleModel"/> (Groq e afins). Nos testes, um fake.
/// Deve devolver o JSON bruto pedido no prompt, ou lançar <see cref="ModelUnavailableException"/>.
/// </summary>
public interface IInterpretationModel
{
    string Name { get; }
    Task<string> CompleteAsync(ModelRequest request, CancellationToken cancellationToken);
}
