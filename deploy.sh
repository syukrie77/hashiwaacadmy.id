#!/bin/bash
###############################################
# HASHIWA E-LEARNING - Deploy ke VPS Ubuntu
# Jalankan script ini di VPS sebagai root
# Folder target: /var/www/hashiwa
###############################################

set -e

IP="101.32.239.76"
FOLDER="/var/www/hashiwa"
COMPOSE_FILE="docker-compose.prod.yml"

echo "=========================================="
echo "  HASHIWA E-LEARNING DEPLOY"
echo "=========================================="

# ==========================================
# STEP 0: Cek prasyarat
# ==========================================
echo ""
echo "[0/7] Cek prasyarat..."

if ! command -v docker &> /dev/null; then
    echo "Docker belum terinstall. Menginstall..."
    apt-get update -qq
    apt-get install -y -qq ca-certificates curl gnupg
    install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    chmod a+r /etc/apt/keyrings/docker.gpg
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
    apt-get update -qq
    apt-get install -y -qq docker-ce docker-ce-cli containerd.io docker-compose-plugin
else
    echo "✓ Docker sudah terinstall"
fi

if ! command -v git &> /dev/null; then
    echo "Git belum terinstall. Menginstall..."
    apt-get install -y -qq git
else
    echo "✓ Git sudah terinstall"
fi

echo "✓ Prasyarat OK"

# ==========================================
# STEP 1: Buat folder & clone repo
# ==========================================
echo ""
echo "[1/7] Setup folder & clone repo..."

mkdir -p "$FOLDER"

if [ -d "$FOLDER/.git" ]; then
    echo "Repo sudah ada, melakukan pull terbaru..."
    cd "$FOLDER"
    git pull origin main || git pull origin master
else
    echo "Cloning repo..."
    cd "$FOLDER"
    git clone https://github.com/syukrie77/e-learning-hashiwa .
fi

echo "✓ Repo siap di $FOLDER"

# ==========================================
# STEP 2: Download Supabase volumes config
# ==========================================
echo ""
echo "[2/7] Download Supabase config files..."

if [ ! -d "$FOLDER/supabase-volumes/api" ]; then
    echo "Cloning supabase/self-hosted untuk ambil config files..."
    git clone --depth 1 https://github.com/supabase/supabase /tmp/supabase-sh
    cp -r /tmp/supabase-sh/docker "$FOLDER/supabase-volumes"
    rm -rf /tmp/supabase-sh
    echo "✓ Supabase volumes config terdownload"
else
    echo "✓ Supabase volumes sudah ada, dilewati"
fi

# ==========================================
# STEP 3: Setup .env
# ==========================================
echo ""
echo "[3/7] Setup environment variables..."

cd "$FOLDER"

if [ ! -f ".env" ]; then
    cp .env.production .env
    
    # Generate random secrets
    JWT_SECRET=$(openssl rand -base64 32)
    PG_META_CRYPTO_KEY=$(openssl rand -base64 32)
    SECRET_KEY_BASE=$(openssl rand -base64 32)
    VAULT_ENC_KEY=$(openssl rand -base64 32)
    POSTGRES_PASSWORD=$(openssl rand -base64 24)
    
    # Generate ANON_KEY dan SERVICE_ROLE_KEY dari JWT_SECRET
    # Menggunakan base64 encode dari JWT payload
    ANON_HEADER=$(echo -n '{"alg":"HS256","typ":"JWT"}' | base64 -w0 | tr '+/' '-_' | tr -d '=')
    ANON_PAYLOAD=$(echo -n '{"iss":"supabase","ref":"hashiwa","role":"anon","iat":'$(date +%s)'}' | base64 -w0 | tr '+/' '-_' | tr -d '=')
    ANON_KEY="${ANON_HEADER}.${ANON_PAYLOAD}.DUMMY_SIGNATURE"
    
    SERVICE_PAYLOAD=$(echo -n '{"iss":"supabase","ref":"hashiwa","role":"service_role","iat":'$(date +%s)'}' | base64 -w0 | tr '+/' '-_' | tr -d '=')
    SERVICE_ROLE_KEY="${ANON_HEADER}.${SERVICE_PAYLOAD}.DUMMY_SIGNATURE"
    
    # Update .env dengan nilai yang benar
    sed -i "s|GantiDenganPasswordYangKuat123!|${POSTGRES_PASSWORD}|g" .env
    sed -i "s|GantiDenganJWTSecretRandom32Char!!|${JWT_SECRET}|g" .env
    sed -i "s|akan_di_generate_otomatis_nanti|${ANON_KEY}|g" .env
    sed -i "s|GantiDenganCryptoKeyRandom32Char!!|${PG_META_CRYPTO_KEY}|g" .env
    sed -i "s|GantiDenganSecretKeyBaseRandom32Char!!|${SECRET_KEY_BASE}|g" .env
    sed -i "s|GantiDenganVaultEncKeyRandom32Char!!|${VAULT_ENC_KEY}|g" .env
    sed -i "s|akan_di_update_setelah_generate|${ANON_KEY}|g" .env
    
    # Fix SERVICE_ROLE_KEY (ANON_KEY muncul 2x, ganti yang kedua)
    # Kita update secara spesifik
    sed -i "0,/akan_di_generate_otomatis_nanti/{s//${ANON_KEY}/}" .env
    #SERVICE_ROLE_KEY perlu di-set manual via sed berikut
    sed -i "/SERVICE_ROLE_KEY=/c\SERVICE_ROLE_KEY=${SERVICE_ROLE_KEY}" .env
    
    echo "✓ .env dibuat dengan random secrets"
    echo ""
    echo "⚠️  PASSWORDS YANG DI-GENERATE (SIMPAN BAIK-BAIK):"
    echo "   POSTGRES_PASSWORD: $POSTGRES_PASSWORD"
    echo "   JWT_SECRET:        $JWT_SECRET"
    echo ""
    echo "⚠️  ANDA HARUS EDIT .env UNTUK MENGISI:"
    echo "   - SMTP_HOST, SMTP_USER, SMTP_PASS (email settings)"
    echo "   - DASHBOARD_USERNAME, DASHBOARD_PASSWORD"
    echo ""
    echo "Jalankan: nano $FOLDER/.env"
    echo ""
    read -p "Tekan ENTER setelah selesai mengedit .env..."
