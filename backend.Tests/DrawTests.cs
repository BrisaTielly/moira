using Moira.Backend.Models;

namespace Moira.Backend.Tests;

public class DrawTests
{
    private static readonly Card FirstCard = new("first", "Primeira", "Primeiro significado");
    private static readonly Card SecondCard = new("second", "Segunda", "Segundo significado");
    private static readonly Card ThirdCard = new("third", "Terceira", "Terceiro significado");

    [Fact]
    public void Constructor_RejectsAQuantityOtherThanThree()
    {
        var cards = new[]
        {
            new DrawnCard(FirstCard, DrawPosition.WhatWeighs, 1),
            new DrawnCard(SecondCard, DrawPosition.WhatIsHidden, 2)
        };

        var exception = Assert.Throws<ArgumentException>(() => new Draw(cards));

        Assert.Equal("Uma tiragem precisa conter exatamente três cartas.", exception.Message);
    }

    [Fact]
    public void Constructor_RejectsRepeatedCards()
    {
        var cards = new[]
        {
            new DrawnCard(FirstCard, DrawPosition.WhatWeighs, 1),
            new DrawnCard(FirstCard, DrawPosition.WhatIsHidden, 2),
            new DrawnCard(ThirdCard, DrawPosition.NextMove, 3)
        };

        var exception = Assert.Throws<ArgumentException>(() => new Draw(cards));

        Assert.Equal("Uma carta não pode aparecer mais de uma vez na tiragem.", exception.Message);
    }

    [Fact]
    public void Constructor_RejectsPositionsOutsideTheExpectedOrder()
    {
        var cards = new[]
        {
            new DrawnCard(FirstCard, DrawPosition.WhatIsHidden, 1),
            new DrawnCard(SecondCard, DrawPosition.WhatWeighs, 2),
            new DrawnCard(ThirdCard, DrawPosition.NextMove, 3)
        };

        var exception = Assert.Throws<ArgumentException>(() => new Draw(cards));

        Assert.Equal("A tiragem precisa conter as três posições na ordem correta.", exception.Message);
    }
}
