using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi;
using WatchShop.Api.Configurations;
using WatchShop.Api.Data;
using WatchShop.Api.Middlewares;
using WatchShop.Api.Repositories;
using WatchShop.Api.Services;
using WatchShop.Api.Validators;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
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

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseNpgsql(connectionString);
});

builder.AddJwtAuthentication();

builder.Services.AddScoped(typeof(IBaseRepository<>), typeof(BaseRepository<>));
builder.Services.AddScoped<IMahsulotService, MahsulotService>();
builder.Services.AddScoped<IRasmService, RasmService>();
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IFoydalanuvchiService, FoydalanuvchiService>();
builder.Services.AddScoped<ISavatService, SavatService>();
builder.Services.AddScoped<IBuyurtmaService, BuyurtmaService>();

builder.Services.AddValidatorsFromAssemblyContaining<MahsulotYozishDtoValidator>();

var app = builder.Build();

// Dastur ishga tushganda baza oxirgi migration holatiga keltiriladi: "dotnet ef database update" ni qo'lda bajarish shart emas
using (var scope = app.Services.CreateScope())
{
    scope.ServiceProvider.GetRequiredService<AppDbContext>().Database.Migrate();
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

// wwwroot ichidagi fayllarni (rasmlarni) brauzerga berish uchun
app.UseStaticFiles();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