else
    echo "✓ .env sudah ada, dilewati"
fi

# ==========================================
# STEP 4: Build & jalankan Docker containers
# ==========================================
echo ""
echo "[4/7] Build & start containers..."
echo "(Ini bisa memakan waktu 5-15 menit pertama kali)"

cd "$FOLDER"
docker compose -f "$COMPOSE_FILE" up -d --build

echo "✓ Containers di-start"

# ==========================================
# STEP 5: Tunggu semua service sehat
# ==========================================
echo ""
echo "[5/7] Menunggu semua service sehat..."

MAX_WAIT=120
WAITED=0

while [ $WAITED -lt $MAX_WAIT ]; do
    # Cek Kong (indikator utama)
    if docker exec hashiwa-kong curl -s http://localhost:8000/auth/v1/health > /dev/null 2>&1; then
        echo "✓ Semua service sehat (${WAITED}s)"
        break
    fi
    sleep 5
    WAITED=$((WAITED + 5))
    echo "  Menunggu... (${WAITED}s)"
done

if [ $WAITED -ge $MAX_WAIT ]; then
    echo "⚠️  Timeout menunggu service. Cek logs:"
    echo "   docker compose -f $COMPOSE_FILE logs kong"
    echo "   docker compose -f $COMPOSE_FILE logs db"
    exit 1
fi

# ==========================================
# STEP 6: Generate ANON_KEY yang benar dari Kong
# ==========================================
echo ""
echo "[6/7] Update ANON_KEY dari Kong..."

# Ambil ANON_KEY yang digenerate Kong
REAL_ANON_KEY=$(docker exec hashiwa-kong curl -s http://localhost:8000/auth/v1/health 2>/dev/null | head -1 || echo "")

# Update .env dengan ANON_KEY yang benar
if [ -n "$REAL_ANON_KEY" ]; then
    echo "ANON_KEY dari Kong dideteksi"
fi

# Ambil ANON_KEY dari environment Kong
REAL_ANON_KEY=$(docker exec hashiwa-kong printenv SUPABASE_ANON_KEY 2>/dev/null || echo "")

if [ -n "$REAL_ANON_KEY" ]; then
    # Update .env
    sed -i "s|^PUBLIC_SUPABASE_ANON_KEY=.*|PUBLIC_SUPABASE_ANON_KEY=${REAL_ANON_KEY}|g" "$FOLDER/.env"
    sed -i "s|^ANON_KEY=.*|ANON_KEY=${REAL_ANON_KEY}|g" "$FOLDER/.env"
    
    echo "✓ ANON_KEY di-update"
    echo "  ANON_KEY: ${REAL_ANON_KEY:0:50}..."
    
    # Restart app agar pakai ANON_KEY baru
    docker compose -f "$COMPOSE_FILE" restart hashiwa-app
    echo "✓ App di-restart dengan ANON_KEY baru"
else
    echo "⚠️  Tidak bisa ambil ANON_KEY dari Kong. Gunakan ANON_KEY di .env."
    echo "   Cek manual: docker exec hashiwa-kong printenv SUPABASE_ANON_KEY"
fi

# ==========================================
# STEP 7: Selesai - tampilkan info
# ==========================================
echo ""
echo "[7/7] Deploy selesai!"
echo ""
echo "=========================================="
echo "  AKSES APLIKASI"
echo "=========================================="
echo ""
echo "  🌐 Hashiwa App:    http://${IP}:8004"
echo "  🔧 Supabase Studio: http://${IP}:8002"
echo "  🔌 Supabase API:    http://${IP}:8001"
echo "  🐘 Postgres Pooler: ${IP}:8003"
echo ""
echo "=========================================="
echo "  COMMANDS BERGUNA"
echo "=========================================="
echo ""
echo "  Lihat status:    cd $FOLDER && docker compose -f $COMPOSE_FILE ps"
echo "  Lihat logs:      cd $FOLDER && docker compose -f $COMPOSE_FILE logs -f hashiwa-app"
echo "  Restart app:     cd $FOLDER && docker compose -f $COMPOSE_FILE restart hashiwa-app"
echo "  Stop semua:      cd $FOLDER && docker compose -f $COMPOSE_FILE down"
echo "  Rebuild app:     cd $FOLDER && docker compose -f $COMPOSE_FILE up -d --build hashiwa-app"
echo ""
echo "=========================================="
echo "  LANGKAH SELANJUTNYA"
echo "=========================================="
echo ""
echo "  1. Buka Supabase Studio: http://${IP}:8002"
echo "  2. Login dengan DASHBOARD_USERNAME/PASSWORD dari .env"
echo "  3. Jalankan SQL migrations dari folder supabase/*.sql"
echo "     via SQL Editor di Studio"
echo "  4. Setup storage bucket (jika perlu)"
echo "  5. (Opsional) Setup Nginx reverse proxy + SSL"
echo "     Lihat file: $FOLDER/nginx-hashiwa.conf"
echo ""
echo "  Untuk update kode di kemudian hari:"
echo "     cd $FOLDER && git pull"
echo "     docker compose -f $COMPOSE_FILE up -d --build hashiwa-app"
echo ""