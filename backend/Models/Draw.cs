namespace Moira.Backend.Models;

public sealed class Draw
{
    private static readonly DrawPosition[] ExpectedPositions =
    {
        DrawPosition.WhatWeighs,
        DrawPosition.WhatIsHidden,
        DrawPosition.NextMove
    };

    public IReadOnlyList<DrawnCard> Cards { get; }

    public Draw(IEnumerable<DrawnCard> cards)
    {
        var orderedCards = cards.OrderBy(card => card.Order).ToArray();

        if (orderedCards.Length != 3)
        {
            throw new ArgumentException("Uma tiragem precisa conter exatamente três cartas.");
        }

        if (orderedCards.Select(card => card.Card.Id).Distinct().Count() != 3)
        {
            throw new ArgumentException("Uma carta não pode aparecer mais de uma vez na tiragem.");
        }

        var hasExpectedOrder = orderedCards
            .Select(card => card.Order)
            .SequenceEqual(new[] { 1, 2, 3 });

        var hasExpectedPositions = orderedCards
            .Select(card => card.Position)
            .SequenceEqual(ExpectedPositions);

        if (!hasExpectedOrder || !hasExpectedPositions)
        {
            throw new ArgumentException("A tiragem precisa conter as três posições na ordem correta.");
        }

        Cards = Array.AsReadOnly(orderedCards);
    }
}
