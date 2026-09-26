using Microsoft.Extensions.Diagnostics.HealthChecks;
using Moira.Backend.Infrastructure;

namespace Moira.Backend.HealthChecks;

public sealed class DatabaseHealthCheck(IServiceScopeFactory scopeFactory) : IHealthCheck
{
    public async Task<HealthCheckResult> CheckHealthAsync(
        HealthCheckContext context,
        CancellationToken cancellationToken = default)
    {
        try
        {
            await using var scope = scopeFactory.CreateAsyncScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<MoiraDbContext>();

            return await dbContext.Database.CanConnectAsync(cancellationToken)
                ? HealthCheckResult.Healthy("Conexão com o PostgreSQL estabelecida.")
                : HealthCheckResult.Unhealthy("O PostgreSQL não respondeu à verificação de conexão.");
        }
        catch (Exception exception)
        {
            return HealthCheckResult.Unhealthy(
                "Não foi possível conectar ao PostgreSQL.",
                exception);
        }
    }
}
