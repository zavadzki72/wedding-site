using System.Text.Json.Serialization;

namespace LifeEssentials.WebApi.Dtos.Webhook
{
    public class MercadoPagoWebhookPayload
    {
        [JsonPropertyName("action")]
        public string? Action { get; set; }

        [JsonPropertyName("api_version")]
        public string? ApiVersion { get; set; }

        [JsonPropertyName("data")]
        public WebhookData? Data { get; set; }

        [JsonPropertyName("date_created")]
        public DateTime? DateCreated { get; set; }

        [JsonPropertyName("id")]
        public string? EventId { get; set; }

        [JsonPropertyName("live_mode")]
        public bool LiveMode { get; set; }

        [JsonPropertyName("type")]
        public string? Type { get; set; }

        [JsonPropertyName("user_id")]
        public long? UserId { get; set; }
    }

    public class WebhookData
    {
        [JsonPropertyName("id")]
        public string? EventDataId { get; set; }
    }
}