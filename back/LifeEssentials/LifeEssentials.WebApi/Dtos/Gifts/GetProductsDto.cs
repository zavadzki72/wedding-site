using LifeEssentials.WebApi.Models.Enumerators;

namespace LifeEssentials.WebApi.Dtos.Gifts
{
    public record GetProductsDto
    {
        public List<string> Names { get; init; } = [];
        public List<Category> Categories { get; init; } = [];
        public bool OnlyAvailable { get; set; }
        public bool OnlySold { get; init; }

        public void SetOnlyAvailable()
        {
            OnlyAvailable = true;
        }
    }
}
