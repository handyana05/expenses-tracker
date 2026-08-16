# Azure Deployment Example (ACR + App Service / Container Apps + Azure DB + Key Vault)

This document outlines a practical Azure-hosted deployment for Expense Tracker. It is an example to get you started and should be adapted to your security and compliance requirements.

## Overview

Primary components:

- Azure Container Registry (ACR) — stores built container images
- Azure App Service for Containers (or Azure Container Apps) — runs frontend and backend containers
- Azure Database for PostgreSQL — managed DB
- Azure Key Vault — secret storage
- GitHub Actions — CI/CD pipeline builds images and deploys to ACR and App Service

## Prerequisites

- Azure subscription
- Azure CLI installed locally
- GitHub repository connected to Azure via a service principal (used by GitHub Actions)

### Create Azure resources (example CLI)

```bash
# variables
RG=my-expenses-rg
LOCATION=eastus
ACR_NAME=myexpensesacr$RANDOM
BACKEND_APP=my-expenses-backend
FRONTEND_APP=my-expenses-frontend
POSTGRES_SRV=myexpensesdb
KV_NAME=myexpenses-kv

az group create -n $RG -l $LOCATION

# Create ACR
az acr create -n $ACR_NAME -g $RG --sku Standard

# Create App Service plan (Linux)
az appservice plan create -n expenses-plan -g $RG --is-linux --sku B1

# Create Web Apps (container)
az webapp create -g $RG -p expenses-plan -n $BACKEND_APP --deployment-container-image-name "mcr.microsoft.com/azuredocs/aci-helloworld"
az webapp create -g $RG -p expenses-plan -n $FRONTEND_APP --deployment-container-image-name "mcr.microsoft.com/azuredocs/aci-helloworld"

# Create Azure Database for PostgreSQL (Flexible Server recommended)
az postgres flexible-server create -g $RG -n $POSTGRES_SRV -l $LOCATION -u pgadmin -p 'ReplaceWithSecurePassword' --tier Burstable --sku-name Standard_B1ms --storage-size 32

# Create Key Vault
az keyvault create -g $RG -n $KV_NAME -l $LOCATION
```

## Push images to ACR

Use the GitHub Actions workflow (`.github/workflows/ci-cd.yml`) to build and push images to ACR. The workflow expects these GitHub repository secrets configured:

- `AZURE_CREDENTIALS` — service principal JSON (for `azure/login`)
- `ACR_LOGIN_SERVER` — e.g. `myexpensesacr.azurecr.io`
- `ACR_USERNAME` and `ACR_PASSWORD` — credentials for ACR (can obtain via `az acr credential show`)
- `AZURE_RESOURCE_GROUP` — resource group name
- `AZURE_WEBAPP_BACKEND` — backend Web App name
- `AZURE_WEBAPP_FRONTEND` — frontend Web App name
- `POSTGRES_CONNECTION_STRING` — connection string (e.g., `Host=<server>.postgres.database.azure.com;Database=...;Username=...;Password=...`)
- `JWT_SECRET_KEY` — JWT signing key
- `JWT_ISSUER`, `JWT_AUDIENCE` — optional issuer/audience values

## Configure App Service to use images from ACR

The GitHub Actions workflow builds and pushes images to ACR and then updates the Web App container configuration to use the new image tag. It also updates application settings using `az webapp config appsettings set` (populating DB connection string and JWT secret).

For production, prefer using Key Vault references and Managed Identities instead of storing secrets in Web App settings.

## Key Vault and Managed Identity (recommended)

1. Enable a Managed Identity for each Web App.
2. Grant the identity `get` permission for secrets in Key Vault.
3. Store secrets in Key Vault (DB connection string, JWT secret).
4. Configure the Web App to use Key Vault references for its settings.

## CI/CD notes

- The provided `ci-cd.yml` workflow runs on pushes to `main` and does:
  1. build & test backend
  2. build frontend assets
  3. build and push Docker images to ACR
  4. update App Service container config and app settings

- Use deployment slots and staged rollouts for safer deployments.

## App settings and environment variables

The backend expects these environment variables (as app settings in App Service):

- `ConnectionStrings__DefaultConnection` — the EF Core connection string
- `Jwt__Issuer`
- `Jwt__Audience`
- `Jwt__SecretKey`
- `Database__ApplyMigrationsOnStartup` — set `true` only when you want migrations to run on startup

## Example: update settings via Azure CLI

```bash
az webapp config appsettings set --name $BACKEND_APP --resource-group $RG --settings \
  "ConnectionStrings__DefaultConnection=$POSTGRES_CONN" \
  "Jwt__SecretKey=$JWT_SECRET" \
  "Jwt__Issuer=ExpenseTracker" "Jwt__Audience=ExpenseTracker.Client"
```

## Security considerations

- Use Key Vault and Managed Identities whenever possible
- Do not store secrets in the repository or GitHub Actions logs
- Use private endpoints/networking for the DB
- Enable TLS termination at the front door or application gateway

## Monitoring & backups

- Enable Application Insights for backend telemetry
- Configure automated backups for Azure Database for PostgreSQL
- Configure alerting on failed health checks and high error rates

## Rollback

- Keep image tags for previously known-good releases
- Use App Service deployment slots or change the container tag in ACR and re-deploy
- Keep DB backups for data recovery

---

This is an example plan. If you want, I can generate:
- a GitHub Actions workflow (already added in `.github/workflows/ci-cd.yml`) tuned for ACR/App Service
- an ARM template / Bicep snippet to provision the resources above
- an example Key Vault secret creation script

Tell me which of those you want next.