using LifeEssentials.WebApi.Data;
using LifeEssentials.WebApi.Dtos.Webhook;
using LifeEssentials.WebApi.ExternalServices;
using LifeEssentials.WebApi.Models;
using LifeEssentials.WebApi.Models.Enumerators;
using MongoDB.Driver;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

namespace LifeEssentials.WebApi.Services
{
    public class WebhookService(MongoContext context, PaymentService paymentService)
    {
        private readonly MongoContext _context = context;
        private readonly PaymentService _paymentService = paymentService;

        public async Task ProccessCallback(MercadoPagoWebhookPayload payload)
        {
            var callbackEvent = new MercadoPagoEvent(payload.Type!, payload.Data?.EventDataId!, payload);
            await _context.MercadoPagoEvents.InsertOneAsync(callbackEvent);

            if (payload.Type != "payment" || payload.Data?.EventDataId == null)
                return;

            if (!long.TryParse(payload.Data.EventDataId, out var paymentId))
                return;

            var payment = await _paymentService.GetPaymentDetails(paymentId);

            if (payment is null)
                return;

            callbackEvent.AddPayment(payment);
            await _context.MercadoPagoEvents.ReplaceOneAsync(x => x.Id == callbackEvent.Id, callbackEvent);

            if (string.IsNullOrEmpty(payment.ExternalReference) || !Guid.TryParse(payment.ExternalReference, out var purchaseId))
                return;

            var status = MapStatus(payment.Status);

            var purchase = await _context.Purchases.Find(x => x.Id == purchaseId).FirstOrDefaultAsync();
            if(purchase is null)
                return;

            purchase!.UpdateStatus(status);

            if(status == PurchaseStatus.PAID)
            {
                purchase!.Products.ForEach(async x =>
                {
                    x.MarkAsSold();
                    await _context.GiftProducts.ReplaceOneAsync(y => y.Id == x.Id, x);
                });
            }

            await _context.Purchases.ReplaceOneAsync(x => x.Id == purchase.Id, purchase);
        }

        public bool IsValidSignature(string payload, string headerSignature, string xRequestId, string secret)
        {
            var parts = headerSignature.Split(',');
            string ts = null!;
            string v1 = null!;
            foreach (var part in parts)
            {
                var kv = part.Split('=');
                if (kv.Length == 2)
                {
                    var key = kv[0].Trim();
                    var value = kv[1].Trim();
                    if (key == "ts") ts = value;
                    if (key == "v1") v1 = value;
                }
            }

            if (string.IsNullOrEmpty(ts) || string.IsNullOrEmpty(v1))
                return false;

            var json = JsonDocument.Parse(payload);
            var dataIdElement = json.RootElement.GetProperty("data").GetProperty("id");

            string dataId = (dataIdElement.ValueKind == JsonValueKind.Number) 
                ? dataIdElement.GetInt64().ToString() 
                : dataIdElement.GetString()!;

            var manifest = $"id:{dataId};request-id:{xRequestId};ts:{ts};";

            var keyBytes = Encoding.UTF8.GetBytes(secret);
            using var hmac = new HMACSHA256(keyBytes);
            var hashBytes = hmac.ComputeHash(Encoding.UTF8.GetBytes(manifest));
            var hashHex = BitConverter.ToString(hashBytes).Replace("-", "").ToLower();

            return hashHex == v1;
        }
        
        private static PurchaseStatus MapStatus(string mpStatus)
        {
            return mpStatus?.ToLower() switch
            {
                "approved" => PurchaseStatus.PAID,
                "pending" => PurchaseStatus.PENDING,
                "cancelled" => PurchaseStatus.CANCELLED,
                "refunded" => PurchaseStatus.REFUNDED,
                _ => PurchaseStatus.PENDING
            };
        }
    }
}
