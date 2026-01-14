using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace LifeEssentials.WebApi.Models
{
    public class GuestInvite
    {
        public GuestInvite()
        {
            FamilyName = string.Empty;
            InviteUrl = string.Empty;
            CelNumber = string.Empty;
        }

        public GuestInvite(string familyName, string celNumber, List<string> names)
        {
            Id = Guid.NewGuid();

            FamilyName = familyName;
            CelNumber = celNumber;
            Names = names;

            IsResponded = false;
            IsSent = false;
            InviteUrl = GenerateInviteUrl();
        }

        [BsonId]
        [BsonRepresentation(BsonType.String)]
        public Guid Id { get; private set; }

        [BsonElement("family_name")]
        public string FamilyName { get; private set; }

        [BsonElement("cel_number")]
        public string CelNumber { get; private set; }

        [BsonElement("names")]
        public List<string> Names { get; private set; } = [];

        [BsonElement("invite_url")]
        public string InviteUrl { get; private set; }

        [BsonElement("is_responded")]
        public bool IsResponded { get; private set; }

        [BsonElement("is_sent")]
        public bool IsSent { get; private set; }

        public void MarkAsResponded()
        {
            IsResponded = true;
        }

        public void MarkAsSent()
        {
            IsSent = true;
        }

        public void ResetResponse()
        {
            IsResponded = false;
        }

        public void UpdateDetails(string familyName, string celNumber, List<string> names, bool isSent)
        {
            FamilyName = familyName;
            CelNumber = celNumber;
            Names = names;
            IsSent = isSent;
        }

        private string GenerateInviteUrl()
        {
            return $"https://casamento.marccusz.com/guest-invite/{Id}";
        }
    }
}
