#!/bin/bash

REPO_DIR="/home/fac.ingenieria/thesis-manager/proyectos/SEMILLERO"
LOG="${REPO_DIR}/deploy.log"
BRANCH="main"

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" >> "$LOG"
}

# Leer variables del .env sin exponerlas al shell de forma insegura
ADMIN_PASSWORD=$(grep '^ADMIN_PASSWORD=' "${REPO_DIR}/.env" | cut -d= -f2-)
ADMIN_PASSWORD_HASH=$(grep '^ADMIN_PASSWORD_HASH=' "${REPO_DIR}/.env" | cut -d= -f2-)
COOKIE_SECRET=$(grep '^COOKIE_SECRET=' "${REPO_DIR}/.env" | cut -d= -f2-)
COOKIE_SECURE=$(grep '^COOKIE_SECURE=' "${REPO_DIR}/.env" | cut -d= -f2-)
CONTACT_TO=$(grep '^CONTACT_TO=' "${REPO_DIR}/.env" | cut -d= -f2-)
SMTP_HOST=$(grep '^SMTP_HOST=' "${REPO_DIR}/.env" | cut -d= -f2-)
SMTP_PORT=$(grep '^SMTP_PORT=' "${REPO_DIR}/.env" | cut -d= -f2-)
SMTP_SECURE=$(grep '^SMTP_SECURE=' "${REPO_DIR}/.env" | cut -d= -f2-)
SMTP_USER=$(grep '^SMTP_USER=' "${REPO_DIR}/.env" | cut -d= -f2-)
SMTP_PASS=$(grep '^SMTP_PASS=' "${REPO_DIR}/.env" | cut -d= -f2-)
SMTP_FROM=$(grep '^SMTP_FROM=' "${REPO_DIR}/.env" | cut -d= -f2-)

cd "$REPO_DIR" || { log "ERROR: no se puede acceder a $REPO_DIR"; exit 1; }

while true; do
  timeout 30 git fetch origin "$BRANCH" >> "$LOG" 2>&1

  NEW_COMMITS=$(git log HEAD..origin/$BRANCH --oneline 2>/dev/null | wc -l)
  REMOTE=$(git rev-parse "origin/$BRANCH")

  if [ "$NEW_COMMITS" -gt 0 ]; then
    log "Cambios detectados ($NEW_COMMITS commit(s) nuevos -> ${REMOTE:0:8}). Desplegando..."

    git stash >> "$LOG" 2>&1
    timeout 60 git pull --no-rebase --no-edit origin "$BRANCH" >> "$LOG" 2>&1 && log "git pull OK" || { log "ERROR en git pull"; sleep 120; continue; }

    mkdir -p "${REPO_DIR}/server/data" "${REPO_DIR}/server/uploads"
    if [ -f "${REPO_DIR}/server/db.json" ] && [ ! -f "${REPO_DIR}/server/data/db.json" ]; then
      cp "${REPO_DIR}/server/db.json" "${REPO_DIR}/server/data/db.json" || { log "ERROR migrando server/db.json"; sleep 120; continue; }
    fi

    docker stop semillero_app 2>/dev/null; docker rm semillero_app 2>/dev/null

    timeout 300 docker build -t semillero_semillero . >> "$LOG" 2>&1 && log "build OK" || { log "ERROR en build"; sleep 120; continue; }

    docker run -d --name semillero_app \
      -p 9023:80 \
      --restart unless-stopped \
      -e PORT=80 \
      -e "ADMIN_PASSWORD=${ADMIN_PASSWORD}" \
      -e "ADMIN_PASSWORD_HASH=${ADMIN_PASSWORD_HASH}" \
      -e "COOKIE_SECRET=${COOKIE_SECRET}" \
      -e "COOKIE_SECURE=${COOKIE_SECURE}" \
      -e "CONTACT_TO=${CONTACT_TO}" \
      -e "SMTP_HOST=${SMTP_HOST}" \
      -e "SMTP_PORT=${SMTP_PORT:-587}" \
      -e "SMTP_SECURE=${SMTP_SECURE:-false}" \
      -e "SMTP_USER=${SMTP_USER}" \
      -e "SMTP_PASS=${SMTP_PASS}" \
      -e "SMTP_FROM=${SMTP_FROM}" \
      -e DATA_DIR=/app/data \
      -v "${REPO_DIR}/server/uploads:/app/server/uploads" \
      -v "${REPO_DIR}/server/data:/app/data" \
      semillero_semillero >> "$LOG" 2>&1 && log "Despliegue completado." || log "ERROR al levantar contenedor"
  else
    log "Sin cambios. (commit: ${LOCAL:0:8})"
  fi

  sleep 120
done
