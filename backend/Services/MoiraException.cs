namespace Moira.Backend.Services;

/// <summary>Erro de domínio com código estável para o frontend e status HTTP sugerido.</summary>
public class MoiraException(string code, string message, int status, bool retryable = false)
    : Exception(message)
{
    public string Code { get; } = code;
    public int Status { get; } = status;
    public bool Retryable { get; } = retryable;
}

public sealed class ReadingNotFoundException()
    : MoiraException("reading_not_found", "Não encontramos essa leitura. Que tal começar uma nova?", 404) { }

public sealed class ReadingConflictException(string code, string message)
    : MoiraException(code, message, 409) { }

public sealed class FreeReadingUsedException()
    : MoiraException(
        "free_reading_used",
        "Sua leitura gratuita já foi revelada. Em breve você poderá continuar sua jornada com a Moira.",
        402) { }

public sealed class ModelUnavailableException(string reason)
    : MoiraException(
        "interpretation_unavailable",
        "A Moira não conseguiu concluir a leitura agora. Suas cartas continuam guardadas: tente novamente em instantes.",
        503,
        retryable: true)
{
    public string Reason { get; } = reason;
}
