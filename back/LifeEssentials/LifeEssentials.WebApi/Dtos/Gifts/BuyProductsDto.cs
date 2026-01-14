namespace LifeEssentials.WebApi.Dtos.Gifts
{
    public record BuyProductsDto
    {
        public required List<Guid> Products { get; init; }
        public required string Name { get; init; }
        public required string Message { get; set; }
    }
}
