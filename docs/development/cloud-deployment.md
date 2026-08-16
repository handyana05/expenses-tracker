# Cloud & Self-hosted Deployment Runbook

This runbook documents two practical deployment paths for the Expense Tracker application:

- Self-hosted Docker VM (recommended first step)
- Cloud-hosted container deployment (Azure example)

It is an operational guide (runbook) — not application code. Follow the checklists and commands carefully and keep secrets out of source control.

---

## Quick decisions

Before you deploy, decide:

1. Deployment target
   - Self-hosted VM (Ubuntu recommended) — lowest friction, uses existing `docker compose` stack
   - Cloud provider (Azure example provided) — managed infra, better operational guarantees
2. Database option
   - Use the `postgres` container from `docker-compose.yml` (quick but self-hosted)
   - Use a managed PostgreSQL (recommended for production)
3. Secret management
   - Local `.env` for self-hosted testing
   - Cloud secret store (Azure Key Vault, AWS Secrets Manager) for production

---

## Self-hosted VM (Ubuntu) — minimal end-to-end

A. Host preparation

- Use Ubuntu 22.04 or similar LTS.
- Install Docker + Compose plugin:

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y ca-certificates curl gnupg lsb-release
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" \
  | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
sudo usermod -aG docker $USER  # logout/login or use sudo where required
```

B. Clone repo and prepare environment

```bash
git clone <your-repo-url> expenses-tracker
cd expenses-tracker
cp .env.example .env
# edit .env: set POSTGRES_PASSWORD, JWT_SECRET_KEY (strong random), FRONTEND_PORT
```

Generate a random JWT secret (example on Linux):

```bash
python3 - <<'PY'
import secrets,base64
print(base64.urlsafe_b64encode(secrets.token_bytes(32)).decode())
PY
```

C. Start the stack

```bash
docker compose up --build -d
```

D. Validate health

```bash
docker compose ps
curl -fsS http://localhost:8080/health    # should return "healthy"
```

E. Reverse proxy & TLS (example using host Nginx)

- Install Nginx and certbot on the host and configure an Nginx site pointing to `http://127.0.0.1:8080` (the frontend container is published there).
- Example Nginx site (replace `example.com`):

```
server {
  listen 80;
  server_name example.com www.example.com;

  location / {
    proxy_pass http://127.0.0.1:8080;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_connect_timeout 60s;
  }
}
```

- Obtain TLS cert with Certbot:

```bash
sudo certbot --nginx -d example.com -d www.example.com
```

F. Firewall & security

```bash
sudo apt install -y ufw
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

G. Backups (Postgres container)

Create a backup script (run daily via cron):

```bash
BACKUP_DIR=/var/backups/expenses-tracker
mkdir -p $BACKUP_DIR
docker exec -t $(docker compose ps -q postgres) pg_dump -U $POSTGRES_USER $POSTGRES_DB > $BACKUP_DIR/pg_backup_$(date +%F).sql
```

H. Systemd (optional)

Create a simple systemd unit that runs `docker compose up` at boot or use a small wrapper script. I can provide an example unit if you want.

---

## Cloud-hosted: Azure example (ACR + App Service / Container Apps)

This is a high-level example. Adjust for your organization’s policy.

A. Build & push images

- Create Azure Container Registry (ACR) and push backend & frontend images there.
- Use GitHub Actions or local Docker build/push:
  - backend image: `expenses-tracker-backend:latest`
  - frontend image: `expenses-tracker-frontend:latest`

B. Managed database

- Use Azure Database for PostgreSQL (Single Server or Flexible Server).
- Configure network rules to allow the backend app to reach the DB.

C. Secrets

- Store `POSTGRES_PASSWORD`, `JWT_SECRET_KEY`, and other sensitive values in Azure Key Vault.
- Grant the runtime identity access to Key Vault secrets or inject them as App Settings securely.

D. App hosting choices

1. Azure App Service for Containers
   - Deploy backend and frontend as separate App Service containers or host only backend and serve static frontend via a storage + CDN.
2. Azure Container Apps (ACA)
   - Deploy as container apps behind Envoy; good integration with managed services.
3. AKS (Kubernetes)
   - Full control, more complexity; recommended only if you need multi-service orchestration at scale.

E. Ingress & TLS

- Use App Service Managed Certificates or Azure Front Door for TLS and global routing.
- Route `/api` to the backend container and `/` to the frontend container or CDN.

F. CI/CD

- Use GitHub Actions to build images and push to ACR.
- Use `az webapp config container set` or AKS manifests to deploy.

G. Monitoring & backups

- Use Azure Monitor / Application Insights for logs and telemetry.
- Configure automated backups or point-in-time restore for Azure Database for PostgreSQL.

---

## CI/CD (recommended minimal GitHub Actions flow)

- Build and push images to a registry (Docker Hub or ACR).
- Run integration tests (optional) in a disposable environment.
- SSH-deploy to a VM by pulling the latest images and running `docker compose up -d`.

I can provide a ready-to-use GitHub Actions workflow if you want.

---

## Rollback plan

- Keep DB backups and retained image tags.
- To roll back:
  - `docker compose pull` (specify the previous image tag) and `docker compose up -d` or
  - on Azure, redeploy the previous release from the registry

---

## What I can generate for you next (pick one or more)

- A) systemd unit + deploy script to run `docker compose` on boot
- B) host Nginx site file + certbot commands (provide domain)
- C) Postgres backup script + cron entry
- D) GitHub Actions workflow to build/push and deploy via SSH
- E) Azure deployment example (ACR + App Service / Container Apps + Key Vault)

State which letter(s) you want and provide any required details (domain name for TLS, registry name for images, or target VM user/IP).