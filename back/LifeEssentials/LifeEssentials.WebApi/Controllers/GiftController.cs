using LifeEssentials.WebApi.Dtos.Gifts;
using LifeEssentials.WebApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LifeEssentials.WebApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class GiftController(GiftService service) : ControllerBase
    {
        private readonly GiftService _service = service;

        [HttpGet("products")]
        public async Task<IActionResult> GetProducts([FromQuery] GetProductsDto dto)
        {
            var result = await _service.GetPagedProducts(dto);
            return Ok(new { Data = result });
        }

        [HttpGet("products/avaliable")]
        [AllowAnonymous]
        public async Task<IActionResult> GetAvaliableProducts([FromQuery] GetProductsDto dto)
        {
            dto.SetOnlyAvailable();
            var result = await _service.GetPagedProducts(dto);
            return Ok(new { Data = result });
        }

        [HttpGet("products/{id:guid}")]
        public async Task<IActionResult> GetProductById(Guid id)
        {
            var result = await _service.GetProductById(id);
            return Ok(new { Data = result });
        }

        [HttpPost("products")]
        public async Task<IActionResult> CreateProduct([FromBody] CreateProductDto dto)
        {
            await _service.CreateProduct(dto);
            return NoContent();
        }

        [HttpPut("products/{id:guid}")]
        public async Task<IActionResult> UpdateProduct(Guid id, [FromBody] UpdateProductDto dto)
        {
            await _service.UpdateProduct(id, dto);
            return NoContent();
        }

        [HttpPut("purchases/{id:guid}/mark-as-sold")]
        [AllowAnonymous]
        public async Task<IActionResult> MarkAsSold(Guid id, [FromBody] string paymentId)
        {
            await _service.MarkAsSold(id, paymentId);
            return NoContent();
        }

        [HttpDelete("products/{id:guid}")]
        public async Task<IActionResult> DeleteProduct(Guid id)
        {
            await _service.DeleteProduct(id);
            return NoContent();
        }

        [HttpPost("products/buy")]
        [AllowAnonymous]
        public async Task<IActionResult> BuyProduct([FromBody] BuyProductsDto dto)
        {
            var result = await _service.BuyProduct(dto);
            return Ok(new { Data = result });
        }
    }
}
