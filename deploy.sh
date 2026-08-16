#!/usr/bin/env bash
set -euo pipefail

# deploy.sh - deploy the Expense Tracker stack on the local machine using
# docker compose. Usage:
#   ./deploy.sh               # build locally (uses local sources)
#   ./deploy.sh backendImage frontendImage
#   BACKEND_IMAGE=... FRONTEND_IMAGE=... ./deploy.sh

BACKEND_IMAGE=${1:-}
FRONTEND_IMAGE=${2:-}

REPO_DIR="$(cd "$(dirname "$0")" && pwd)"
OVERLAY_FILE="$REPO_DIR/docker-compose.deploy.override.yml"

cd "$REPO_DIR"

if [[ -n "$BACKEND_IMAGE" && -n "$FRONTEND_IMAGE" ]]; then
  echo "Creating override compose file using provided image names"
  cat > "$OVERLAY_FILE" <<YAML
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
  echo "Pulling images..."
  docker compose -f docker-compose.yml -f "$OVERLAY_FILE" pull
  echo "Starting stack with registry images..."
  docker compose -f docker-compose.yml -f "$OVERLAY_FILE" up -d --remove-orphans
  rm -f "$OVERLAY_FILE"

elif [[ -n "${BACKEND_IMAGE:-}" && -n "${FRONTEND_IMAGE:-}" ]]; then
  # support environment variables set externally
  echo "Using BACKEND_IMAGE=$BACKEND_IMAGE and FRONTEND_IMAGE=$FRONTEND_IMAGE from environment"
  cat > "$OVERLAY_FILE" <<YAML
version: '3.8'
services:
  backend:
    image: "${BACKEND_IMAGE}"
    restart: unless-stopped
    environment:
      - Database__ApplyMigrationsOnStartup=true
  frontend:
    image: "${FRONTEND_IMAGE}"
    restart: unless-stopped
YAML
  docker compose -f docker-compose.yml -f "$OVERLAY_FILE" pull
  docker compose -f docker-compose.yml -f "$OVERLAY_FILE" up -d --remove-orphans
  rm -f "$OVERLAY_FILE"

else
  echo "No registry images provided — building locally and starting compose"
  docker compose up -d --build
fi

echo "Deployment complete. Check services with: docker compose ps"
