namespace Moira.Backend.Services.Interpretation;

/// <summary>Seção "Moira:Llm" do appsettings. A chave vem de user-secrets/variável de ambiente, nunca do repositório.</summary>
public sealed class LlmOptions
{
    public const string Section = "Moira:Llm";

    /// <summary>"Template" (sem IA) ou "OpenAICompatible" (Groq, OpenRouter, Ollama, OpenAI...).</summary>
    public string Provider { get; set; } = "Template";

    public string BaseUrl { get; set; } = "https://api.groq.com/openai/v1";
    public string Model { get; set; } = "llama-3.3-70b-versatile";
    public string? ApiKey { get; set; }
    public int TimeoutSeconds { get; set; } = 25;
    public double Temperature { get; set; } = 0.8;
    public int MaxTokens { get; set; } = 1200;

    /// <summary>Envia response_format=json_object (suportado por Groq/OpenAI; desligue se o provedor recusar).</summary>
    public bool JsonMode { get; set; } = true;

    public bool UsesRemoteModel =>
        string.Equals(Provider, "OpenAICompatible", StringComparison.OrdinalIgnoreCase)
        && !string.IsNullOrWhiteSpace(ApiKey);
}
