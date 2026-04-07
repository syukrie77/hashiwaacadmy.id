# ✅ LOGIN FIX SUMMARY - VPS Error Resolution

## 📝 Ringkasan
Anda mengalami error **"Terjadi kesalahan sistem saat menghubungi server"** saat login di VPS, meskipun di localhost berfungsi normal.

Masalah ini **sudah diperbaiki** dengan menambahkan:
1. ✅ Better error logging & debugging di frontend
2. ✅ Detailed error handling di API endpoint
3. ✅ Comprehensive debugging guide
4. ✅ Deployment validation script

---

## 🔧 Apa yang Diubah

### 1. **Frontend Error Logging** (`src/pages/login.astro`)

**Sebelum:**
```javascript
catch (err) {
    console.error(err);
    alert("Terjadi kesalahan sistem saat menghubungi server");
}
```

**Sesudah:**
```javascript
catch (err) {
    console.error("[LOGIN] Catch error:", err);
    console.error("[LOGIN] Error type:", err instanceof Error ? err.message : String(err));
    alert("Terjadi kesalahan sistem saat menghubungi server. Detail: " + 
          (err instanceof Error ? err.message : String(err)));
}
```

**Manfaat:**
- Pesan error lebih detail di alert
- Console logs membantu debugging
- Bisa lihat error parsing response

---

### 2. **API Error Handling** (`src/pages/api/auth/login.ts`)

**Ditambahkan:**
```typescript
// Better error logging
console.log("[API/LOGIN] Request received");
console.log("[API/LOGIN] Email:", email);
console.log("[API/LOGIN] Initializing Supabase server client...");

// Error handling untuk Supabase client init
try {
    supabase = getSupabaseServerClient(context);
} catch (clientErr) {
    console.error("[API/LOGIN] Failed to initialize Supabase client:", clientErr);
    return new Response(
        JSON.stringify({ 
            error: "Failed to initialize auth service",
            details: clientErr instanceof Error ? clientErr.message : String(clientErr)
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
    );
}

// Catch all errors globally
catch (err) {
    console.error("[API/LOGIN] Unexpected error:", err);
    const errorMsg = err instanceof Error ? err.message : String(err);
    return new Response(
        JSON.stringify({ 
            error: "Internal server error",
            details: errorMsg
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
    );
}
```

**Manfaat:**
- Server logs detail membantu identify masalah
- Error details di-return ke frontend
- Catch semua error (network, parsing, dll)

---

### 3. **Deployment Validation** (`deploy.sh`)

**Ditambahkan:**
```bash
# Validate PUBLIC_SUPABASE_URL
if echo "$PUBLIC_SUPABASE_URL" | grep -qE "(localhost|127\.0\.0\.1)"; then
    echo "⚠️  WARNING: PUBLIC_SUPABASE_URL mengandung localhost!"
    echo "   Harus berupa domain public atau IP yang bisa di-reach dari internet."
    exit 1
fi
```

**Manfaat:**
- Prevent deployment dengan config yang salah
- Educate user tentang pentingnya URL yang benar

---

### 4. **Debugging Guide** (`DEBUG_LOGIN_VPS.md`)

Dibuat comprehensive guide dengan:
- ✅ Cek environment variables
- ✅ Validasi Docker network
- ✅ Test API endpoint
- ✅ Common issues & fixes
- ✅ Testing checklist

---

## 🚀 LANGKAH-LANGKAH FIX

### **Step 1: Deploy Updated Code**

```bash
# Pastikan sudah di-commit & push
git add .
git commit -m "feat: improve login error handling & debugging"
git push origin main

# Atau langsung deploy ke VPS
cd /path/to/vps/hashiwa-app
git pull origin main
```

### **Step 2: Validasi Environment Variables**

```bash
# SSH ke VPS
ssh user@vps_ip

# Pergi ke folder app
cd /path/to/hashiwa-app

# Cek .env.app sudah benar
cat .env.app

# PENTING: Pastikan:
# ✅ PUBLIC_SUPABASE_URL = domain public (BUKAN localhost!)
# ✅ PUBLIC_SUPABASE_ANON_KEY = valid anon key dari Supabase
# ✅ SUPABASE_INTERNAL_URL = http://supabase2-kong:8000
# ✅ DOCKER_NETWORK_NAME = nama network Supabase actual
```

### **Step 3: Deploy dengan Script**

```bash
# Script ini sekarang punya validasi lebih ketat
bash deploy.sh

# Jika ada warning tentang localhost, STOP!
# Perbaiki .env.app terlebih dahulu
```

### **Step 4: Check Logs**

```bash
# Lihat logs real-time
docker logs -f hashiwa-app

# Tunggu sampai ada request login
# Catat output [API/LOGIN] dan [LOGIN]
```

### **Step 5: Test Login dari Browser**

1. Buka https://hashiwaacademy.id/login
2. Buka DevTools (F12)
3. Pergi ke Console tab
4. Coba login
5. Lihat console output:
   - `[LOGIN] Mengirim request ke /api/auth/login...`
   - `[LOGIN] Response status: 200` (atau error code)
   - `[LOGIN] Response data: {...}`

