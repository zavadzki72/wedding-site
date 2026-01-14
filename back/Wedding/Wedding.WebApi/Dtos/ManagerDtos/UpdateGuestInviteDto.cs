namespace LifeEssentials.WebApi.Dtos.ManagerDtos
{
    public class UpdateGuestInviteDto
    {
        public required string FamilyName { get; set; }
        public required string CelNumber { get; set; }
        public List<string> Names { get; set; } = [];
        public bool IsSent { get; set; }
    }
}
