using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi;
using WatchShop.Api.Configurations;
using WatchShop.Api.Configurations.Settings;
using WatchShop.Api.Data;
using WatchShop.Api.Middlewares;
using WatchShop.Api.Repositories;
using WatchShop.Api.Services;
using WatchShop.Api.Validators;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
var telegramSettings = builder.Configuration.GetSection("Telegram").Get<TelegramSettings>() ?? new TelegramSettings();
builder.Services.AddSingleton(telegramSettings);
builder.Services.AddHttpClient();
builder.Services.AddHttpClient("Telegram", client =>
{
    client.Timeout = TimeSpan.FromSeconds(40);
});
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Kirish (login) dan olingan tokenni shu yerga qo'ying"
    });

    options.AddSecurityRequirement(document => new OpenApiSecurityRequirement
    {
        { new OpenApiSecuritySchemeReference("Bearer", document), new List<string>() }
    });
});

var rawConnectionString =
    Environment.GetEnvironmentVariable("ConnectionStrings__DefaultConnection")
    ?? Environment.GetEnvironmentVariable("DATABASE_URL")
    ?? builder.Configuration.GetConnectionString("DefaultConnection");

var connectionString = BuildPostgresConnectionString(rawConnectionString);

builder.Services.AddDbContext<AppDbContext>(options =>
{
    // EnableRetryOnFailure: bulutda baza kechroq tayyor bo'lsa, ulanish qayta urinib ko'riladi
    options.UseNpgsql(connectionString, npgsql => npgsql.EnableRetryOnFailure());
});

builder.AddJwtAuthentication();

builder.Services.AddScoped(typeof(IBaseRepository<>), typeof(BaseRepository<>));
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IImageService, ImageService>();
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IPhoneVerificationService, PhoneVerificationService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<ICartService, CartService>();
builder.Services.AddScoped<IOrderService, OrderService>();

builder.Services.AddValidatorsFromAssemblyContaining<ProductWriteDtoValidator>();
builder.Services.AddSingleton<ITelegramBotService, TelegramBotService>();
builder.Services.AddHostedService<TelegramBotHostedService>();

var app = builder.Build();

// Dastur ishga tushganda baza oxirgi migration holatiga keltiriladi va bo'sh bo'lsa boshlang'ich ma'lumotlar yoziladi
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
    DbSeeder.Seed(db);
}

app.UseMiddleware<ExceptionMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Development'da frontend Vite proxy orqali HTTP (5277) bilan ulanadi, shuning uchun HTTPS'ga yo'naltirmaymiz
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

// wwwroot ichidagi frontend (index.html) va rasmlarni brauzerga berish uchun
app.UseDefaultFiles();
app.UseStaticFiles();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapFallbackToFile("index.html");

app.Run();

static string BuildPostgresConnectionString(string? raw)
{
    if (string.IsNullOrWhiteSpace(raw))
    {
        return string.Empty;
    }

    if (!raw.StartsWith("postgres://", StringComparison.OrdinalIgnoreCase) &&
        !raw.StartsWith("postgresql://", StringComparison.OrdinalIgnoreCase))
    {
        return raw;
    }

    var uri = new Uri(raw);
    var userInfo = uri.UserInfo.Split(':', 2);
    var username = Uri.UnescapeDataString(userInfo[0]);
    var password = userInfo.Length > 1 ? Uri.UnescapeDataString(userInfo[1]) : string.Empty;
    var database = uri.AbsolutePath.TrimStart('/');
    var port = uri.Port > 0 ? uri.Port : 5432;

    return $"Host={uri.Host};Port={port};Database={database};Username={username};Password={password};SSL Mode=Prefer;Trust Server Certificate=true";
}
