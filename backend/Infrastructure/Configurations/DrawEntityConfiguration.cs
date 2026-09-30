using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Moira.Backend.Infrastructure.Entities;

namespace Moira.Backend.Infrastructure.Configurations;

public sealed class DrawEntityConfiguration : IEntityTypeConfiguration<DrawEntity>
{
    public void Configure(EntityTypeBuilder<DrawEntity> builder)
    {
        builder.ToTable("draws");

        builder.HasKey(draw => draw.ReadingId);

        builder.Property(draw => draw.ReadingId)
            .HasMaxLength(64);

        builder.Property(draw => draw.SessionId)
            .HasMaxLength(64);

        builder.HasOne<TemporaryUserEntity>()
            .WithMany()
            .HasForeignKey(draw => draw.SessionId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(draw => draw.Cards)
            .WithOne()
            .HasForeignKey(card => card.ReadingId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
