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

    public Draw Create(IEnumerable<Card> selectedCards)
    {
        var drawnCards = selectedCards
            .Select((card, index) => new DrawnCard(card, PositionAt(index), index + 1));

        return new Draw(drawnCards);
    }

    private static DrawPosition PositionAt(int index) =>
        index < Positions.Length ? Positions[index] : (DrawPosition)0;
}
