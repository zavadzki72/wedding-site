using LifeEssentials.WebApi.Data;
using LifeEssentials.WebApi.Dtos.GuestDtos;
using LifeEssentials.WebApi.Models;
using MongoDB.Driver;

namespace LifeEssentials.WebApi.Services
{
    public class GuestService
    {
        private readonly MongoContext _context;

        public GuestService(MongoContext context)
        {
            _context = context;
        }

        public async Task<GuestInvitesResponse> GetInviteById(Guid id)
        {
            var invite = await _context.Invites
                .Find(x => x.Id == id)
                .Project(x => new GuestInvitesResponse
                {
                    FamilyName = x.FamilyName,
                    CelNumber = x.CelNumber,
                    Persons = x.Names,
                    InviteUrl = x.InviteUrl,
                    IsResponded = x.IsResponded,
                    IsSent = x.IsSent
                })
                .FirstOrDefaultAsync();

            return invite ?? throw new KeyNotFoundException("Invite not found");
        }

        public async Task<List<GuestInvitesResponse>> GetPendingInvites()
        {
            var pendingInvites = await _context.Invites
                .Find(x => !x.IsResponded)
                .Project(x => new GuestInvitesResponse
                {
                    FamilyName = x.FamilyName,
                    CelNumber = x.CelNumber,
                    Persons = x.Names,
                    InviteUrl = x.InviteUrl,
                    IsResponded = x.IsResponded,
                    IsSent = x.IsSent
                })
                .ToListAsync();

            return pendingInvites;
        }

        public async Task<List<GuestInvitesResponse>> GetRespondedInvites()
        {
            var respondedInvites = await _context.Invites
                .Find(x => x.IsResponded)
                .Project(x => new GuestInvitesResponse
                {
                    FamilyName = x.FamilyName,
                    CelNumber = x.CelNumber,
                    Persons = x.Names,
                    InviteUrl = x.InviteUrl,
                    IsResponded = x.IsResponded,
                    IsSent = x.IsSent
                })
                .ToListAsync();

            return respondedInvites;
        }

        public async Task<List<GuestInvitesResponse>> GetAllInvites()
        {
            var invites = await _context.Invites
                .Find(_ => true)
                .Project(x => new GuestInvitesResponse
                {
                    FamilyName = x.FamilyName,
                    CelNumber = x.CelNumber,
                    Persons = x.Names,
                    InviteUrl = x.InviteUrl,
                    IsResponded = x.IsResponded,
                    IsSent = x.IsSent
                })
                .ToListAsync();

            return invites;
        }

        public async Task ReplyInvite(ReplyInviteDto dto)
        {
            var invite = await _context.Invites.Find(x => x.Id == dto.InviteId).FirstOrDefaultAsync() 
                ?? throw new KeyNotFoundException("Invite not found");

            if(invite.IsResponded)
                throw new InvalidOperationException("This invite has already been responded to");

            if (invite.Names.Count != dto.Persons.Count)
                throw new ArgumentException("The number of persons does not match the invite");

            var guest = new Guest(invite.FamilyName);

            foreach (var person in dto.Persons)
            {
                guest.AddPerson(person.Name, person.BirthDate, person.Cpf, person.IsAccepted);
            }

            await _context.Guests.InsertOneAsync(guest);

            invite.MarkAsSent();
            invite.MarkAsResponded();
            await _context.Invites.ReplaceOneAsync(x => x.Id == invite.Id, invite);
        }

        public async Task SentInvite(Guid inviteId)
        {
            var invite = await _context.Invites.Find(x => x.Id == inviteId).FirstOrDefaultAsync()
                ?? throw new KeyNotFoundException("Invite not found");

            if (invite.IsSent)
                return;

            invite.MarkAsSent();
            await _context.Invites.ReplaceOneAsync(x => x.Id == invite.Id, invite);
        }

        public async Task<List<GuestResponse>> GetAllGuests()
        {
            var guests = await _context.Guests
                .Find(_ => true)
                .Project(x => new GuestResponse
                {
                    FamilyName = x.FamilyName,
                    Persons = x.Persons
                        .Select(p => new GuestPersonResponse
                        {
                            Name = p.Name,
                            BirthDate = p.BirthDate,
                            Cpf = p.Cpf,
                            IsAccepted = p.IsAccepted
                        })
                        .ToList()
                })
                .ToListAsync();

            return guests;
        }

        public async Task<List<GuestResponse>> GetAcceptedGuests()
        {
            var guests = await _context.Guests
                .Find(x => x.Persons.Any(p => p.IsAccepted))
                .Project(x => new GuestResponse
                {
                    FamilyName = x.FamilyName,
                    Persons = x.Persons
                        .Where(p => p.IsAccepted)
                        .Select(p => new GuestPersonResponse
                        {
                            Name = p.Name,
                            BirthDate = p.BirthDate,
                            Cpf = p.Cpf,
                            IsAccepted = p.IsAccepted
                        })
                        .ToList()
                })
                .ToListAsync();

            return guests;
        }

        public async Task<List<GuestResponse>> GetRefusedGuests()
        {
            var guests = await _context.Guests
                .Find(x => x.Persons.Any(p => !p.IsAccepted))
                .Project(x => new GuestResponse
                {
                    FamilyName = x.FamilyName,
                    Persons = x.Persons
                        .Where(p => !p.IsAccepted)
                        .Select(p => new GuestPersonResponse
                        {
                            Name = p.Name,
                            BirthDate = p.BirthDate,
                            Cpf = p.Cpf,
                            IsAccepted = p.IsAccepted
                        })
                        .ToList()
                })
                .ToListAsync();

            return guests;
        }
    }
}
