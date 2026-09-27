using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Moira.Backend.Infrastructure.Entities;

namespace Moira.Backend.Infrastructure.Configurations;

public sealed class TemporaryUserConfiguration : IEntityTypeConfiguration<TemporaryUserEntity>
{
    public void Configure(EntityTypeBuilder<TemporaryUserEntity> builder)
    {
        builder.ToTable("temporary_users");

        builder.HasKey(user => user.SessionId);

        builder.Property(user => user.SessionId)
            .HasMaxLength(64);
    }
}
