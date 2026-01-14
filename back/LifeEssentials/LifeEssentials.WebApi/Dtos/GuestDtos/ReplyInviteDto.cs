namespace LifeEssentials.WebApi.Dtos.GuestDtos
{
    public record ReplyInviteDto
    {
        public required Guid InviteId { get; init; }
        public required List<InvitePersons> Persons { get; init; }
    }

    public record InvitePersons
    {
        public required string Name { get; init; }
        public DateTime? BirthDate { get; init; }
        public string? Cpf { get; init; }
        public required bool IsAccepted { get; init; }
    }
}
