# Self-Hosted VM + Docker Deployment

This guide describes a simple, repeatable way to run the Expense Tracker application on a self-hosted VM using Docker Compose. It assumes an Ubuntu 22.04 (or similar) host, but most steps apply to other Linux distributions with small adjustments.

This is meant as an operational runbook — follow each step deliberately and do not commit secrets into source control.

## Summary

- Host: Ubuntu 22.04 LTS (or equivalent)
- Orchestrator: Docker Engine + Compose plugin
- Datastore: PostgreSQL (containerized by Compose or external/managed DB)
- Reverse proxy & TLS: Nginx + Certbot on the host (recommended)
- Secrets: store in host environment or a secret manager (do not commit `.env`)

## Checklist (quick)

- [ ] Create VM and ensure network/firewall access
- [ ] Install Docker & Compose plugin
- [ ] Clone repo and create `.env` from `.env.example`
- [ ] Generate a strong `JWT_SECRET_KEY`
- [ ] Start stack: `docker compose up --build -d`
- [ ] Confirm health endpoints respond
- [ ] Configure host Nginx and obtain TLS certs via Certbot
- [ ] Configure backups for Postgres
- [ ] Add monitoring/alerts (optional)

---

## 1. Host preparation (Ubuntu)

SSH into the host and run:

```bash
# Update packages
sudo apt update && sudo apt upgrade -y

# Install prerequisites
sudo apt install -y ca-certificates curl gnupg lsb-release

# Install Docker repository key and source
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine + Compose plugin
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Optional: allow your user to run Docker without sudo
sudo usermod -aG docker $USER
# Re-login or use `newgrp docker` to apply group membership
```

## 2. Clone repository and prepare environment

```bash
# Clone repo (example)
git clone <your-repo-url> expenses-tracker
cd expenses-tracker

# Copy example environment file
cp .env.example .env

# Edit .env (set POSTGRES_PASSWORD, JWT_SECRET_KEY, FRONTEND_PORT, etc.)
# Use your preferred editor, for example:
nano .env
```

Generate a strong JWT secret on the host (Linux example):

```bash
python3 - <<'PY'
import secrets,base64
print(base64.urlsafe_b64encode(secrets.token_bytes(32)).decode())
PY
```

Paste the generated value into `JWT_SECRET_KEY` in `.env`.

## 3. Decide Postgres approach

Option A — Quick start (recommended for first deployments): use the Postgres container already defined in `docker-compose.yml`. The Compose file manages a volume for persistence.

Option B — Production-ready: use a managed PostgreSQL service (Azure Database for PostgreSQL, AWS RDS, etc.). If using managed DB, update `ConnectionStrings__DefaultConnection` or compose environment appropriately and do not run the `postgres` service locally.

## 4. Start the stack

From the repo root on the host:

```bash
# Build and start (detached)
docker compose up --build -d

# Check status
docker compose ps
```

## 5. Validate health

Confirm the frontend proxy health endpoint and basic service health:

```bash
# Frontend health check (host-side)
curl -fsS http://localhost:8080/health
# Expected output: healthy

# Backend health can be validated indirectly via the frontend or directly if mapped
curl -fsS http://localhost:8080/api/health || true
```

Also inspect logs if something is not healthy:

```bash
docker compose logs -f backend frontend postgres
```

Wait for containers to report `healthy` in `docker compose ps` before proceeding.

## 6. Reverse proxy and TLS (host Nginx + Certbot)

Although the frontend image includes Nginx to serve static assets, it’s recommended to put a host-level reverse proxy in front of the containers when exposing to the internet. This provides central TLS termination, firewall rules, and easier renewals.

Install Nginx and Certbot on the host:

```bash
sudo apt install -y nginx certbot python3-certbot-nginx
```

Example Nginx site (replace `example.com` with your domain):

```
server {
    listen 80;
    server_name example.com www.example.com;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 90;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:8080;
    }
}
```

Reload Nginx and obtain certificates:

```bash
sudo nginx -t
sudo systemctl reload nginx
# Obtain TLS certs (interactive)
sudo certbot --nginx -d example.com -d www.example.com
```

Confirm HTTPS works: open `https://example.com` in the browser.

Notes:
- If you want to use the frontend container's Nginx directly for TLS, you can, but managing certificates inside containers is more complex. Host-level Nginx with Certbot is simpler.

## 7. Firewall

Restrict host ports using UFW (Ubuntu):

```bash
sudo apt install -y ufw
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'  # opens 80 and 443
sudo ufw enable
```

If you are using a cloud provider, configure security groups/firewall rules there as well.

## 8. Backups (Postgres)

Schedule periodic backups for your Postgres data. Example script to run on the host (adjust paths and env values):

