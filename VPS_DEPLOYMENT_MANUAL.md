# 🚀 VPS Deployment Manual - Step by Step untuk api.hashiwaacademy.id

## ⚠️ Instruksi Penting
- User: `ubuntu`
- Host: `api.hashiwaacademy.id`
- **JANGAN** ubah setting yang sudah berjalan (hanya update app Hashiwa)

---

## 📋 PRE-DEPLOYMENT CHECKLIST

Sebelum mulai, pastikan:
- [ ] SSH key sudah setup
- [ ] Anda bisa SSH ke VPS tanpa password
- [ ] Folder app sudah ada di VPS
- [ ] `.env.app` sudah ada di VPS

---

## ⚙️ STEP 1: SSH ke VPS

```bash
# Di terminal lokal Anda
ssh ubuntu@api.hashiwaacademy.id

# Confirm host key dengan: yes
# Setelah login, Anda akan di home directory

# Cek lokasi folder app
ls -la ~/
```

**Expected Output:**
```
total xxx
drwxr-xr-x ...
-rw-r--r-- ... .bashrc
-rw-r--r-- ... .profile
drwxr-xr-x ... hashiwa-app  ← Ada folder ini
```

---

## 📍 STEP 2: Navigasi ke Folder App

```bash
# Pergi ke folder app
cd ~/hashiwa-app

# Atau sesuai lokasi Anda
cd /path/to/hashiwa-app

# Verify lokasi (lihat README.md atau package.json)
ls -la

# Harus ada:
# - package.json
# - src/
# - docker-compose.app.yml
# - deploy.sh
```

---

## 📥 STEP 3: Pull Latest Code dari GitHub

```bash
# Lihat status git saat ini
git status

# Pull latest code
git fetch origin
git checkout main
git pull origin main

# Verify files terbaru (terutama login-related files)
ls -la src/pages/login.astro
ls -la src/pages/api/auth/login.ts
ls -la deploy.sh
```

**Expected:** Files sudah updated dengan login error handling

---

## ✅ STEP 4: Verify .env.app Configuration

```bash
# Lihat .env.app (HATI-HATI: jangan share output ini ke publik!)
cat .env.app

# Pastikan ini ada dan benar:
# PUBLIC_SUPABASE_URL=https://api.hashiwaacademy.id
# PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
# SUPABASE_INTERNAL_URL=http://supabase2-kong:8000
# DOCKER_NETWORK_NAME=supabase_default
# APP_PORT=4321
```

**CRITICAL:** Pastikan `PUBLIC_SUPABASE_URL` bukan `localhost`!

Jika perlu ubah:
```bash
# Edit .env.app
nano .env.app

# Buat perubahan sesuai kebutuhan
# Press Ctrl+X, Y, Enter untuk save
```

---

## 🐳 STEP 5: Deploy dengan Script (Auto-build & Restart)

```bash
# Jalankan deploy script
bash deploy.sh

# Script akan:
# 1. Validate .env.app
# 2. Check Docker network
# 3. Build Docker image (--no-cache)
# 4. Restart container
# 5. Check status

# Tunggu sampai selesai (biasanya 2-5 menit)
```

**Expected Output:**
```
========================================
  Hashiwa Academy - Deploy to VPS
========================================

[1/4] Mengecek Docker network...
  ✓ Network ditemukan

[2/4] Mengecek koneksi ke Supabase Kong...
  ✓ Container supabase2-kong ada di network

[3/4] Build Docker image...
(Build process...) 
✓ Docker image built

[4/4] Starting container...
(Restart process...)
✓ Container restarted

========================================
  ✓ DEPLOY BERHASIL!
========================================

Container status: Up X seconds
```

---

## 🔍 STEP 6: Verify Deployment

### Check 1: Container Running

```bash
# Lihat status container
docker ps | grep hashiwa-app

# Harus ada output dengan "hashiwa-app" container status "Up"
```

**Expected:**
```
CONTAINER ID  IMAGE          STATUS
abc123def456  hashiwa-app:latest  Up 2 minutes
```

