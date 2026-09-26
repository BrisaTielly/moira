using Moira.Backend.Domain;
using Moira.Backend.Models;
using Moira.Backend.Services;
using Moira.Backend.Services.Readings;
using Moira.Backend.Services.Safety;

namespace Moira.Backend.Tests;

public class ReadingServiceTests
{
    private readonly InMemoryReadingStore _store = new(TimeProvider.System);
    private readonly InMemoryFreeReadingPolicy _free = new();

    private ReadingService CreateService(IDeckShuffler? shuffler = null) =>
        new(_store, shuffler ?? new FixedShuffler(), new KeywordSafetyScreener(), _free, TimeProvider.System);

    private static StartReadingRequestDto Question(string q = "Devo mudar de trabalho este ano?", string session = "sess_teste") =>
        new(session, "Ana", q);

    [Fact]
    public async Task Pergunta_valida_cria_leitura_com_mesa_no_servidor()
    {
        var response = await CreateService().StartReadingAsync(Question());

        Assert.Equal("ready", response.Status);
        Assert.Equal(Spread.TableSlots, response.TableSlots);
        Assert.Equal(Spread.CardsPerReading, response.CardsToPick);
        Assert.Null(response.Support);
        Assert.Matches("^rdg_[0-9a-f]{10}_\\d+$", response.ReadingId);

        var record = _store.Find(response.ReadingId, "sess_teste");
        Assert.NotNull(record);
        Assert.Equal(Spread.TableSlots, record!.Table.Count);
    }

    [Theory]
    [InlineData("", "Pergunta válida aqui")]
    [InlineData("Ana", "oi")]
    public async Task Entrada_invalida_e_recusada(string name, string question)
    {
        await Assert.ThrowsAsync<ArgumentException>(() =>
            CreateService().StartReadingAsync(new StartReadingRequestDto("sess_x", name, question)));
    }

    [Fact]
    public async Task Pergunta_longa_demais_e_recusada()
    {
        var longQuestion = new string('a', ReadingService.MaxQuestionLength + 1);
        await Assert.ThrowsAsync<ArgumentException>(() => CreateService().StartReadingAsync(Question(longQuestion)));
    }

    [Fact]
    public async Task Pergunta_de_risco_nao_gera_tiragem_e_retorna_acolhimento()
    {
        var response = await CreateService().StartReadingAsync(Question("Não aguento mais viver, penso em me matar"));

        Assert.Equal("support", response.Status);
        Assert.Equal(0, response.TableSlots);
        Assert.NotNull(response.Support);
        Assert.Contains(response.Support!.Resources, r => r.Contact.Contains("188"));

        var draw = () => CreateService().Draw(response.ReadingId, new DrawRequestDto("sess_teste", [0, 1, 2]));
        var ex = Assert.Throws<ReadingConflictException>(draw);
        Assert.Equal("support_only", ex.Code);
    }

    [Fact]
    public async Task Acolhimento_vem_antes_do_limite_gratuito()
    {
        _free.MarkUsed("sess_teste", "rdg_antiga");
        var response = await CreateService().StartReadingAsync(Question("quero morrer"));
        Assert.Equal("support", response.Status);
    }

    [Fact]
    public async Task Segunda_leitura_na_mesma_sessao_e_bloqueada()
    {
        _free.MarkUsed("sess_teste", "rdg_antiga");
        await Assert.ThrowsAsync<FreeReadingUsedException>(() => CreateService().StartReadingAsync(Question()));
    }

    [Fact]
    public async Task Escolha_mapeia_posicoes_da_mesa_para_arcanos_no_servidor()
    {
        var service = CreateService(new FixedShuffler(17, 8, 21, 0, 1, 2, 3, 4, 5, 6, 7, 9));
        var reading = await service.StartReadingAsync(Question());

        var draw = service.Draw(reading.ReadingId, new DrawRequestDto("sess_teste", [2, 0, 1]));

        Assert.Equal(new[] { "O Mundo", "A Estrela", "A Força" }, draw.Cards.Select(c => c.Name));
        Assert.Equal(new[] { 0, 1, 2 }, draw.Cards.Select(c => c.Position));
        Assert.Equal("O que pesa", draw.Cards[0].PositionTitle);
    }

    [Fact]
    public async Task Repetir_a_escolha_nao_troca_as_cartas()
    {
        var service = CreateService();
        var reading = await service.StartReadingAsync(Question());

        var first = service.Draw(reading.ReadingId, new DrawRequestDto("sess_teste", [0, 1, 2]));
        var second = service.Draw(reading.ReadingId, new DrawRequestDto("sess_teste", [5, 6, 7]));

        Assert.Equal(first.Cards.Select(c => c.Number), second.Cards.Select(c => c.Number));
        Assert.Equal(new[] { 0, 1, 2 }, second.Picks);
    }

    [Theory]
    [InlineData(new[] { 0, 1 })]
    [InlineData(new[] { 0, 1, 2, 3 })]
    [InlineData(new[] { 1, 1, 2 })]
    [InlineData(new[] { 0, 1, 99 })]
    [InlineData(new[] { -1, 1, 2 })]
    public async Task Escolha_invalida_e_recusada(int[] picks)
    {
        var service = CreateService();
        var reading = await service.StartReadingAsync(Question());
        Assert.Throws<ArgumentException>(() => service.Draw(reading.ReadingId, new DrawRequestDto("sess_teste", picks)));
    }

    [Fact]
    public async Task Outra_sessao_nao_acessa_a_leitura()
    {
        var service = CreateService();
        var reading = await service.StartReadingAsync(Question());
        Assert.Throws<ReadingNotFoundException>(() =>
            service.Draw(reading.ReadingId, new DrawRequestDto("sess_intrusa", [0, 1, 2])));
    }
}

public class DeckShufflerTests
{
    [Fact]
    public void Mesa_tem_cartas_distintas_e_validas()
    {
        var shuffler = new CryptoDeckShuffler();
        for (var i = 0; i < 200; i++)
        {
            var table = shuffler.DealTable(Spread.TableSlots);
            Assert.Equal(Spread.TableSlots, table.Count);
            Assert.Equal(table.Count, table.Distinct().Count());
            Assert.All(table, n => Assert.InRange(n, 0, 21));
        }
    }

    [Fact]
    public void Todos_os_arcanos_podem_aparecer()
    {
        var seen = new HashSet<int>();
        var shuffler = new CryptoDeckShuffler();
        for (var i = 0; i < 500 && seen.Count < 22; i++) seen.UnionWith(shuffler.DealTable(Spread.TableSlots));
        Assert.Equal(22, seen.Count);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(23)]
    public void Tamanho_de_mesa_invalido_falha(int slots)
    {
        Assert.Throws<ArgumentOutOfRangeException>(() => new CryptoDeckShuffler().DealTable(slots));
    }

    [Fact]
    public void Catalogo_tem_os_22_arcanos_completos()
    {
        Assert.Equal(22, ArcanaCatalog.MajorArcana.Count);
        Assert.Equal(Enumerable.Range(0, 22), ArcanaCatalog.MajorArcana.Select(c => c.Number));
        Assert.All(ArcanaCatalog.MajorArcana, c =>
        {
            Assert.False(string.IsNullOrWhiteSpace(c.Name));
            Assert.NotEmpty(c.Keywords);
            Assert.False(string.IsNullOrWhiteSpace(c.Light));
            Assert.False(string.IsNullOrWhiteSpace(c.Shadow));
            Assert.EndsWith("?", c.ReflectionQuestion);
        });
    }
}
