using Moira.Backend.Domain;
using Moira.Backend.Services.Safety;

namespace Moira.Backend.Models;

public static class Mapping
{
    public static DrawnCardDto ToDto(this DrawnCard drawn) => new(
        drawn.Position.Index,
        drawn.Position.Title,
        drawn.Position.Meaning,
        drawn.Card.Number,
        drawn.Card.Numeral,
        drawn.Card.Name,
        drawn.Card.Keywords);

    public static SupportMessageDto ToDto(this SupportMessage message) => new(
        message.Title,
        message.Message,
        message.Resources.Select(r => new SupportResourceDto(r.Name, r.Contact, r.Description)).ToList());
}
