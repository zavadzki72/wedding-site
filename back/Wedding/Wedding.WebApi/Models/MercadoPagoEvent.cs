using LifeEssentials.WebApi.Dtos.Webhook;
using MercadoPago.Resource.Payment;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Text.Json;

namespace LifeEssentials.WebApi.Models
{
    public class MercadoPagoEvent
    {
        public MercadoPagoEvent()
        {
            Topic = string.Empty;
            ResourceId = string.Empty;
        }

        public MercadoPagoEvent(string topic, string resourceId, MercadoPagoWebhookPayload rawBody)
        {
            Id = Guid.NewGuid();

            Topic = topic;
            ResourceId = resourceId;
            ReceivedAt = DateTime.UtcNow;
            RawBody = new RawBody(
                rawBody.Action,
                rawBody.ApiVersion,
                new RawBodyData(rawBody.Data?.EventDataId),
                rawBody.DateCreated,
                rawBody.EventId,
                rawBody.LiveMode,
                rawBody.Type,
                rawBody.UserId
            );
        }

        [BsonId]
        [BsonRepresentation(BsonType.String)]
        public Guid Id { get; private set; }

        [BsonElement("received_at")]
        public DateTime ReceivedAt { get; private set; }

        [BsonElement("topic")]
        public string Topic { get; private set; }

        [BsonElement("resource_id")]
        public string ResourceId { get; private set; }

        [BsonElement("raw_body")]
        public RawBody? RawBody { get; private set; }

        [BsonElement("payment")]
        public string? Payment { get; private set; }

        public void AddPayment(Payment payment)
        {
            Payment = JsonSerializer.Serialize(payment);
        }
    }

    public class RawBody(string? action, string? apiVersion, RawBodyData? data, DateTime? dateCreated, string? eventId, bool liveMode, string? type, long? userId)
    {
        [BsonElement("action")]
        public string? Action { get; set; } = action;

        [BsonElement("api_version")]
        public string? ApiVersion { get; set; } = apiVersion;

        [BsonElement("data")]
        public RawBodyData? Data { get; set; } = data;

        [BsonElement("date_created")]
        public DateTime? DateCreated { get; set; } = dateCreated;

        [BsonElement("event_id")]
        public string? EventId { get; set; } = eventId;

        [BsonElement("live_mode")]
        public bool LiveMode { get; set; } = liveMode;

        [BsonElement("type")]
        public string? Type { get; set; } = type;

        [BsonElement("user_id")]
        public long? UserId { get; set; } = userId;
    }

    public class RawBodyData(string? eventDataId)
    {
        [BsonElement("event_data_id")]
        public string? EventDataId { get; set; } = eventDataId;
    }
}
