using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Moira.Backend.Infrastructure.Entities;

namespace Moira.Backend.Infrastructure.Configurations;

public sealed class DrawnCardConfiguration : IEntityTypeConfiguration<DrawnCardEntity>
{
    public void Configure(EntityTypeBuilder<DrawnCardEntity> builder)
    {
        builder.ToTable("drawn_cards");

        builder.HasKey(card => new { card.ReadingId, card.Order });

        builder.Property(card => card.ReadingId)
            .HasMaxLength(64);

        builder.Property(card => card.CardId)
            .HasMaxLength(32);

        builder.HasOne(card => card.Card)
            .WithMany()
            .HasForeignKey(card => card.CardId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
