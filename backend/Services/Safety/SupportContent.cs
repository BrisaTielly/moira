namespace Moira.Backend.Services.Safety;

public sealed record SupportResource(string Name, string Contact, string Description);

public sealed record SupportMessage(string Title, string Message, IReadOnlyList<SupportResource> Resources);

/// <summary>
/// Conteúdo de acolhimento exibido quando a triagem identifica risco.
/// Nesse caso NÃO há tiragem nem interpretação de tarot. Serviços do Brasil.
/// </summary>
public static class SupportContent
{
    private static readonly SupportResource Cvv =
        new("CVV · Centro de Valorização da Vida", "Ligue 188 ou converse em cvv.org.br",
            "Apoio emocional gratuito, sigiloso e disponível 24 horas.");

    private static readonly SupportResource Samu =
        new("SAMU", "Ligue 192", "Emergências médicas, 24 horas.");

    private static readonly SupportResource Police =
        new("Polícia Militar", "Ligue 190", "Se você estiver em perigo imediato.");

    private static readonly SupportResource WomenLine =
        new("Central de Atendimento à Mulher", "Ligue 180",
            "Orientação e apoio em situações de violência, 24 horas e gratuito.");

    public static SupportMessage For(SafetyAssessment assessment)
    {
        if (assessment.ViolenceRisk)
        {
            return new SupportMessage(
                "Sua segurança vem antes de qualquer leitura",
                "O que você escreveu fala de um perigo real, e você merece estar em segurança agora. " +
                "Hoje a Moira não vai tirar cartas: este momento pede apoio de pessoas que podem agir. " +
                "Se puder, procure um lugar seguro e fale com alguém de confiança.",
                [Police, WomenLine, Cvv]);
        }

        return new SupportMessage(
            "Antes das cartas, você",
            "Obrigada por confiar o que você está sentindo. Parece que você está passando por algo muito pesado, " +
            "e você não precisa atravessar isso sem apoio. Hoje a Moira não vai tirar cartas: " +
            "o que você está vivendo merece o cuidado de uma pessoa, agora. " +
            "Conversar com o CVV é gratuito e sigiloso, a qualquer hora.",
            [Cvv, Samu, Police]);
    }
}
