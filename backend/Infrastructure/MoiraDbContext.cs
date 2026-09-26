using Microsoft.EntityFrameworkCore;

namespace Moira.Backend.Infrastructure;

public sealed class MoiraDbContext(DbContextOptions<MoiraDbContext> options)
    : DbContext(options);
