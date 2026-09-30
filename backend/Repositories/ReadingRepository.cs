using Microsoft.EntityFrameworkCore;
using Moira.Backend.Infrastructure;
using Moira.Backend.Infrastructure.Entities;
using Moira.Backend.Models;

namespace Moira.Backend.Repositories;

public sealed class ReadingRepository(MoiraDbContext dbContext) : IReadingRepository
{
    public async Task<IReadOnlyList<Card>> GetAvailableCardsAsync(CancellationToken cancellationToken = default)
    {
        var cards = await dbContext.Cards.ToListAsync(cancellationToken);

        return cards
            .Select(card => new Card(card.Id, card.Name, card.Meaning))
            .ToList();
    }

    public async Task<TemporaryUser?> FindTemporaryUserAsync(string sessionId, CancellationToken cancellationToken = default)
    {
        var user = await dbContext.TemporaryUsers
            .AsNoTracking()
            .FirstOrDefaultAsync(candidate => candidate.SessionId == sessionId, cancellationToken);

        return user is null
            ? null
            : new TemporaryUser(
                SessionId: user.SessionId,
                UserName: user.UserName,
                CreatedAt: user.CreatedAt);
    }

    public async Task SaveReadingAsync(TemporaryUser temporaryUser, Reading reading, CancellationToken cancellationToken = default)
    {
        var user = await dbContext.TemporaryUsers.FindAsync([temporaryUser.SessionId], cancellationToken);

        if (user is null)
        {
            dbContext.TemporaryUsers.Add(new TemporaryUserEntity
            {
                SessionId = temporaryUser.SessionId,
                UserName = temporaryUser.UserName,
                CreatedAt = temporaryUser.CreatedAt
            });
        }
        else
        {
            user.UserName = temporaryUser.UserName;
        }

        dbContext.Draws.Add(new DrawEntity
        {
            ReadingId = reading.ReadingId,
            SessionId = temporaryUser.SessionId,
            Question = reading.Question,
            CreatedAt = reading.CreatedAt,
            Cards = reading.Cards.Select(drawnCard => new DrawnCardEntity
            {
                ReadingId = reading.ReadingId,
                CardId = drawnCard.Card.Id,
                Position = drawnCard.Position,
                Order = drawnCard.Order
            }).ToList()
        });

        await dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task<Reading?> FindReadingAsync(string readingId, string sessionId, CancellationToken cancellationToken = default)
    {
        var draw = await dbContext.Draws
            .AsNoTracking()
            .Include(candidate => candidate.Cards)
            .ThenInclude(card => card.Card)
            .FirstOrDefaultAsync(candidate =>
                candidate.ReadingId == readingId && candidate.SessionId == sessionId, cancellationToken);

        if (draw is null)
        {
            return null;
        }

        return new Reading(
            ReadingId: draw.ReadingId,
            SessionId: draw.SessionId,
            Question: draw.Question,
            CreatedAt: draw.CreatedAt,
            Cards: draw.Cards
                .OrderBy(card => card.Order)
                .Select(card => new DrawnCard(
                    Card: new Card(card.Card.Id, card.Card.Name, card.Card.Meaning),
                    Position: card.Position,
                    Order: card.Order))
                .ToList()
        );
    }
}
