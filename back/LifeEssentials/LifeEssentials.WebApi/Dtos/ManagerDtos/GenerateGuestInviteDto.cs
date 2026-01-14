namespace LifeEssentials.WebApi.Dtos.ManagerDtos
{
    public class GenerateGuestInviteDto
    {
        public required string FamilyName { get; set; }
        public required string CelNumber { get; set; }
        public List<string> Names { get; set; } = [];
    }
}
