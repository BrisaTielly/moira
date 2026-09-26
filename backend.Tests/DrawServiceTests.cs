using Moira.Backend.Models;
using Moira.Backend.Services;

namespace Moira.Backend.Tests;

public class DrawServiceTests
{
    [Fact]
    public void Create_MapsTheThreeSelectionsToTheirPositionsInOrder()
    {
        var service = new DrawService();
        var selectedCards = CreateCards(3);

        var draw = service.Create(selectedCards);

        Assert.Collection(
            draw.Cards,
            first =>
            {
                Assert.Equal(selectedCards[0], first.Card);
                Assert.Equal(1, first.Order);
                Assert.Equal(DrawPosition.WhatWeighs, first.Position);
            },
            second =>
            {
                Assert.Equal(selectedCards[1], second.Card);
                Assert.Equal(2, second.Order);
                Assert.Equal(DrawPosition.WhatIsHidden, second.Position);
            },
            third =>
            {
                Assert.Equal(selectedCards[2], third.Card);
                Assert.Equal(3, third.Order);
                Assert.Equal(DrawPosition.NextMove, third.Position);
            });
    }

    [Fact]
    public void Create_RejectsRepeatedSelections()
    {
        var service = new DrawService();
        var cards = CreateCards(2);

        var exception = Assert.Throws<ArgumentException>(() =>
            service.Create(new[] { cards[0], cards[1], cards[0] }));

        Assert.Equal("Uma carta não pode aparecer mais de uma vez na tiragem.", exception.Message);
    }

    [Fact]
    public void Create_RequiresExactlyThreeSelections()
    {
        var service = new DrawService();

        var exception = Assert.Throws<ArgumentException>(() => service.Create(CreateCards(2)));

        Assert.Equal("Uma tiragem precisa conter exatamente três cartas.", exception.Message);
    }

    private static IReadOnlyList<Card> CreateCards(int count) =>
        Enumerable.Range(1, count)
            .Select(index => new Card($"card-{index}", $"Carta {index}", $"Significado {index}"))
            .ToArray();
}
