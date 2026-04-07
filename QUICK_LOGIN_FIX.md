# ⚡ QUICK LOGIN FIX - 5 Menit Setup

## 🎯 TL;DR - Yang Perlu Dilakukan

### 1️⃣ Pull Latest Code
```bash
cd /path/to/vps/hashiwa-app
git pull origin main
```

### 2️⃣ Validasi .env.app
```bash
cat .env.app
```

**PASTIKAN:**
```
PUBLIC_SUPABASE_URL=https://api.hashiwaacademy.id          ← BUKAN localhost!
PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...                     ← Valid key
SUPABASE_INTERNAL_URL=http://supabase2-kong:8000           ← Internal Docker
DOCKER_NETWORK_NAME=supabase_default                       ← Correct name
```

### 3️⃣ Deploy
```bash
bash deploy.sh
```

### 4️⃣ Verify
```bash
# Check logs
docker logs -f hashiwa-app

# Test login dari browser
# Buka: https://hashiwaacademy.id/login
# Buka Console (F12) - lihat logs [LOGIN] dan [API/LOGIN]
```

---

## ❌ Jika Masih Error

### Error: "Network error" / "Connection refused"
```bash
# Perbaiki PUBLIC_SUPABASE_URL
nano .env.app
# PUBLIC_SUPABASE_URL harus DOMAIN PUBLIC, bukan localhost!
# Contoh: https://api.hashiwaacademy.id

# Rebuild docker
docker compose -f docker-compose.app.yml --env-file .env.app build --no-cache
docker compose -f docker-compose.app.yml --env-file .env.app up -d
```

### Error: "Failed to initialize Supabase client"
```bash
# Cek ANON_KEY
cat .env.app | grep PUBLIC_SUPABASE_ANON_KEY

# Jika tidak valid, dapatkan dari Supabase:
docker exec supabase2-postgres psql -U postgres -d postgres -c "SELECT value FROM vault.secrets WHERE name = 'anon-key';"

# Update .env.app dan rebuild
nano .env.app
docker compose -f docker-compose.app.yml --env-file .env.app build --no-cache
docker compose -f docker-compose.app.yml --env-file .env.app up -d
```

### Error: "Docker network not found"
```bash
# Check network name
docker network ls | grep supabase

# Update DOCKER_NETWORK_NAME di .env.app dengan nama yang benar
nano .env.app
# DOCKER_NETWORK_NAME=<CORRECT_NAME>

# Rebuild
docker compose -f docker-compose.app.yml --env-file .env.app build --no-cache
docker compose -f docker-compose.app.yml --env-file .env.app up -d
```

---

## 🔍 Debug Output di Console

Saat login, Anda akan lihat di browser Console (F12):

**Successful:**
```
[LOGIN] Mengirim request ke /api/auth/login...
[LOGIN] Response status: 200
[LOGIN] Response data: {message: "Login successful", user: {...}}
[LOGIN] Login successful!
```

**Failed:**
```
[LOGIN] Mengirim request ke /api/auth/login...
[LOGIN] Response status: 401
[LOGIN] Response data: {error: "Invalid credentials"}
[LOGIN] Login failed: Invalid credentials
```

---

## 📊 Server Logs
```bash
docker logs hashiwa-app --tail 20 | grep "\[API/LOGIN\]"
```

**Successful:**
```
[API/LOGIN] Request received
[API/LOGIN] Email: user@example.com Password length: 8
[API/LOGIN] Initializing Supabase server client...
[API/LOGIN] Supabase client initialized
[API/LOGIN] Attempting signInWithPassword...
[API/LOGIN] Login successful for user: user@example.com
```

**Failed:**
```
[API/LOGIN] Request received
[API/LOGIN] Email: user@example.com Password length: 8
[API/LOGIN] Auth error: Invalid credentials Code: invalid_credentials
```

---

## 📚 Dokumentasi Lengkap

- **LOGIN_FIX_SUMMARY.md** - Overview dan penjelasan lengkap
- **DEBUG_LOGIN_VPS.md** - Comprehensive debugging guide
- **QUICK_LOGIN_FIX.md** - This file (quick reference)

---

## ✨ Yang Diperbaiki

✅ Better error messages di frontend  
✅ Detailed logging di API endpoint  
✅ Deployment validation lebih ketat  
✅ Comprehensive debugging tools  

**Selesai! Login error sekarang lebih mudah di-debug.** 🚀


