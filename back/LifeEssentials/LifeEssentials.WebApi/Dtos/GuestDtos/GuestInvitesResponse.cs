namespace LifeEssentials.WebApi.Dtos.GuestDtos
{
    public record GuestInvitesResponse
    {
        public required string FamilyName { get; init; }
        public required string CelNumber { get; init; }
        public required List<string> Persons { get; init; }
        public required string InviteUrl { get; init; }
        public required bool IsResponded { get; init; }
        public required bool IsSent { get; init; }
    }
}
