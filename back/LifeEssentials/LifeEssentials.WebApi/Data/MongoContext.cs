using LifeEssentials.WebApi.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace LifeEssentials.WebApi.Data
{
    public class MongoContext
    {
        private readonly IMongoDatabase _database;

        public MongoContext(IOptions<MongoDbSettings> settings)
        {
            var client = new MongoClient(settings.Value.ConnectionString);
            _database = client.GetDatabase(settings.Value.DatabaseName);
        }

        public IMongoCollection<Manager> Managers => _database.GetCollection<Manager>("managers");
        public IMongoCollection<GuestInvite> Invites => _database.GetCollection<GuestInvite>("guest_invites");
        public IMongoCollection<Guest> Guests => _database.GetCollection<Guest>("guests");
        public IMongoCollection<GiftProduct> GiftProducts => _database.GetCollection<GiftProduct>("gift_products");
        public IMongoCollection<Purchase> Purchases => _database.GetCollection<Purchase>("purchases");
        public IMongoCollection<MercadoPagoEvent> MercadoPagoEvents => _database.GetCollection<MercadoPagoEvent>("mercado_pago_events");
    }
}
