using Moira.Backend.Models;

namespace Moira.Backend.Services;

public sealed class DrawService
{
    private static readonly DrawPosition[] Positions =
    {
        DrawPosition.WhatWeighs,
        DrawPosition.WhatIsHidden,
        DrawPosition.NextMove
    };

    public Draw Create(IEnumerable<Card> availableCards, IEnumerable<string> selectedCardIds)
    {
        var selections = selectedCardIds.ToArray();

        if (selections.Length != Positions.Length)
        {
            throw new ArgumentException("Uma tiragem precisa conter exatamente três cartas.");
        }

        var cardsById = availableCards
            .DistinctBy(card => card.Id)
            .ToDictionary(card => card.Id);

        var drawnCards = selections.Select((cardId, index) =>
        {
            if (!cardsById.TryGetValue(cardId, out var card))
            {
                throw new ArgumentException($"A carta selecionada '{cardId}' não está disponível.");
            }

            return new DrawnCard(card, Positions[index], index + 1);
        });

        return new Draw(drawnCards);
    }
}
