using LifeEssentials.WebApi.Data;
using LifeEssentials.WebApi.Dtos.Gifts;
using LifeEssentials.WebApi.ExternalServices;
using LifeEssentials.WebApi.Models;
using LifeEssentials.WebApi.Models.Enumerators;
using MongoDB.Driver;
using System.Drawing.Printing;

namespace LifeEssentials.WebApi.Services
{
    public class GiftService(MongoContext context, PaymentService paymentService)
    {
        private readonly MongoContext _context = context;
        private readonly PaymentService _paymentService = paymentService;

        public async Task<List<GiftProductResponse>> GetPagedProducts(GetProductsDto dto)
        {
            var filterBuilder = Builders<GiftProduct>.Filter;
            var filter = filterBuilder.Empty;

            if(dto.Names.Count != 0)
            {
                filter &= filterBuilder.In(x => x.Name, dto.Names);
            }

            if (dto.Categories.Count != 0)
            {
                filter &= filterBuilder.In(x => x.Category, dto.Categories);
            }

            if (dto.OnlySold)
            {
                filter &= filterBuilder.Eq(x => x.IsSold, true);
            }

            if (dto.OnlyAvailable)
            {
                filter &= filterBuilder.Eq(x => x.IsSold, false);
            }

            var products = await _context.GiftProducts
                .Find(filter)
                .Project(x => new GiftProductResponse
                {
                    Id = x.Id,
                    Name = x.Name,
                    Photo = x.Photo,
                    Category = x.Category,
                    Value = x.Value,
                    IsSold = x.IsSold
                })
                .ToListAsync();

            return products;
        }

        public async Task<GiftProductResponse> GetProductById(Guid id)
        {
            var product = await _context.GiftProducts
                .Find(x => x.Id == id)
                .Project(x => new GiftProductResponse
                {
                    Id = x.Id,
                    Name = x.Name,
                    Photo = x.Photo,
                    Category = x.Category,
                    Value = x.Value,
                    IsSold = x.IsSold
                })
                .FirstOrDefaultAsync()
                    ?? throw new ArgumentException("Product not found");

            return product;
        }

        public async Task CreateProduct(CreateProductDto dto)
        {
            var product = new GiftProduct(dto.Name, dto.Photo, dto.Category, dto.Value);
            await _context.GiftProducts.InsertOneAsync(product);
        }

        public async Task UpdateProduct(Guid id, UpdateProductDto dto)
        {
            var product = await _context.GiftProducts.Find(x => x.Id == id).FirstOrDefaultAsync()
                ?? throw new ArgumentException("Product not found");

            if (product.IsSold)
            {
                throw new InvalidOperationException("Cannot update a product that has been sold");
            }

            product.UpdateDetails(dto.Name, dto.Photo, dto.Category, dto.Value);

            await _context.GiftProducts.FindOneAndReplaceAsync(x => x.Id == id, product);
        }

        public async Task DeleteProduct(Guid id)
        {
            await _context.GiftProducts.DeleteOneAsync(x => x.Id == id);
        }

        public async Task MarkAsSold(Guid id, string paymentId)
        {
            var payment = await _paymentService.GetPaymentDetails(long.Parse(paymentId));

            if(payment == null || payment.Status != "approved")
            {
                throw new ArgumentException("Payment is not approved on mercado pago gateway");
            }

            var purchase = await _context.Purchases.Find(x => x.Id == id).FirstOrDefaultAsync()
                ?? throw new ArgumentException("Purchase not found");

            purchase.Products.ForEach(async x => {
                x.MarkAsSold();
                await _context.GiftProducts.ReplaceOneAsync(y => y.Id == x.Id, x);
            });

            purchase.UpdateStatus(PurchaseStatus.PAID);
            await _context.Purchases.ReplaceOneAsync(x => x.Id == purchase.Id, purchase);
        }

        public async Task<string> BuyProduct(BuyProductsDto buyProductsDto)
        {
            var products = await _context.GiftProducts
                .Find(x => buyProductsDto.Products.Contains(x.Id))
                .ToListAsync();

            if (products.Count != buyProductsDto.Products.Count)
            {
                throw new ArgumentException("One or more products not found");
            }

            if (products.Any(p => p.IsSold))
            {
                throw new InvalidOperationException("One or more products have already been sold");
            }

            var purchase = new Purchase(products, buyProductsDto.Name, buyProductsDto.Message);
            _context.Purchases.InsertOne(purchase);

            var result = await _paymentService.MakePaymentUrl(purchase);

            return result;
        }
    }
}
