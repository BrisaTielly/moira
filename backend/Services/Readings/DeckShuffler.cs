using System.Security.Cryptography;
using Moira.Backend.Domain;

namespace Moira.Backend.Services.Readings;

public interface IDeckShuffler
{
    /// <summary>Embaralha os 22 arcanos e devolve as primeiras <paramref name="slots"/> cartas para a mesa.</summary>
    IReadOnlyList<int> DealTable(int slots);
}

/// <summary>Fisher–Yates com gerador criptográfico: o cliente não consegue prever nem forjar a tiragem.</summary>
public sealed class CryptoDeckShuffler : IDeckShuffler
{
    public IReadOnlyList<int> DealTable(int slots)
    {
        var total = ArcanaCatalog.MajorArcana.Count;
        if (slots <= 0 || slots > total) throw new ArgumentOutOfRangeException(nameof(slots));

        var deck = Enumerable.Range(0, total).ToArray();
        for (var i = deck.Length - 1; i > 0; i--)
        {
            var j = RandomNumberGenerator.GetInt32(i + 1);
            (deck[i], deck[j]) = (deck[j], deck[i]);
        }
        return deck.Take(slots).ToArray();
    }
}
