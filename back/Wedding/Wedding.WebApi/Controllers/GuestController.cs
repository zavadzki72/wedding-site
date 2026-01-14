using LifeEssentials.WebApi.Dtos.GuestDtos;
using LifeEssentials.WebApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LifeEssentials.WebApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class GuestController(GuestService service) : ControllerBase
    {
        private readonly GuestService _service = service;

        [HttpGet("invite/{id:guid}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetPendingInvites(Guid id)
        {
            var result = await _service.GetInviteById(id);
            return Ok(new { Data = result });
        }

        [HttpGet("invite/get-pending")]
        public async Task<IActionResult> GetPendingInvites()
        {
            var result = await _service.GetPendingInvites();
            return Ok(new { Data = result });
        }

        [HttpGet("invite/get-responded")]
        public async Task<IActionResult> GetRespondedInvites()
        {
            var result = await _service.GetRespondedInvites();
            return Ok(new { Data = result });
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _service.GetAllGuests();
            return Ok(new { Data = result });
        }

        [HttpGet("accepted")]
        public async Task<IActionResult> GetAcceptedGuests()
        {
            var result = await _service.GetAcceptedGuests();
            return Ok(new { Data = result });
        }

        [HttpGet("refused")]
        public async Task<IActionResult> GetRefusedGuests()
        {
            var result = await _service.GetRefusedGuests();
            return Ok(new { Data = result });
        }

        [HttpGet("invite/get-all")]
        public async Task<IActionResult> GetAllInvites()
        {
            var result = await _service.GetAllInvites();
            return Ok(new { Data = result });
        }

        [HttpPost("invite/reply")]
        [AllowAnonymous]
        public async Task<IActionResult> ReplyInvite([FromBody] ReplyInviteDto dto)
        {
            await _service.ReplyInvite(dto);
            return NoContent();
        }

        [HttpPost("invite/{id:guid}/sent")]
        public async Task<IActionResult> SentInvite(Guid id)
        {
            await _service.SentInvite(id);
            return NoContent();
        }
    }
}
