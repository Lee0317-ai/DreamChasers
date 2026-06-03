#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEFAULT_REMOTE_HOST="47.90.180.92"
DEFAULT_REMOTE_USER="root"
DEFAULT_REMOTE_APP_DIR="/root/app/dreamchasers"
DEFAULT_REMOTE_TAR="/root/app/dreamchasers-web-src.tar.gz"
DEFAULT_IMAGE_NAME="dreamchasers-web:latest"
TMPDIR_TO_CLEAN=""

MODE="${1:-local}"
if [[ "$MODE" == "--remote" ]]; then
  shift
else
  MODE="local"
fi

log() {
  printf '[update-deploy] %s\n' "$*"
}

stage_start() {
  local stage="$1"
  log "[stage] start: $stage"
}

stage_done() {
  local stage="$1"
  log "[stage] done: $stage"
}

require_file() {
  if [[ ! -f "$1" ]]; then
    log "missing file: $1"
    exit 1
  fi
}

require_dir() {
  if [[ ! -d "$1" ]]; then
    log "missing directory: $1"
    exit 1
  fi
}

wait_for_http() {
  local url="$1"
  local attempts="${2:-30}"
  local delay="${3:-3}"

  for ((i = 1; i <= attempts; i++)); do
    if curl -fsS "$url" >/dev/null; then
      return 0
    fi
    log "health check not ready ($i/$attempts), retrying in ${delay}s"
    sleep "$delay"
  done

  log "health check failed: $url"
  return 1
}

run_local() {
  local remote_host="${REMOTE_HOST:-$DEFAULT_REMOTE_HOST}"
  local remote_user="${REMOTE_USER:-$DEFAULT_REMOTE_USER}"
  local remote_app_dir="${REMOTE_APP_DIR:-$DEFAULT_REMOTE_APP_DIR}"
  local remote_tar="${REMOTE_TAR:-$DEFAULT_REMOTE_TAR}"
  local image_name="${IMAGE_NAME:-$DEFAULT_IMAGE_NAME}"
  local ssh_target="${remote_user}@${remote_host}"
  local tmpdir
  tmpdir="$(mktemp -d)"
  TMPDIR_TO_CLEAN="$tmpdir"
  trap 'rm -rf "$TMPDIR_TO_CLEAN"' EXIT

  require_file "$PROJECT_ROOT/package.json"
  require_file "$PROJECT_ROOT/package-lock.json"
  require_file "$PROJECT_ROOT/tsconfig.base.json"
  require_dir "$PROJECT_ROOT/apps/web"
  require_dir "$PROJECT_ROOT/packages/shared"
  require_file "$PROJECT_ROOT/docker-compose.prod.yml"
  require_file "$PROJECT_ROOT/deploy/update-deploy.sh"

  stage_start "pack source"
  cat > "$tmpdir/files.txt" <<'FILES'
package.json
package-lock.json
tsconfig.base.json
apps/web
packages/shared
FILES

  COPYFILE_DISABLE=1 tar -czf "$tmpdir/dreamchasers-web-src.tar.gz" \
    --exclude='apps/web/.next' \
    --exclude='apps/web/node_modules' \
    --exclude='node_modules' \
    --exclude='*.log' \
    -C "$PROJECT_ROOT" \
    --files-from "$tmpdir/files.txt"
  stage_done "pack source"

  stage_start "prepare remote directory"
  log "ensuring remote directory: $ssh_target:$remote_app_dir"
  ssh "$ssh_target" "mkdir -p '$remote_app_dir'"
  stage_done "prepare remote directory"

  stage_start "upload source package"
  log "uploading source package"
  scp "$tmpdir/dreamchasers-web-src.tar.gz" "$ssh_target:$remote_tar"
  stage_done "upload source package"

  stage_start "upload compose and script"
  log "uploading compose file and deploy script"
  scp "$PROJECT_ROOT/docker-compose.prod.yml" "$ssh_target:$remote_app_dir/docker-compose.yml"
  scp "$PROJECT_ROOT/deploy/update-deploy.sh" "$ssh_target:$remote_app_dir/update-deploy.sh"

  if [[ -f "$PROJECT_ROOT/deploy/nginx-host.conf" ]]; then
    scp "$PROJECT_ROOT/deploy/nginx-host.conf" "$ssh_target:$remote_app_dir/nginx-host.conf"
  fi
  stage_done "upload compose and script"

  stage_start "remote deploy"
  log "running remote deployment"
  ssh "$ssh_target" "chmod +x '$remote_app_dir/update-deploy.sh' && APP_DIR='$remote_app_dir' SOURCE_TAR='$remote_tar' IMAGE_NAME='$image_name' '$remote_app_dir/update-deploy.sh' --remote"
  stage_done "remote deploy"

  stage_start "public health check"
  log "checking public health"
  wait_for_http "http://$remote_host" 20 3
  stage_done "public health check"

  log "local deployment finished: http://$remote_host"
}

run_remote() {
  local app_dir="${APP_DIR:-$DEFAULT_REMOTE_APP_DIR}"
  local source_tar="${SOURCE_TAR:-${1:-$DEFAULT_REMOTE_TAR}}"
  local env_file="${ENV_FILE:-$app_dir/.env.production}"
  local image_name="${IMAGE_NAME:-$DEFAULT_IMAGE_NAME}"
  local npm_registry="${NPM_REGISTRY:-https://registry.npmmirror.com/}"

  require_dir "$app_dir"
  require_file "$source_tar"
  require_file "$env_file"
  require_file "$app_dir/docker-compose.yml"

  cd "$app_dir"

  stage_start "clean remote source"
  log "cleaning previous source files"
  rm -rf apps packages package.json package-lock.json tsconfig.base.json node_modules apps/web/node_modules apps/web/.next
  stage_done "clean remote source"

  stage_start "extract source"
  log "extracting source package: $source_tar"
  tar -xzf "$source_tar" -C "$app_dir"
  stage_done "extract source"

  stage_start "build image"
  log "building image: $image_name"
  docker build \
    --network host \
    --platform linux/amd64 \
    --build-arg "NPM_REGISTRY=$npm_registry" \
    -f apps/web/Dockerfile \
    -t "$image_name" \
    .
  stage_done "build image"

  stage_start "restart compose"
  log "restarting compose stack"
  docker compose --env-file "$env_file" up -d
  stage_done "restart compose"

  stage_start "inspect service status"
  log "current service status"
  docker compose --env-file "$env_file" ps
  stage_done "inspect service status"

  stage_start "local health check"
  log "checking local health"
  wait_for_http "http://127.0.0.1:3000" 30 3
  stage_done "local health check"

  log "remote deployment finished"
}

case "$MODE" in
  local)
    run_local
    ;;
  --remote)
    run_remote "$@"
    ;;
  --help|-h|help)
    cat <<'USAGE'
Usage:
  bash deploy/update-deploy.sh

Environment overrides:
  REMOTE_HOST=47.90.180.92
  REMOTE_USER=root
  REMOTE_APP_DIR=/root/app/dreamchasers
  REMOTE_TAR=/root/app/dreamchasers-web-src.tar.gz
  IMAGE_NAME=dreamchasers-web:latest
USAGE
    ;;
  *)
    run_local
    ;;
esac
