using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace LifeEssentials.WebApi.Models
{
    public class Manager
    {
        public Manager()
        {
            Email = string.Empty;
            Password = string.Empty;
        }

        public Manager(string email, string password)
        {
            Email = email;
            Password = password;
        }

        [BsonId]
        [BsonRepresentation(BsonType.String)]
        public Guid Id { get; private set; }

        [BsonElement("email")]
        public string Email { get; private set; }

        [BsonElement("password")]
        public string Password { get; private set; }
    }
}
