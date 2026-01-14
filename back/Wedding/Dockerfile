FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY Wedding.WebApi/Wedding.WebApi.csproj Wedding.WebApi/
RUN dotnet restore Wedding.WebApi/Wedding.WebApi.csproj

COPY . .
WORKDIR /src/Wedding.WebApi
RUN dotnet publish -c Release -o /app/publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

COPY --from=build /app/publish .

EXPOSE 8080

ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production

ENTRYPOINT ["dotnet", "Wedding.WebApi.dll"]