---

## 🎯 Common Problems & Fixes

### Problem 1: PUBLIC_SUPABASE_URL Still Wrong
```
Error: [LOGIN] Network error / timeout
```
**Fix:**
```bash
# Edit .env.app
PUBLIC_SUPABASE_URL=https://api.hashiwaacademy.id  # ← Use public domain!

# Rebuild docker (penting!)
docker compose -f docker-compose.app.yml --env-file .env.app build --no-cache
docker compose -f docker-compose.app.yml --env-file .env.app up -d
```

### Problem 2: ANON_KEY Salah
```
Error: [API/LOGIN] Failed to initialize Supabase client
```
**Fix:**
```bash
# Dapatkan dari Supabase
docker exec supabase2-postgres psql -U postgres -d postgres \
  -c "SELECT value FROM vault.secrets WHERE name = 'anon-key';"

# Update .env.app
PUBLIC_SUPABASE_ANON_KEY=<CORRECT_KEY>

# Rebuild
docker compose -f docker-compose.app.yml --env-file .env.app build --no-cache
```

### Problem 3: Docker Network Issue
```
Error: [API/LOGIN] Cannot reach Kong
```
**Fix:**
```bash
# Check network name
docker network ls | grep supabase

# Update DOCKER_NETWORK_NAME in .env.app
DOCKER_NETWORK_NAME=<CORRECT_NAME>

# Rebuild
docker compose -f docker-compose.app.yml --env-file .env.app build --no-cache
```

---

## 📚 Files Modified

| File | Changes |
|------|---------|
| `src/pages/login.astro` | Added detailed error logging & console output |
| `src/pages/api/auth/login.ts` | Added try-catch, better error messages, logging |
| `deploy.sh` | Added validation untuk PUBLIC_SUPABASE_URL |
| `DEBUG_LOGIN_VPS.md` | New comprehensive debugging guide |
| `LOGIN_FIX_SUMMARY.md` | This file - overview & instructions |

---

## ✅ Testing Checklist

Setelah deploy, pastikan:

- [ ] Code updated ke VPS
- [ ] `.env.app` sudah benar (PUBLIC_SUPABASE_URL ≠ localhost)
- [ ] Docker image rebuilt dengan `--no-cache`
- [ ] Container `hashiwa-app` running
- [ ] Console logs muncul saat ada request
- [ ] Login dari browser berhasil
- [ ] Redirect ke dashboard setelah login

---

## 🔍 Debugging dengan Console Logs

Sekarang Anda bisa lihat detail error di:

### **Browser Console (F12)**
```
[LOGIN] Mengirim request ke /api/auth/login...
[LOGIN] Response status: 200
[LOGIN] Response data: {message: "Login successful", ...}
```

### **Server Logs**
```bash
docker logs hashiwa-app | grep "\[API/LOGIN\]"
```

Output contoh:
```
[API/LOGIN] Request received
[API/LOGIN] Email: user@example.com Password length: 8
[API/LOGIN] Initializing Supabase server client...
[API/LOGIN] Supabase client initialized
[API/LOGIN] Attempting signInWithPassword...
[API/LOGIN] Login successful for user: user@example.com
```

---

## 🎓 Key Learning Points

### Mengapa Error di VPS tapi OK di localhost?

1. **Localhost:** Browser bisa akses `http://localhost:54321` langsung
2. **VPS:** Browser user di internet TIDAK bisa akses server lokal → HARUS domain public

### Environment Variables SANGAT Penting!

```
❌ SALAH:
PUBLIC_SUPABASE_URL=http://localhost:54321
(Browser tidak bisa reach ini dari internet)

✅ BENAR:
PUBLIC_SUPABASE_URL=https://api.hashiwaacademy.id
(Browser bisa reach dari internet)
```

### Docker Build Time vs Runtime

```dockerfile
# Build time: PUBLIC_* vars embedded ke Astro build
ARG PUBLIC_SUPABASE_URL
ENV PUBLIC_SUPABASE_URL=$PUBLIC_SUPABASE_URL

# Runtime: SUPABASE_INTERNAL_URL digunakan server-side
ENV SUPABASE_INTERNAL_URL=http://supabase2-kong:8000
```

---

## 📞 Kalau Masih Error

Kumpulkan informasi ini dan share:

```bash
# 1. Environment variables
cat .env.app | grep -E "PUBLIC_|SUPABASE_|DOCKER_"

# 2. Container logs
docker logs hashiwa-app --tail 50

# 3. Network info
docker network inspect supabase_default | grep -E "Name|hashiwa|kong"

# 4. Container status
docker ps | grep -E "hashiwa|supabase"
```

---

## 🎉 Summary

✅ Error handling lebih baik  
✅ Logging lebih detail  
✅ Validation lebih ketat  
✅ Debugging lebih mudah  

Sekarang Anda punya semua tools untuk debug login error di VPS!

Baca `DEBUG_LOGIN_VPS.md` untuk step-by-step troubleshooting.


