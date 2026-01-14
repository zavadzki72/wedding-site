using LifeEssentials.WebApi.Data;
using LifeEssentials.WebApi.Dtos;
using LifeEssentials.WebApi.Dtos.ManagerDtos;
using LifeEssentials.WebApi.Helpers;
using LifeEssentials.WebApi.Models;
using MongoDB.Driver;
using System.ComponentModel;

namespace LifeEssentials.WebApi.Services
{
    public class ManagerService
    {
        private readonly MongoContext _context;
        private readonly IConfiguration _configuration;

        public ManagerService(MongoContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<string> GetToken(LoginDto request)
        {
            var user = await _context.Managers.Find(x => x.Email == request.Email).FirstOrDefaultAsync();

            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.Password))
                throw new UnauthorizedAccessException();

            var token = JwtHelper.GenerateToken(user.Email, _configuration);
            return token;
        }

        public async Task<string> GenerateGuestInvite(GenerateGuestInviteDto dto)
        {
            var existingInvite = await _context.Invites
                .Find(x => x.FamilyName == dto.FamilyName)
                .FirstOrDefaultAsync();

            if(existingInvite != null)
                throw new ArgumentException("An invite with this family name already exists.");

            var invite = new GuestInvite(dto.FamilyName, dto.CelNumber, dto.Names);
            await _context.Invites.InsertOneAsync(invite);

            return invite.InviteUrl;
        }

        public async Task<string> UpdateGuestInvite(Guid id, UpdateGuestInviteDto dto)
        {
            var invite = await _context.Invites.Find(x => x.Id == id).FirstOrDefaultAsync() 
                ?? throw new ArgumentException("Invite not found");

            invite.UpdateDetails(dto.FamilyName, dto.CelNumber, dto.Names, dto.IsSent);

            await _context.Invites.FindOneAndReplaceAsync(x => x.Id == id, invite);

            return invite.InviteUrl;
        }

        public async Task<string> ResetReplyInvite(Guid id)
        {
            var invite = await _context.Invites.Find(x => x.Id == id).FirstOrDefaultAsync()
                ?? throw new ArgumentException("Invite not found");

            invite.ResetResponse();

            await _context.Invites.FindOneAndReplaceAsync(x => x.Id == id, invite);
            await _context.Guests.DeleteOneAsync(x => x.FamilyName == invite.FamilyName);

            return invite.InviteUrl;
        }

        public async Task RemoveInvite(Guid id)
        {
            await _context.Invites.DeleteOneAsync(x => x.Id == id);
        }
    }
}
