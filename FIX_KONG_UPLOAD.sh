#!/bin/bash
# ============================================================
# Script: Fix Kong Body Size Limit for Supabase VPS
# Untuk mengatasi error: "An invalid response from upstream server"
# ============================================================

PROJECT_DIR="/home/ubuntu/supabase-project-2"

echo "========================================"
echo " 🛠️ Fixing Kong Body Size Limit"
echo "========================================"

if [ ! -d "$PROJECT_DIR" ]; then
    echo "ERROR: Project directory $PROJECT_DIR not found!"
    exit 1
fi

cd "$PROJECT_DIR"

# 1. Backup docker-compose.yml
cp docker-compose.yml docker-compose.yml.bak

# 2. Tambahkan environment variable KONG_CLIENT_MAX_BODY_SIZE ke service kong
# Kita cari block 'kong:' lalu tambahkan di bawah 'environment:'
echo "[1/3] Updating docker-compose.yml..."

# Mencari line kong: dan menambahkan environment di bawahnya jika belum ada
# atau update jika sudah ada. 
# Cara paling aman di script bash sederhana:
if grep -q "KONG_CLIENT_MAX_BODY_SIZE" docker-compose.yml; then
    sed -i 's/KONG_CLIENT_MAX_BODY_SIZE: .*/KONG_CLIENT_MAX_BODY_SIZE: 500m/g' docker-compose.yml
else
    # Mencari service kong dan menambahkan environment variable
    # Ini berasumsi struktur standard supabase
    sed -i '/container_name: supabase2-kong/a \    environment:\n      KONG_CLIENT_MAX_BODY_SIZE: 500m' docker-compose.yml
fi

echo "  -> Updated KONG_CLIENT_MAX_BODY_SIZE to 500m"

# 3. Update juga di .env jika diperlukan (beberapa versi menggunakan ini)
if [ -f ".env" ]; then
    if grep -q "KONG_CLIENT_MAX_BODY_SIZE" .env; then
        sed -i 's/^KONG_CLIENT_MAX_BODY_SIZE=.*/KONG_CLIENT_MAX_BODY_SIZE=500m/' .env
    else
        echo "KONG_CLIENT_MAX_BODY_SIZE=500m" >> .env
    fi
    echo "  -> .env updated"
fi

# 4. Restart container
echo ""
echo "[2/3] Restarting Kong container..."
docker compose up -d kong

echo ""
echo "[3/3] Verification..."
docker container inspect supabase2-kong | grep KONG_CLIENT_MAX_BODY_SIZE

echo ""
echo "========================================"
echo " ✅ FIX APPLIED!"
echo " Silakan coba upload video lagi."
echo "========================================"
