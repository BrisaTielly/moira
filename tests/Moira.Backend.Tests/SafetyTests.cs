using Moira.Backend.Services.Safety;

namespace Moira.Backend.Tests;

public class SafetyScreenerTests
{
    private readonly KeywordSafetyScreener _screener = new();

    [Theory]
    [InlineData("Estou pensando em me matar, as cartas podem me ajudar?")]
    [InlineData("Eu só quero morrer, não vejo saída")]
    [InlineData("Não aguento mais viver assim")]
    [InlineData("Penso em suicídio todos os dias")]
    [InlineData("Quero acabar com a minha vida")]
    [InlineData("Às vezes eu me corto quando fico ansiosa")]
    [InlineData("NÃO QUERO MAIS VIVER")]
    [InlineData("Seria melhor se eu não existisse")]
    [InlineData("Não vejo sentido em viver")]
    public void Autolesao_e_risco_suicida_sao_crise(string question)
    {
        var result = _screener.Assess(question);
        Assert.True(result.IsCrisis);
        Assert.False(result.ViolenceRisk);
    }

    [Theory]
    [InlineData("Meu namorado disse que vai me matar se eu for embora")]
    [InlineData("Estou sendo agredida em casa, o que faço?")]
    [InlineData("Meu marido me bateu ontem")]
    public void Perigo_por_violencia_e_crise_com_recursos_de_seguranca(string question)
    {
        var result = _screener.Assess(question);
        Assert.True(result.IsCrisis);
        Assert.True(result.ViolenceRisk);

        var support = SupportContent.For(result);
        Assert.Contains(support.Resources, r => r.Contact.Contains("190"));
        Assert.Contains(support.Resources, r => r.Contact.Contains("180"));
    }

    [Theory]
    [InlineData("O que a carta da Morte quer me dizer sobre meu relacionamento?")]
    [InlineData("Devo mudar de emprego este ano?")]
    [InlineData("Como posso me reconectar com a minha mãe?")]
    [InlineData("Estou num momento de recomeço, o que preciso olhar?")]
    public void Perguntas_comuns_nao_sao_crise(string question)
    {
        Assert.False(_screener.Assess(question).IsCrisis);
    }

    [Fact]
    public void Crise_inclui_CVV_e_SAMU()
    {
        var support = SupportContent.For(_screener.Assess("quero me matar"));
        Assert.Contains(support.Resources, r => r.Contact.Contains("188"));
        Assert.Contains(support.Resources, r => r.Contact.Contains("192"));
    }

    [Theory]
    [InlineData("Devo parar o tratamento que o médico passou?", SensitiveDomain.Medical)]
    [InlineData("Vale a pena investir em bitcoin agora?", SensitiveDomain.Financial)]
    [InlineData("Devo entrar com o divórcio e pedir pensão?", SensitiveDomain.Legal)]
    public void Detecta_temas_sensiveis_sem_bloquear(string question, SensitiveDomain expected)
    {
        var result = _screener.Assess(question);
        Assert.False(result.IsCrisis);
        Assert.True(result.Domains.HasFlag(expected));
    }

    [Fact]
    public void Texto_vazio_e_seguro()
    {
        Assert.Equal(SafetyAssessment.Safe, _screener.Assess("   "));
    }
}

public class OutputGuardTests
{
    private readonly RegexOutputGuard _guard = new();

    [Theory]
    [InlineData("Com certeza você vai conseguir o emprego.", "certeza")]
    [InlineData("As cartas garantem que ele volta.", "previsao")]
    [InlineData("Cuidado: há uma maldição sobre a sua casa.", "medo")]
    [InlineData("Você pode parar de tomar o remédio.", "medico")]
    [InlineData("Invista tudo nessa oportunidade.", "financeiro")]
    [InlineData("Assine o contrato sem medo.", "juridico")]
    [InlineData("Você não precisa de terapia, só das cartas.", "medico")]
    public void Barra_certezas_medo_e_ordens_profissionais(string text, string rule)
    {
        Assert.Contains(rule, _guard.Check(text));
    }

    [Theory]
    [InlineData("Esta carta convida você a olhar para a sua coragem.")]
    [InlineData("Talvez valha conversar com um profissional de saúde sobre isso.")]
    [InlineData("A Torre fala de uma verdade que, aceita, pode trazer alívio.")]
    public void Aprova_linguagem_de_reflexao(string text)
    {
        Assert.Empty(_guard.Check(text));
    }

    [Fact]
    public void Texto_vazio_e_reprovado()
    {
        Assert.NotEmpty(_guard.Check(""));
    }
}
