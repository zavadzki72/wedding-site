using LifeEssentials.WebApi.Data;
using LifeEssentials.WebApi.ExternalServices;
using LifeEssentials.WebApi.Middlewares;
using LifeEssentials.WebApi.Services;
using MercadoPago.Config;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Configuration.AddEnvironmentVariables();
var mongoConnectionString = Environment.GetEnvironmentVariable("MongoDbConnectionString");

if (string.IsNullOrWhiteSpace(mongoConnectionString))
{
    mongoConnectionString = builder.Configuration["MongoDbSettings:ConnectionString"];
}

builder.Services.Configure<MongoDbSettings>(options =>
{
    options.ConnectionString = mongoConnectionString!;
    options.DatabaseName = builder.Configuration.GetSection("MongoDbSettings:DatabaseName").Value!;
});

MercadoPagoConfig.AccessToken = builder.Configuration["MercadoPago:AccessToken"];

builder.Services.AddSingleton<MongoContext>();

builder.Services.AddScoped<GuestService>();
builder.Services.AddScoped<ManagerService>();
builder.Services.AddScoped<GiftService>();
builder.Services.AddScoped<WebhookService>();

builder.Services.AddScoped<PaymentService>();

builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer("Bearer", options =>
    {
        var config = builder.Configuration;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = config["Jwt:Issuer"],
            ValidAudience = config["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Key"]!))
        };
    });

builder.Services.AddControllers();
builder.Services.AddHttpContextAccessor();

builder.Services.AddCors(x => {
    x.AddPolicy("AllowAll", options => { options.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader(); });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseHttpsRedirection();

app.UseCors("AllowAll");

app.UseAuthentication();
app.UseAuthorization();

app.UseMiddleware<ExceptionHandlingMiddleware>();

app.UseSwagger();
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "WebApi V1");
    options.RoutePrefix = string.Empty;
});

app.MapControllers();

app.Run();
