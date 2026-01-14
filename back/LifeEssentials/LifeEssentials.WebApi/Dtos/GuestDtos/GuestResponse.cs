namespace LifeEssentials.WebApi.Dtos.GuestDtos
{
    public class GuestResponse
    {
        public required string FamilyName { get; set; }
        public required List<GuestPersonResponse> Persons { get; set; }
    }

    public class GuestPersonResponse
    {
        public required string Name { get; init; }
        public DateTime? BirthDate { get; init; }
        public string? Cpf { get; init; }
        public required bool IsAccepted { get; init; }
    }
}
