using LifeEssentials.WebApi.Dtos.Webhook;
using LifeEssentials.WebApi.Services;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace LifeEssentials.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WebhookController : ControllerBase
    {
        private readonly WebhookService _webhookService;
        private readonly IConfiguration _configuration;

        public WebhookController(WebhookService webhookService, IConfiguration configuration)
        {
            _webhookService = webhookService;
            _configuration = configuration;
        }

        [HttpPost]
        public async Task<IActionResult> ReceiveCallback()
        {
            using var reader = new StreamReader(Request.Body);
            var payload = await reader.ReadToEndAsync();

            var headerSignature = Request.Headers["x-signature"].FirstOrDefault();
            var xRequestId = Request.Headers["x-request-id"].FirstOrDefault();
            var secret = _configuration["MercadoPago:Signature"];

            if (!_webhookService.IsValidSignature(payload, headerSignature!, xRequestId!, secret!))
            {
                return Unauthorized();
            }

            var webhookEvent = JsonSerializer.Deserialize<MercadoPagoWebhookPayload>(payload);

            await _webhookService.ProccessCallback(webhookEvent!);
            return Ok();
        }
    }
}
