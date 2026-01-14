using LifeEssentials.WebApi.Models.Enumerators;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace LifeEssentials.WebApi.Models
{
    public class GiftProduct
    {
        public GiftProduct()
        {
            Name = string.Empty;
            Photo = string.Empty;
        }

        public GiftProduct(string name, string photo, Category category, decimal value)
        {
            Name = name;
            Photo = photo;
            Category = category;
            Value = value;

            Id = Guid.NewGuid();
            IsSold = false;
        }

        [BsonId]
        [BsonRepresentation(BsonType.String)]
        public Guid Id { get; set; }

        [BsonElement("name")]
        public string Name { get; private set; }

        [BsonElement("photo")]
        public string Photo { get; private set; }

        [BsonElement("category")]
        public Category Category { get; private set; }

        [BsonElement("value")]
        public decimal Value { get; private set; }

        [BsonElement("is_sold")]
        public bool IsSold { get; private set; }

        public void UpdateDetails(string name, string photo, Category category, decimal value)
        {
            Name = name;
            Photo = photo;
            Category = category;
            Value = value;
        }

        public void MarkAsSold()
        {
            IsSold = true;
        }
    }
}
