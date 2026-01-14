using LifeEssentials.WebApi.Models.Enumerators;

namespace LifeEssentials.WebApi.Dtos.Gifts
{
    public record GiftProductResponse
    {
        public required Guid Id { get; init; }
        public required string Name { get; init; }
        public required string Photo { get; init; }
        public required Category Category { get; init; }
        public required decimal Value { get; init; }
        public required bool IsSold { get; init; }
    }
}
