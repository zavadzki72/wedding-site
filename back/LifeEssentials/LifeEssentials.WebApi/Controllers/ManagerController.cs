using LifeEssentials.WebApi.Dtos;
using LifeEssentials.WebApi.Dtos.ManagerDtos;
using LifeEssentials.WebApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LifeEssentials.WebApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ManagerController(ManagerService service) : ControllerBase
    {
        private readonly ManagerService _service = service;

        [HttpPost("get-token")]
        [AllowAnonymous]
        public async Task<IActionResult> Post(LoginDto request)
        {
            var token = await _service.GetToken(request);
            return Ok(new { Data = token });
        }

        [HttpPost("generate-invite")]
        public async Task<IActionResult> GenerateGuestInvite([FromBody] GenerateGuestInviteDto dto)
        {
            var url = await _service.GenerateGuestInvite(dto);
            return Ok(new {Data = url});
        }

        [HttpPut("update-invite/{id:guid}")]
        public async Task<IActionResult> UpdateGuestInvite(Guid id, [FromBody] UpdateGuestInviteDto dto)
        {
            var url = await _service.UpdateGuestInvite(id, dto);
            return Ok(new { Data = url });
        }

        [HttpPut("reset-reply-invite/{id:guid}")]
        public async Task<IActionResult> ResetReplyInvite(Guid id)
        {
            var url = await _service.ResetReplyInvite(id);
            return Ok(new { Data = url });
        }

        [HttpDelete("remove-invite/{id:guid}")]
        public async Task<IActionResult> RemoveInvite(Guid id)
        {
            await _service.RemoveInvite(id);
            return NoContent();
        }
    }
}
