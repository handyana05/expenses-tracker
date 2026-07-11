# ADR-0008: Serve Angular Through Nginx and Proxy the API in Compose

## Status

Accepted

## Context

The full application needs reproducible production container images and a local
full-stack topology. The browser should not require environment-specific backend
hostnames or cross-origin configuration in production. Service startup must also
account for PostgreSQL readiness and database schema creation.

## Decision

Use this container topology:

```text
Browser → Nginx/Angular → /api proxy → ASP.NET Core → PostgreSQL
```

- Build Angular and ASP.NET Core with separate multi-stage Dockerfiles.
- Serve the Angular bundle from Nginx with SPA fallback and immutable caching for
  hashed assets.
- Use the same-origin `/api` URL in production and proxy it to the backend.
- Run the ASP.NET Core runtime image as its non-root application user.
- Configure PostgreSQL, connection strings, JWT settings, and published ports
  through Compose environment variables.
- Require database and JWT secrets instead of accepting blank Compose values.
- Gate dependent services with health checks.
- Keep automatic EF Core migrations disabled by default and enable them explicitly
  in the single-instance Compose environment.
- Terminate TLS and manage production secrets at an external trusted reverse
  proxy, ingress, or cloud platform.

## Consequences

### Positive

- Browser traffic uses one origin and avoids production CORS complexity.
- Images contain only runtime artifacts.
- Compose can initialize and run a fresh local full-stack environment.
- Health checks make startup ordering observable and deterministic.
- Production API configuration does not require rebuilding Angular for each host.

### Negative

- Nginx becomes an additional runtime component.
- Startup migrations are appropriate only for controlled single-instance startup;
  multi-instance deployment requires a dedicated migration job.
- The Compose stack provides HTTP locally and is not a complete public TLS setup.
- Container base images and package advisories require ongoing maintenance.
