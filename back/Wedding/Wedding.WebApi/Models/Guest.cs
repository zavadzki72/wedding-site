using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace LifeEssentials.WebApi.Models
{
    public class Guest
    {
        public Guest(string familyName)
        {
            Id = Guid.NewGuid();

            FamilyName = familyName;
            Persons = [];
        }

        [BsonId]
        [BsonRepresentation(BsonType.String)]
        public Guid Id { get; private set; }

        [BsonElement("family_name")]
        public string FamilyName { get; private set; }

        [BsonElement("persons")]
        public List<GuestPerson> Persons { get; private set; }

        public void AddPerson(string name, DateTime? birthDate, string? cpf, bool isAccepted)
        {
            var person = new GuestPerson(name, birthDate, cpf, isAccepted);
            Persons.Add(person);
        }
    }

    public class GuestPerson
    {
        public GuestPerson(string name, DateTime? birthDate, string? cpf, bool isAccepted)
        {
            Name = name;
            BirthDate = birthDate;
            Cpf = cpf;
            IsAccepted = isAccepted;
        }

        [BsonElement("name")]
        public string Name { get; }

        [BsonElement("birth_date")]
        public DateTime? BirthDate { get; }

        [BsonElement("cpf")]
        public string? Cpf { get; }

        [BsonElement("id_accepted")]
        public bool IsAccepted { get; }
    }
}
