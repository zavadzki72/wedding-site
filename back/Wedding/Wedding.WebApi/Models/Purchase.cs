using LifeEssentials.WebApi.Models.Enumerators;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace LifeEssentials.WebApi.Models
{
    public class Purchase
    {
        public Purchase(List<GiftProduct> products, string name, string message)
        {
            Name = name;
            Message = message;
            Products = products;

            Status = PurchaseStatus.PENDING;
            CreateAt = DateTime.UtcNow;
            UpdatedAt = DateTime.UtcNow;
        }

        [BsonId]
        [BsonRepresentation(BsonType.String)]
        public Guid Id { get; set; }

        [BsonElement("name")]
        public string Name { get; private set; }

        [BsonElement("message")]
        public string Message { get; private set; }

        [BsonElement("status")]
        public PurchaseStatus Status { get; private set; }

        [BsonElement("create_at")]
        public DateTime CreateAt { get; private set; }

        [BsonElement("updated_at")]
        public DateTime UpdatedAt { get; private set; }

        [BsonElement("products")]
        public List<GiftProduct> Products { get; private set; }

        public void UpdateStatus(PurchaseStatus status)
        {
            Status = status;
            UpdatedAt = DateTime.UtcNow;
        }
    }
}
