# 🔍 DEBUG GUIDE - LOGIN ERROR DI VPS

## 📋 Ringkasan Masalah
Error **"Terjadi kesalahan sistem saat menghubungi server"** terjadi saat login di VPS, padahal di localhost berfungsi normal.

---

## 🚀 LANGKAH 1: Cek Environment Variables di VPS

### A. Verifikasi `.env.app` di VPS

```bash
# SSH ke VPS
cd /path/to/hashiwa-app

# Cek file .env.app sudah ada
ls -la .env.app

# Baca isi (HATI-HATI: jangan commit ke git!)
cat .env.app
```

**Yang harus ada:**
```
PUBLIC_SUPABASE_URL=https://api.hashiwaacademy.id      ← URL public dari browser
PUBLIC_SUPABASE_ANON_KEY=<KUNCI_DARI_SUPABASE>         ← Anon key (public safe)
SUPABASE_INTERNAL_URL=http://supabase2-kong:8000       ← URL internal Docker
DOCKER_NETWORK_NAME=supabase_default                   ← Nama network Supabase
APP_PORT=4321
```

### B. Validasi PUBLIC_SUPABASE_URL

```bash
# PUBLIC_SUPABASE_URL HARUS bisa diakses dari BROWSER user, BUKAN localhost!

# ❌ SALAH:
PUBLIC_SUPABASE_URL=http://localhost:54321
PUBLIC_SUPABASE_URL=http://127.0.0.1:54321

# ✅ BENAR:
PUBLIC_SUPABASE_URL=https://api.hashiwaacademy.id      # Domain Supabase public
PUBLIC_SUPABASE_URL=https://your-supabase.supabase.co  # Atau dari Supabase

# Test dari browser apakah URL bisa di-reach:
curl -I https://api.hashiwaacademy.id/
# Harus return 200 atau 301, bukan error
```

---

## 🐳 LANGKAH 2: Cek Docker Network & Connectivity

### A. Periksa Network Supabase

```bash
# List semua Docker network
docker network ls

# Cari network Supabase (biasanya: supabase_default atau <folder>_default)
docker network inspect supabase_default | grep -E "Name|subnet"
```

### B. Verifikasi Container Connections

```bash
# Pastikan hashiwa-app container connected ke network Supabase
docker network inspect supabase_default | grep hashiwa-app

# Cek apakah supabase2-kong ada di network yang sama
docker network inspect supabase_default | grep supabase2-kong

# Jika tidak ada, rebuild dan redeploy:
docker compose -f docker-compose.app.yml --env-file .env.app up -d
```

### C. Test Internal Connectivity (dari dalam container)

```bash
# Masuk ke hashiwa-app container
docker exec -it hashiwa-app sh

# Test koneksi ke Supabase Kong (internal)
wget -q -O- http://supabase2-kong:8000/health
# Harus return 200 atau sesuatu (bukan timeout/unreachable)

# Exit
exit
```

---

## 📊 LANGKAH 3: Cek Container Logs

### A. Real-time Logs dari hashiwa-app

```bash
# Follow logs (Ctrl+C untuk exit)
docker logs -f hashiwa-app

# Tunggu sampai ada error login, catat pesan error-nya
# Cari pattern: [API/LOGIN], [LOGIN], [Middleware]
```

### B. Logs dari Supabase Kong

```bash
# Jika ada error koneksi ke Supabase
docker logs -f supabase2-kong | grep -i error
```

### C. Logs Lengkap (last 100 lines)

```bash
docker logs hashiwa-app --tail 100
```

---

## 🔗 LANGKAH 4: Test API Endpoint Directly

### A. Test dari VPS (curl)

```bash
# Test ke localhost (dari dalam VPS)
curl -X POST http://localhost:4321/api/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "email=test@example.com&password=password123"

# Harus return JSON response (success atau error message)
```

### B. Test dari Browser User

Buka browser dev tools (F12), pergi ke Console tab:

```javascript
// Test login API
fetch('/api/auth/login', {
    method: 'POST',
    body: new FormData(document.querySelector('form'))
})
.then(r => r.json())
.then(data => console.log('SUCCESS:', data))
.catch(err => console.error('ERROR:', err))
```

Lihat di Console untuk error detail.

---

## 🎯 LANGKAH 5: Common Issues & Fixes

### Issue 1: PUBLIC_SUPABASE_URL tidak bisa diakses dari browser
```
Error: Network error / CORS error / Connection refused
```

