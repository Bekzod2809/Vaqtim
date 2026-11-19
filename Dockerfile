# 1-bosqich: React frontend'ni yig'ish (Vite build)
FROM node:22-alpine AS frontend-build
WORKDIR /frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# 2-bosqich: ASP.NET Core backend'ni yig'ish (publish)
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS backend-build
WORKDIR /src
COPY src/WatchShop.Api/WatchShop.Api.csproj src/WatchShop.Api/
RUN dotnet restore src/WatchShop.Api/WatchShop.Api.csproj
COPY src/WatchShop.Api/ src/WatchShop.Api/
RUN dotnet publish src/WatchShop.Api/WatchShop.Api.csproj -c Release -o /app/publish --no-restore

# 3-bosqich: Yakuniy runtime image (backend + frontend wwwroot ichida)
FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=backend-build /app/publish .
COPY --from=frontend-build /frontend/dist ./wwwroot

# Yuklanadigan rasmlar papkasi oddiy foydalanuvchi uchun yoziladigan bo'lishi kerak
RUN mkdir -p /app/wwwroot/images && chown -R $APP_UID /app/wwwroot/images
USER $APP_UID

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080
ENTRYPOINT ["dotnet", "WatchShop.Api.dll"]
