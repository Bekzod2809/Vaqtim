# 1-bosqich: SDK image ichida loyihani yig'amiz (publish)
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Avval faqat .csproj — paketlar o'zgarmasa, keyingi build'larda restore qismi keshdan olinadi
COPY WatchShop.Api.csproj .
RUN dotnet restore

COPY . .
RUN dotnet publish -c Release -o /app/publish --no-restore

# 2-bosqich: faqat ishga tushirish uchun kichik runtime image (SDK kirmaydi)
FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=build /app/publish .

# Rasmlar papkasi volume bo'lib ulanadi; uni root emas, oddiy "app" foydalanuvchisi yoza olishi kerak
RUN mkdir -p /app/wwwroot/rasmlar && chown -R $APP_UID /app/wwwroot/rasmlar
USER $APP_UID

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080
ENTRYPOINT ["dotnet", "WatchShop.Api.dll"]
