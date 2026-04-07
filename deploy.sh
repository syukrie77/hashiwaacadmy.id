#!/bin/bash
# ============================================
# Hashiwa Academy - Deploy Script untuk VPS
# ============================================
set -e

echo "========================================"
echo "  Hashiwa Academy - Deploy to VPS"
echo "========================================"

# Check .env.app exists
if [ ! -f .env.app ]; then
    echo "ERROR: File .env.app tidak ditemukan!"
    echo "Buat dari template: cp .env.app.example .env.app"
    echo "Lalu edit dan isi PUBLIC_SUPABASE_ANON_KEY"
    exit 1
fi

# Load env
source .env.app

# Validate required vars
if [ "$PUBLIC_SUPABASE_ANON_KEY" = "YOUR_ANON_KEY_HERE" ] || [ -z "$PUBLIC_SUPABASE_ANON_KEY" ]; then
    echo "ERROR: PUBLIC_SUPABASE_ANON_KEY belum di-set di .env.app"
    exit 1
fi

# Check Docker network exists
echo ""
echo "[1/4] Mengecek Docker network '${DOCKER_NETWORK_NAME}'..."
if ! docker network inspect "$DOCKER_NETWORK_NAME" > /dev/null 2>&1; then
    echo "ERROR: Docker network '${DOCKER_NETWORK_NAME}' tidak ditemukan!"
    echo "Daftar network yang tersedia:"
    docker network ls
    echo ""
    echo "Edit DOCKER_NETWORK_NAME di .env.app sesuai nama network Supabase"
    exit 1
fi
echo "  ✓ Network ditemukan"

# Check Supabase Kong container is reachable
echo ""
echo "[2/4] Mengecek koneksi ke Supabase Kong..."
if docker network inspect "$DOCKER_NETWORK_NAME" | grep -q "supabase2-kong"; then
    echo "  ✓ Container supabase2-kong ada di network"
else
    echo "  ⚠ Container supabase2-kong TIDAK ditemukan di network"
    echo "    Pastikan Supabase sudah berjalan dan container namanya 'supabase2-kong'"
fi

# Build and deploy
echo ""
echo "[3/4] Build Docker image..."
docker compose -f docker-compose.app.yml --env-file .env.app build --no-cache

echo ""
echo "[4/4] Starting container..."
docker compose -f docker-compose.app.yml --env-file .env.app up -d

# Wait and check
echo ""
echo "Menunggu app startup (5 detik)..."
sleep 5

# Check container status
if docker ps | grep -q "hashiwa-app"; then
    echo ""
    echo "========================================"
    echo "  ✓ DEPLOY BERHASIL!"
    echo "========================================"
    echo ""
    echo "  App berjalan di: http://localhost:${APP_PORT:-4321}"
    echo ""
    echo "  Container status:"
    docker ps --filter name=hashiwa-app --format "    {{.Status}}"
    echo ""
    echo "  Logs (last 10 lines):"
    docker logs hashiwa-app --tail 10 2>&1 | sed 's/^/    /'
    echo ""
    echo "  ─────────────────────────────────────"
    echo "  NEXT: Setup reverse proxy (Nginx/Caddy)"
    echo "  Proxy hashiwaacademy.id → localhost:${APP_PORT:-4321}"
    echo "========================================"
else
    echo ""
    echo "========================================"
    echo "  ✗ DEPLOY GAGAL!"
    echo "========================================"
    echo ""
    echo "  Container tidak berjalan. Cek logs:"
    echo "  docker logs hashiwa-app"
    echo ""
    docker logs hashiwa-app --tail 20 2>&1 | sed 's/^/    /'
    exit 1
fi