using LifeEssentials.WebApi.Models;
using MercadoPago.Client.Payment;
using MercadoPago.Client.Preference;
using MercadoPago.Resource.Payment;

namespace LifeEssentials.WebApi.ExternalServices
{
    public class PaymentService(IConfiguration configuration)
    {
        private readonly IConfiguration _configuration = configuration;

        public async Task<string> MakePaymentUrl(Purchase purchase)
        {
            var items = BuildItems(purchase);
            var urls = BuildUrls();

            var request = new PreferenceRequest
            {
                Items = items,
                BackUrls = urls,
                AutoReturn = "approved",
                ExternalReference = purchase.Id.ToString(),
                Payer = new PreferencePayerRequest
                {
                    Name = purchase.Name
                },
                NotificationUrl = _configuration["MercadoPago:callbackUrl"]
            };

            var client = new PreferenceClient();
            var preference = await client.CreateAsync(request);

            return preference.InitPoint;
        }

        public async Task<Payment?> GetPaymentDetails(long paymentId)
        {
            var paymentClient = new PaymentClient();
            var payment = await paymentClient.GetAsync(paymentId);

            return payment;
        }

        private static List<PreferenceItemRequest> BuildItems(Purchase purchase)
        {
            var items = new List<PreferenceItemRequest>();

            foreach (var product in purchase.Products)
            {
                items.Add(new PreferenceItemRequest
                {
                    Title = product.Name,
                    Quantity = 1,
                    UnitPrice = product.Value,
                    CurrencyId = "BRL"
                });
            }

            return items;
        }

        private PreferenceBackUrlsRequest BuildUrls()
        {
            return new PreferenceBackUrlsRequest
            {
                Success = _configuration["MercadoPago:Purchases:successUrl"],
                Failure = _configuration["MercadoPago:Purchases:failUrl"],
                Pending = _configuration["MercadoPago:Purchases:pendingUrl"]
            };
        }
    }
}
