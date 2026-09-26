namespace Moira.Backend.Services.Readings;

public interface IReadingStore
{
    void Add(ReadingRecord record);

    /// <summary>Busca a leitura garantindo que pertence à sessão informada.</summary>
    ReadingRecord? Find(string readingId, string sessionId);
}
