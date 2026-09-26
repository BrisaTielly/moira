using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.Extensions.Options;

namespace Moira.Backend.Services.Interpretation;

/// <summary>
/// Cliente para qualquer API no formato OpenAI Chat Completions (Groq no plano gratuito, por padrão).
/// Trocar de provedor = trocar BaseUrl/Model/ApiKey na configuração.
/// </summary>
public sealed class OpenAiCompatibleModel(
    HttpClient http,
    IOptions<LlmOptions> options,
    ILogger<OpenAiCompatibleModel> logger) : IInterpretationModel
{
    private readonly LlmOptions _options = options.Value;

    public string Name => $"openai-compatible:{_options.Model}";

    public async Task<string> CompleteAsync(ModelRequest request, CancellationToken cancellationToken)
    {
        const int maxAttempts = 2;
        for (var attempt = 1; ; attempt++)
        {
            using var timeout = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken);
            timeout.CancelAfter(TimeSpan.FromSeconds(_options.TimeoutSeconds));

            try
            {
                using var message = BuildRequest(request);
                using var response = await http.SendAsync(message, timeout.Token);

                if (response.IsSuccessStatusCode)
                {
                    var body = await response.Content.ReadFromJsonAsync<ChatResponse>(timeout.Token);
                    var content = body?.Choices?.FirstOrDefault()?.Message?.Content;
                    if (string.IsNullOrWhiteSpace(content))
                        throw new ModelUnavailableException("resposta vazia do provedor");
                    return content;
                }

                var transient = response.StatusCode == HttpStatusCode.TooManyRequests || (int)response.StatusCode >= 500;
                logger.LogWarning("Provedor de IA respondeu {Status} (tentativa {Attempt}).", (int)response.StatusCode, attempt);

                if (transient && attempt < maxAttempts)
                {
                    await Task.Delay(RetryDelay(response), cancellationToken);
                    continue;
                }
                throw new ModelUnavailableException($"status {(int)response.StatusCode}");
            }
            catch (OperationCanceledException) when (!cancellationToken.IsCancellationRequested)
            {
                logger.LogWarning("Provedor de IA excedeu {Seconds}s (tentativa {Attempt}).", _options.TimeoutSeconds, attempt);
                if (attempt < maxAttempts) continue;
                throw new ModelUnavailableException("timeout");
            }
            catch (HttpRequestException ex)
            {
                logger.LogWarning(ex, "Falha de rede com o provedor de IA (tentativa {Attempt}).", attempt);
                if (attempt < maxAttempts) continue;
                throw new ModelUnavailableException("falha de rede");
            }
            catch (JsonException ex)
            {
                logger.LogWarning(ex, "Resposta ilegível do provedor de IA.");
                throw new ModelUnavailableException("resposta ilegível");
            }
        }
    }

    private HttpRequestMessage BuildRequest(ModelRequest request)
    {
        var payload = new ChatRequest
        {
            Model = _options.Model,
            Temperature = _options.Temperature,
            MaxTokens = _options.MaxTokens,
            ResponseFormat = _options.JsonMode ? new ResponseFormat { Type = "json_object" } : null,
            Messages =
            [
                new ChatMessage { Role = "system", Content = request.SystemPrompt },
                new ChatMessage { Role = "user", Content = request.UserPrompt },
            ],
        };

        var message = new HttpRequestMessage(HttpMethod.Post, $"{_options.BaseUrl.TrimEnd('/')}/chat/completions")
        {
            Content = JsonContent.Create(payload),
        };
        message.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _options.ApiKey);
        return message;
    }

    private static TimeSpan RetryDelay(HttpResponseMessage response)
    {
        var suggested = response.Headers.RetryAfter?.Delta;
        if (suggested is { } delta && delta > TimeSpan.Zero)
            return delta < TimeSpan.FromSeconds(3) ? delta : TimeSpan.FromSeconds(3);
        return TimeSpan.FromMilliseconds(800);
    }

    // ---- Contrato mínimo do Chat Completions ----

    internal sealed class ChatRequest
    {
        [JsonPropertyName("model")] public string Model { get; set; } = "";
        [JsonPropertyName("messages")] public List<ChatMessage> Messages { get; set; } = [];
        [JsonPropertyName("temperature")] public double Temperature { get; set; }
        [JsonPropertyName("max_tokens")] public int MaxTokens { get; set; }

        [JsonPropertyName("response_format")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public ResponseFormat? ResponseFormat { get; set; }
    }

    internal sealed class ResponseFormat
    {
        [JsonPropertyName("type")] public string Type { get; set; } = "json_object";
    }

    internal sealed class ChatMessage
    {
        [JsonPropertyName("role")] public string Role { get; set; } = "";
        [JsonPropertyName("content")] public string Content { get; set; } = "";
    }

    internal sealed class ChatResponse
    {
        [JsonPropertyName("choices")] public List<Choice>? Choices { get; set; }
    }

    internal sealed class Choice
    {
        [JsonPropertyName("message")] public ChatMessage? Message { get; set; }
    }
}
