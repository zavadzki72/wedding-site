using LifeEssentials.WebApi.Models.Enumerators;

namespace LifeEssentials.WebApi.Dtos.Gifts
{
    public class UpdateProductDto
    {
        public required string Name { get; init; }
        public required string Photo { get; init; }
        public required Category Category { get; init; }
        public required decimal Value { get; init; }
    }
}
