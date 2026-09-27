using Microsoft.EntityFrameworkCore;
using Moira.Backend.Infrastructure.Configurations;
using Moira.Backend.Infrastructure.Entities;

namespace Moira.Backend.Infrastructure;

public sealed class MoiraDbContext(DbContextOptions<MoiraDbContext> options)
    : DbContext(options)
{
    public DbSet<TemporaryUserEntity> TemporaryUsers => Set<TemporaryUserEntity>();

    public DbSet<DrawEntity> Draws => Set<DrawEntity>();

    public DbSet<DrawnCardEntity> DrawnCards => Set<DrawnCardEntity>();

    public DbSet<CardEntity> Cards => Set<CardEntity>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfiguration(new TemporaryUserConfiguration());
        modelBuilder.ApplyConfiguration(new DrawEntityConfiguration());
        modelBuilder.ApplyConfiguration(new DrawnCardConfiguration());
        modelBuilder.ApplyConfiguration(new CardEntityConfiguration());
    }
}