```bash
#!/bin/bash
BACKUP_DIR=/var/backups/expenses-tracker
mkdir -p "$BACKUP_DIR"
POD=$(docker compose ps -q postgres)
TIMESTAMP=$(date +%F_%H%M)
PG_USER=${POSTGRES_USER:-postgres}
PG_DB=${POSTGRES_DB:-ExpenseTrackerDb}

docker exec -t "$POD" pg_dump -U "$PG_USER" "$PG_DB" > "$BACKUP_DIR/pg_backup_$TIMESTAMP.sql"
# Optionally compress
gzip -f "$BACKUP_DIR/pg_backup_$TIMESTAMP.sql"

# Implement retention (delete old backups)
find "$BACKUP_DIR" -type f -mtime +30 -delete
```

Add to cron to run nightly (edit with `crontab -e`):

```cron
0 2 * * * /usr/local/bin/expenses_backup.sh >> /var/log/expenses_backup.log 2>&1
```

## 9. Systemd unit (optional): run Compose on boot

Create `/etc/systemd/system/expenses-tracker.service` with content:

```
[Unit]
Description=Expenses Tracker Docker Compose
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
WorkingDirectory=/home/ubuntu/expenses-tracker
RemainAfterExit=yes
ExecStart=/usr/bin/docker compose up -d --build
ExecStop=/usr/bin/docker compose down
TimeoutStartSec=600

[Install]
WantedBy=multi-user.target
```

Enable and start the service:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now expenses-tracker.service
sudo systemctl status expenses-tracker.service
```

This ensures the stack launches at boot. Adjust `WorkingDirectory` to the path where the repo is cloned.

## 10. Simple automated deploy script (recommended)

If you want GitHub Actions to remotely trigger a seamless deploy on your VM, create a small `deploy.sh` script on the host (inside the repository path) that pulls the latest images and starts the stack. The GitHub Actions workflow will SSH to the VM and invoke this script.

Example `deploy.sh` (place in the repo on the VM, e.g., `/home/ubuntu/expenses-tracker/deploy.sh` and make executable with `chmod +x deploy.sh`):

```bash
#!/usr/bin/env bash
set -euo pipefail

# Optional image tags passed as arguments
BACKEND_IMAGE=${1:-}
FRONTEND_IMAGE=${2:-}

cd "$(dirname "$0")"

# If image tags are provided, update .env or docker-compose.override accordingly
if [[ -n "$BACKEND_IMAGE" && -n "$FRONTEND_IMAGE" ]]; then
  echo "Using registry images: $BACKEND_IMAGE and $FRONTEND_IMAGE"
  # Create a small override compose file referencing registry images
  cat > docker-compose.deploy.yml <<YAML
version: '3.8'
services:
  backend:
    image: "$BACKEND_IMAGE"
    restart: unless-stopped
    environment:
      - Database__ApplyMigrationsOnStartup=true
  frontend:
    image: "$FRONTEND_IMAGE"
    restart: unless-stopped
YAML
  docker compose -f docker-compose.yml -f docker-compose.deploy.yml pull
  docker compose -f docker-compose.yml -f docker-compose.deploy.yml up -d --remove-orphans
else
  # Default: pull and restart using compose in the repo (assumes compose references registry images or builds locally)
  docker compose pull || true
  docker compose up -d --build
fi

# Optional cleanup
# docker image prune -f

echo "Deploy complete"
```

This approach keeps the deploy logic on the VM and avoids the need for the workflow to know VM internals. The workflow will SSH and run `./deploy.sh <backend-image> <frontend-image>` after pushing images.

## 11. Logs and monitoring

- Use `docker compose logs -f` for real-time troubleshooting.
- Consider forwarding logs to a centralized logging system (e.g., ELK stack, Loki) for production.
- Add a simple uptime monitor (external service or cron + curl) that queries `/health` and alerts on failure.

## 11. Rollback strategy

- Keep daily DB backups and retain at least 7-30 days depending on retention policy.
- Keep tagged container images in a registry or use Git tags and image tags to deploy known-good versions.
- To rollback, restore the DB (if needed) and redeploy the older image tag:

```bash
# Pull a previous image tag in docker-compose or on host
# Example: modify docker-compose to use tag `expenses-tracker-backend:2026-08-01`
# Then run:

docker compose pull
docker compose up -d
```

## 12. Smoke test (after deployment)

1. Open `https://example.com` in a browser
2. Register a new user or login
3. Create a category
4. Create a transaction
5. Visit the dashboard and reports
6. Confirm the UI shows the expected data and no 5xx errors appear in logs

## 13. Security & operational notes

- Do not commit `.env` to the repo
- Keep `JWT_SECRET_KEY` and DB credentials in your secret store
- Prefer a managed DB for production (backups, HA, security)
- Use a monitoring/alerting system
- Regularly rotate secrets and enforce least privilege for DB user

---

If you want, I can also generate:
- an example Nginx site file with your domain substituted
- the systemd unit and wrapper script pre-filled with your repo path
- a cron-backed backup script file placed in `/usr/local/bin` and an example `crontab` entry

Tell me which artifacts you want generated and provide the values (domain, repo path on the host, backup path, etc.).