### Check 2: Lihat Logs

```bash
# Lihat logs (last 20 lines)
docker logs hashiwa-app --tail 20

# Cari ada error atau tidak
# Harus ada logs dari Astro server startup
```

**Expected Logs:**
```
[Astro] server started on 0.0.0.0:4321
```

### Check 3: Test Health Check

```bash
# Test localhost (dari VPS)
curl http://localhost:4321/

# Harus return HTML dari Astro app (bukan error)
```

---

## 🧪 STEP 7: Test Login Error Fix

### Test 1: Via Browser

```
1. Buka https://api.hashiwaacademy.id/login
2. Buka DevTools (F12)
3. Pergi ke Console tab
4. Coba login dengan credentials test

Harus lihat console logs:
[LOGIN] Mengirim request ke /api/auth/login...
[LOGIN] Response status: 200 (atau error code)
[LOGIN] Response data: {...}
```

### Test 2: Via Docker Logs

```bash
# Di VPS terminal, lihat logs real-time
docker logs -f hashiwa-app

# Tunggu sampai ada login attempt
# Cari logs:
# [API/LOGIN] Request received
# [API/LOGIN] Email: ...
# [API/LOGIN] Supabase client initialized
# [API/LOGIN] Login successful for user: ...
```

### Test 3: Successful Login

```bash
# Jika login berhasil:
# ✓ Login dengan credentials benar
# ✓ Redirect ke dashboard
# ✓ Browser console menunjukkan [LOGIN] logs
# ✓ Docker logs menunjukkan [API/LOGIN] logs
```

---

## 🎯 STEP 8: Setup Webhook (OPTIONAL - untuk auto-deploy)

Jika ingin auto-deploy setiap push ke GitHub:

### 8.1 Install Dependencies

```bash
# Pastikan Node.js v14+ installed
node --version

# Install npm packages
npm install express dotenv

# Install PM2 globally untuk manage process
sudo npm install -g pm2
```

### 8.2 Setup Environment

```bash
# Copy webhook config template
cp .env.webhook.example .env.webhook

# Generate webhook secret
WEBHOOK_SECRET=$(openssl rand -hex 32)
echo "Your webhook secret: $WEBHOOK_SECRET"
# Copy output ini untuk langkah GitHub setup

# Edit .env.webhook
nano .env.webhook

# Isi dengan:
# WEBHOOK_PORT=3001
# GITHUB_WEBHOOK_SECRET=<paste secret dari atas>
# REPO_PATH=/home/ubuntu/hashiwa-app (atau sesuai path Anda)
# BRANCH=main

# Save dengan Ctrl+X, Y, Enter
```

### 8.3 Start Webhook Server

```bash
# Start dengan PM2
pm2 start webhook-server.js --name hashiwa-webhook

# Setup untuk auto-start saat reboot
pm2 startup
pm2 save

# Verify running
pm2 status
pm2 logs hashiwa-webhook
```

### 8.4 Setup di GitHub

1. Buka: https://github.com/syukrie77/hashiwaacadmy.id/settings/hooks
2. Add webhook dengan:
   ```
   Payload URL: https://api.hashiwaacademy.id/webhook
   Content type: application/json
   Secret: <paste webhook secret dari 8.2>
   Events: Just the push event
   Active: ☑
   ```
3. Klik "Add webhook"

### 8.5 Test Webhook

```bash
# Di local machine, push ke main
git add .
git commit -m "test: webhook auto-deploy"
git push origin main

# Di VPS, lihat webhook logs
pm2 logs hashiwa-webhook

# Harus ada:
# [timestamp] === WEBHOOK RECEIVED ===
# [timestamp] Push to main detected
# [timestamp] === DEPLOYMENT COMPLETED SUCCESSFULLY ===

# Dan container restart otomatis
docker logs hashiwa-app --tail 5
```

---

## 📊 MONITORING & LOGS

### Lihat App Logs Anytime

