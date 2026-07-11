FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY backend/ExpensesTracker.Domain/ExpensesTracker.Domain.csproj backend/ExpensesTracker.Domain/
COPY backend/ExpensesTracker.Application/ExpensesTracker.Application.csproj backend/ExpensesTracker.Application/
COPY backend/ExpensesTracker.Infrastructure/ExpensesTracker.Infrastructure.csproj backend/ExpensesTracker.Infrastructure/
COPY backend/ExpensesTracker.Api/ExpensesTracker.Api.csproj backend/ExpensesTracker.Api/
RUN dotnet restore backend/ExpensesTracker.Api/ExpensesTracker.Api.csproj

COPY backend/ backend/
RUN dotnet publish backend/ExpensesTracker.Api/ExpensesTracker.Api.csproj \
    --configuration Release \
    --no-restore \
    --output /app/publish \
    /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
RUN apt-get update \
    && apt-get install --yes --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

USER $APP_UID
ENTRYPOINT ["dotnet", "ExpensesTracker.Api.dll"]
