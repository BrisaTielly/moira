using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Moira.Backend.Infrastructure.Entities;

namespace Moira.Backend.Infrastructure.Configurations;

public sealed class CardEntityConfiguration : IEntityTypeConfiguration<CardEntity>
{
    public void Configure(EntityTypeBuilder<CardEntity> builder)
    {
        builder.ToTable("cards");

        builder.HasKey(card => card.Id);

        builder.Property(card => card.Id)
            .HasMaxLength(32);

        // IDs e nomes idênticos aos arcanos já utilizados no frontend (arcana.ts, SAMPLE_SPREAD)
        builder.HasData(
            new CardEntity
            {
                Id = "star",
                Name = "A Estrela",
                Meaning = "Esperança e renovação: um caminho mais leve se abre à sua frente."
            },
            new CardEntity
            {
                Id = "strength",
                Name = "A Força",
                Meaning = "Coragem serena para enfrentar o que pesa."
            },
            new CardEntity
            {
                Id = "world",
                Name = "O Mundo",
                Meaning = "Ciclo completo: aquilo que você buscou encontra realização."
            });
    }
}