```bash
# Last 20 lines
docker logs hashiwa-app --tail 20

# Real-time follow
docker logs -f hashiwa-app

# Search specific logs
docker logs hashiwa-app | grep "[API/LOGIN]"
```

### Lihat Webhook Logs (jika sudah setup)

```bash
# PM2 logs
pm2 logs hashiwa-webhook

# File logs
tail -f webhook-deploy.log

# Check health
curl http://localhost:3001/health
```

### Check Container Status

```bash
# Running containers
docker ps | grep hashiwa

# All logs
docker logs hashiwa-app

# Container stats (CPU, memory)
docker stats hashiwa-app
```

---

## 🐛 TROUBLESHOOTING

### Problem 1: Deploy Gagal - PUBLIC_SUPABASE_URL Error

```
ERROR: PUBLIC_SUPABASE_URL mengandung localhost!
```

**Fix:**
```bash
# Edit .env.app
nano .env.app

# Change dari:
# PUBLIC_SUPABASE_URL=http://localhost:54321

# Ke:
# PUBLIC_SUPABASE_URL=https://api.hashiwaacademy.id

# Save dan redeploy
bash deploy.sh
```

### Problem 2: Login Shows Generic Error

**Check:**
```bash
# 1. Browser console (F12) untuk [LOGIN] logs
# 2. Docker logs untuk [API/LOGIN]
docker logs hashiwa-app | grep "[API/LOGIN]"

# 3. Verify Supabase connectivity
docker exec -it hashiwa-app sh
wget -O- http://supabase2-kong:8000/health
exit
```

### Problem 3: Docker Build Failed

```bash
# Check error messages
docker logs hashiwa-app

# Try rebuild with more info
docker compose -f docker-compose.app.yml --env-file .env.app build

# If still fail, try --no-cache
docker compose -f docker-compose.app.yml --env-file .env.app build --no-cache
```

### Problem 4: Container Won't Start

```bash
# Check if port 4321 already in use
sudo netstat -tlnp | grep 4321

# Check Docker status
docker ps -a | grep hashiwa-app

# Check error logs
docker logs hashiwa-app --tail 50

# Try restart
docker compose -f docker-compose.app.yml --env-file .env.app restart
```

---

## ✨ VERIFICATION CHECKLIST

Setelah deployment, verify:

- [ ] Container running: `docker ps | grep hashiwa-app`
- [ ] Logs clean: `docker logs hashiwa-app` (no errors)
- [ ] App accessible: `https://api.hashiwaacademy.id/login`
- [ ] Login page loads
- [ ] Console logs work (F12)
- [ ] Can see [LOGIN] logs di browser console
- [ ] Docker logs show [API/LOGIN] on login attempt

---

## 📝 Quick Command Reference

```bash
# Deploy
bash deploy.sh

# Check status
docker ps | grep hashiwa-app

# View logs
docker logs hashiwa-app --tail 20

# Real-time logs
docker logs -f hashiwa-app

# Restart
docker compose -f docker-compose.app.yml --env-file .env.app restart

# SSH ke container
docker exec -it hashiwa-app sh

# Start webhook (if setup)
pm2 start webhook-server.js --name hashiwa-webhook

# View webhook logs
pm2 logs hashiwa-webhook

# Check health
curl http://localhost:4321/
```

---

## 🎯 SUMMARY

Anda sudah melakukan:

✅ Pull latest code dengan login error fix  
✅ Verify .env.app configuration  
✅ Deploy dengan `bash deploy.sh`  
✅ Verify container running & logs clean  
✅ Test login functionality  

**Optional:**
✅ Setup webhook untuk auto-deploy (jika diperlukan)  

---

## 📞 NEED HELP?

Jika ada issue:

1. Check logs: `docker logs hashiwa-app | tail -50`
2. Check browser console: F12 → Console tab
3. Read DEBUG_LOGIN_VPS.md untuk detailed troubleshooting
4. Check .env.app configuration
5. Verify Docker network: `docker network ls`

---

**Deployment selesai! App Anda sekarang sudah berjalan dengan error handling yang lebih baik.** 🚀


