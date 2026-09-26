using System.Threading.RateLimiting;
using Microsoft.AspNetCore.RateLimiting;
using Moira.Backend.Models;

namespace Moira.Backend;

/// <summary>Limites por IP para proteger a cota gratuita do modelo enquanto não há contas de usuário.</summary>
public static class RateLimitPolicies
{
    public const string Readings = "readings";
    public const string Interpretation = "interpretation";

    public sealed class Options
    {
        public const string Section = "Moira:RateLimits";
        public int ReadingsPerWindow { get; set; } = 30;
        public int InterpretationsPerWindow { get; set; } = 10;
        public int WindowMinutes { get; set; } = 10;
    }

    public static IServiceCollection AddMoiraRateLimits(this IServiceCollection services, IConfiguration configuration)
    {
        var options = configuration.GetSection(Options.Section).Get<Options>() ?? new Options();
        var window = TimeSpan.FromMinutes(options.WindowMinutes);

        return services.AddRateLimiter(limiter =>
        {
            limiter.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
            limiter.OnRejected = async (context, token) =>
            {
                await context.HttpContext.Response.WriteAsJsonAsync(
                    new ApiErrorDto("too_many_requests",
                        "Muitas tentativas em pouco tempo. Respire um instante e tente de novo em alguns minutos.",
                        true),
                    token);
            };

            limiter.AddPolicy(Readings, http => FixedWindow(http, options.ReadingsPerWindow, window));
            limiter.AddPolicy(Interpretation, http => FixedWindow(http, options.InterpretationsPerWindow, window));
        });
    }

    private static RateLimitPartition<string> FixedWindow(HttpContext http, int permits, TimeSpan window) =>
        RateLimitPartition.GetFixedWindowLimiter(
            http.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            _ => new FixedWindowRateLimiterOptions { PermitLimit = permits, Window = window, QueueLimit = 0 });
}
