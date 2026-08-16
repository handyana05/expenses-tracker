# Production Deployment Checklist

This checklist captures the deployment-readiness steps for the Expense Tracker stack before exposing it to a public environment.

## Scope

This is an operational checklist for the Docker Compose deployment, not a feature-development plan.

The goal is to confirm that the application is safe to run in a production-like environment with:

- a trusted reverse proxy or ingress
- proper secret management
- health checks
- correct startup ordering
- a verified smoke test

## Required configuration

Create a local `.env` file from the example and replace placeholders:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Required values:

- `POSTGRES_DB`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_PORT`
- `JWT_SECRET_KEY`
- `FRONTEND_PORT`

Important:

- keep the `.env` file out of source control
- use a strong JWT secret with at least 32 characters
- never commit production secrets

## Startup validation

Run the stack:

```bash
docker compose up --build -d
```

Confirm all services are healthy:

```bash
docker compose ps
```

Check the frontend endpoint:

```bash
Invoke-WebRequest http://localhost:8080/health
```

Expected result:

- HTTP `200 OK`
- response body: `healthy`

## Health and readiness checks

The stack should show:

- backend: healthy
- postgres: healthy
- frontend: healthy

If any service is unhealthy:

- review the container logs
- confirm environment variables are set
- confirm Postgres is ready before the API starts
- confirm the frontend health check is valid for the running container

Useful commands:

```bash
docker compose logs -f backend frontend postgres
```

## Reverse proxy and TLS

Public deployment should include:

- TLS termination at a reverse proxy or ingress
- a trusted network boundary in front of the app
- proper firewall and host access rules
- no direct public exposure of the raw PostgreSQL port

This project already expects the browser to reach the app through the frontend Nginx layer and the backend to sit behind the application proxy path.

## Database safety

For production-like environments:

- keep PostgreSQL in a private or managed network if possible
- avoid exposing raw database ports publicly
- only enable startup migrations when that behavior is intentional
- keep a backup strategy for the Postgres volume

## Smoke test before public exposure

After the stack is healthy, validate the application manually:

1. open the app in the browser
2. register a user or sign in
3. create a category
4. create a transaction
5. confirm the dashboard loads
6. confirm reports render correctly
7. verify the frontend can reach the API successfully

## Deployment checklist summary

Before going public, confirm all of the following:

- `.env` is present and complete
- JWT secret is valid and secret
- Postgres is healthy
- backend is healthy
- frontend is healthy
- `/health` responds successfully
- app can be used through the browser
- TLS is handled outside the application
- database is not publicly exposed
- backups and rollback steps are documented

## Notes

This is an operational readiness pass. It does not add functionality to the application itself; it prepares the existing stack for safe deployment and runtime verification.