**Fix:**
```bash
# Pastikan PUBLIC_SUPABASE_URL adalah domain public yang valid
# Test dari browser:
curl https://api.hashiwaacademy.id/

# Update .env.app
PUBLIC_SUPABASE_URL=https://api.hashiwaacademy.id

# Rebuild docker image (penting untuk env vars!)
docker compose -f docker-compose.app.yml --env-file .env.app build --no-cache

# Redeploy
docker compose -f docker-compose.app.yml --env-file .env.app up -d
```

### Issue 2: SUPABASE_INTERNAL_URL tidak bisa direach (server-side)
```
Error: [API/LOGIN] Failed to initialize Supabase client: Cannot reach Kong
```

**Fix:**
```bash
# Cek apakah supabase2-kong running
docker ps | grep supabase2-kong

# Cek Docker network name di .env.app sesuai actual network
docker network ls | grep supabase

# Update DOCKER_NETWORK_NAME jika perlu
# Contoh jika folder Supabase bernama "supabase2":
DOCKER_NETWORK_NAME=supabase2_default

# Rebuild
docker compose -f docker-compose.app.yml --env-file .env.app build --no-cache
docker compose -f docker-compose.app.yml --env-file .env.app up -d
```

### Issue 3: PUBLIC_SUPABASE_ANON_KEY salah/kosong
```
Error: [API/LOGIN] Failed to initialize Supabase client: Missing ANON_KEY
```

**Fix:**
```bash
# Dapatkan ANON_KEY dari server Supabase
# (Login ke VPS tempat Supabase running)

# Cek di container Supabase
docker exec supabase2-postgres psql -U postgres -d postgres -c "SELECT value FROM vault.secrets WHERE name = 'anon-key';"

# Atau dari Supabase dashboard
# Atau dari config Supabase:
cat /path/to/supabase/.env | grep ANON_KEY

# Update .env.app
PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Rebuild!
docker compose -f docker-compose.app.yml --env-file .env.app build --no-cache
```

---

## ✅ TESTING CHECKLIST

Setelah apply fixes, jalankan checklist ini:

- [ ] `.env.app` ada dan lengkap di VPS
- [ ] `PUBLIC_SUPABASE_URL` bisa di-akses dari browser (https, bukan localhost)
- [ ] `PUBLIC_SUPABASE_ANON_KEY` sudah di-set dengan benar
- [ ] `SUPABASE_INTERNAL_URL` = `http://supabase2-kong:8000`
- [ ] `DOCKER_NETWORK_NAME` sesuai dengan nama network Supabase actual
- [ ] Docker container `hashiwa-app` connected ke Supabase network
- [ ] Container `supabase2-kong` running dan healthy
- [ ] Bisa reach `http://localhost:4321` dari VPS
- [ ] Logs tidak ada error "[API/LOGIN]" atau "[Middleware]"
- [ ] Login test dari browser berhasil

---

## 📞 Kalau Masih Error

Jika sudah coba semua tapi masih error, kumpulkan informasi ini:

1. **Output dari:**
   ```bash
   docker logs hashiwa-app --tail 50
   docker network inspect supabase_default | grep -E "Name|hashiwa|kong"
   cat .env.app | grep -E "PUBLIC_|SUPABASE_|DOCKER_"
   ```

2. **Browser Console (F12):**
   - Screenshot error message
   - Console output dari network tab

3. **Cek connectivity:**
   ```bash
   docker exec -it hashiwa-app sh
   wget -v http://supabase2-kong:8000/health
   curl -v https://api.hashiwaacademy.id/
   ```

Dengan informasi ini, kita bisa debug lebih cepat!

---

## 🎓 Penjelasan Singkat

**Mengapa error di VPS tapi OK di localhost?**

1. Di localhost: `import.meta.env.PUBLIC_SUPABASE_URL` = `http://localhost:54321` (bisa di-reach dari browser lokal)
2. Di VPS: `import.meta.env.PUBLIC_SUPABASE_URL` harus URL public yang di-route ke Supabase server
3. Jika masih `localhost` di VPS → Browser user tidak bisa reach → Connection error
4. API endpoint juga perlu `SUPABASE_INTERNAL_URL` untuk server-side communication yang lebih cepat

**Moral cerita:** Environment variables SANGAT penting! Harus di-set dengan benar sesuai environment (localhost vs VPS).


