using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;
using Moira.Backend.Models;
using Moira.Backend.Services.Interpretation;
using Moira.Backend.Services.Readings;

namespace Moira.Backend.Tests;

/// <summary>Fluxo HTTP completo, com o modelo trocado por um fake.</summary>
public class ApiIntegrationTests
{
    private static HttpClient Client(IInterpretationModel model) =>
        new WebApplicationFactory<Program>()
            .WithWebHostBuilder(host =>
            {
                host.UseEnvironment("Testing");
                host.UseSetting("Moira:RateLimits:ReadingsPerWindow", "1000");
                host.UseSetting("Moira:RateLimits:InterpretationsPerWindow", "1000");
                host.ConfigureTestServices(services =>
                {
                    services.AddSingleton(model);
                    services.AddSingleton<IDeckShuffler>(new FixedShuffler());
                });
            })
            .CreateClient(new WebApplicationFactoryClientOptions { BaseAddress = new Uri("https://localhost") });

    private static async Task<StartReadingResponseDto> Ask(HttpClient client, string question, string session = "sess_int")
    {
        var response = await client.PostAsJsonAsync("/api/readings/question", new StartReadingRequestDto(session, "Ana", question));
        response.EnsureSuccessStatusCode();
        return (await response.Content.ReadFromJsonAsync<StartReadingResponseDto>())!;
    }

    [Fact]
    public async Task Fluxo_completo_pergunta_escolha_interpretacao()
    {
        var client = Client(FakeModel.Returning(FakeModel.ValidJson()));
        var start = await Ask(client, "Como encontro mais leveza no trabalho?");
        Assert.Equal("ready", start.Status);

        var draw = await client.PostAsJsonAsync($"/api/readings/{start.ReadingId}/draw", new DrawRequestDto(start.SessionId, [0, 5, 9]));
        draw.EnsureSuccessStatusCode();
        var drawn = (await draw.Content.ReadFromJsonAsync<DrawResponseDto>())!;
        Assert.Equal(3, drawn.Cards.Count);

        var interp = await client.PostAsJsonAsync($"/api/readings/{start.ReadingId}/interpretation", new InterpretationRequestDto(start.SessionId));
        interp.EnsureSuccessStatusCode();
        var body = (await interp.Content.ReadFromJsonAsync<InterpretationResponseDto>())!;
        Assert.Equal("ready", body.Status);
        Assert.Equal(drawn.Cards.Select(c => c.Name), body.Cards.Select(c => c.Name));
        Assert.False(string.IsNullOrWhiteSpace(body.Interpretation!.Invitation));
    }

    [Fact]
    public async Task Resposta_da_pergunta_nao_expoe_as_cartas_da_mesa()
    {
        var client = Client(FakeModel.Returning(FakeModel.ValidJson()));
        var raw = await (await client.PostAsJsonAsync("/api/readings/question",
            new StartReadingRequestDto("sess_x", "Ana", "Uma pergunta qualquer aqui"))).Content.ReadAsStringAsync();

        Assert.DoesNotContain("table", raw, StringComparison.OrdinalIgnoreCase);
        Assert.DoesNotContain("A Estrela", raw);
    }

    [Fact]
    public async Task Pergunta_de_risco_recebe_acolhimento_via_api()
    {
        var model = FakeModel.Returning(FakeModel.ValidJson());
        var start = await Ask(Client(model), "não quero mais viver");

        Assert.Equal("support", start.Status);
        Assert.Contains(start.Support!.Resources, r => r.Contact.Contains("188"));
        Assert.Equal(0, model.Calls);
    }

    [Fact]
    public async Task Falha_do_modelo_vira_503_repetivel()
    {
        var client = Client(FakeModel.Failing());
        var start = await Ask(client, "Como encontro mais leveza no trabalho?");
        await client.PostAsJsonAsync($"/api/readings/{start.ReadingId}/draw", new DrawRequestDto(start.SessionId, [0, 1, 2]));

        var interp = await client.PostAsJsonAsync($"/api/readings/{start.ReadingId}/interpretation", new InterpretationRequestDto(start.SessionId));

        Assert.Equal(HttpStatusCode.ServiceUnavailable, interp.StatusCode);
        var error = (await interp.Content.ReadFromJsonAsync<ApiErrorDto>())!;
        Assert.Equal("interpretation_unavailable", error.Code);
        Assert.True(error.Retryable);
    }

    [Fact]
    public async Task Erros_de_validacao_e_sessao_tem_status_corretos()
    {
        var client = Client(FakeModel.Returning(FakeModel.ValidJson()));

        var tooShort = await client.PostAsJsonAsync("/api/readings/question", new StartReadingRequestDto("s", "Ana", "oi"));
        Assert.Equal(HttpStatusCode.BadRequest, tooShort.StatusCode);

        var missing = await client.PostAsJsonAsync("/api/readings/rdg_inexistente/interpretation", new InterpretationRequestDto("s"));
        Assert.Equal(HttpStatusCode.NotFound, missing.StatusCode);

        var start = await Ask(client, "Como encontro mais leveza no trabalho?");
        var notDrawn = await client.PostAsJsonAsync($"/api/readings/{start.ReadingId}/interpretation", new InterpretationRequestDto(start.SessionId));
        Assert.Equal(HttpStatusCode.Conflict, notDrawn.StatusCode);
    }

    [Fact]
    public async Task Segunda_leitura_gratuita_retorna_402()
    {
        var client = Client(FakeModel.Returning(FakeModel.ValidJson()));
        var start = await Ask(client, "Como encontro mais leveza no trabalho?", "sess_402");
        await client.PostAsJsonAsync($"/api/readings/{start.ReadingId}/draw", new DrawRequestDto(start.SessionId, [0, 1, 2]));
        (await client.PostAsJsonAsync($"/api/readings/{start.ReadingId}/interpretation", new InterpretationRequestDto(start.SessionId)))
            .EnsureSuccessStatusCode();

        var second = await client.PostAsJsonAsync("/api/readings/question",
            new StartReadingRequestDto("sess_402", "Ana", "E sobre o amor, o que as cartas dizem?"));

        Assert.Equal(HttpStatusCode.PaymentRequired, second.StatusCode);
        Assert.Equal("free_reading_used", (await second.Content.ReadFromJsonAsync<ApiErrorDto>())!.Code);
    }

    [Fact]
    public async Task Prompt_nao_e_servido_como_arquivo()
    {
        var client = Client(FakeModel.Returning(FakeModel.ValidJson()));
        var response = await client.GetAsync("/Prompts/interpretation-system.md");
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }
}
