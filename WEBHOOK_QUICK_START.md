# ⚡ GitHub Webhook Auto-Deploy - Quick Start (10 menit)

## 🎯 Tujuan
Setiap kali Anda `git push` ke GitHub, VPS otomatis pull code terbaru dan rebuild Docker.

---

## 📋 Checklist Pre-Setup

- [ ] Node.js terinstall di VPS: `node --version`
- [ ] Docker running: `docker ps`
- [ ] Repository sudah di-clone: `ls /path/to/hashiwa-app`
- [ ] `.env.app` sudah ada: `cat /path/to/hashiwa-app/.env.app`
- [ ] Domain untuk webhook (misal: hashiwaacademy.id)

---

## ⚙️ Setup dalam 4 Langkah

### Step 1: Install Dependencies (2 menit)

```bash
# SSH ke VPS
ssh user@vps_ip

# Pergi ke folder app
cd /path/to/hashiwa-app

# Install Node dependencies
npm install express dotenv

# Install PM2 untuk keep server running
sudo npm install -g pm2
```

### Step 2: Setup Environment (2 menit)

```bash
# Copy template
cp .env.webhook.example .env.webhook

# Generate webhook secret
WEBHOOK_SECRET=$(openssl rand -hex 32)
echo "Webhook secret: $WEBHOOK_SECRET"

# Edit .env.webhook
nano .env.webhook

# Isi dengan:
# WEBHOOK_PORT=3001
# GITHUB_WEBHOOK_SECRET=<paste_secret_di_atas>
# REPO_PATH=/path/to/hashiwa-app
# BRANCH=main
```

### Step 3: Start Webhook Server (1 menit)

```bash
# Start server dengan PM2
pm2 start webhook-server.js --name hashiwa-webhook

# Setup auto-restart pada reboot
pm2 startup
pm2 save

# Verify running
pm2 status
```

### Step 4: Setup di GitHub (3 menit)

1. **Buka GitHub Repository Settings:**
   - Repository → Settings → Webhooks → Add webhook

2. **Fill the form:**
   ```
   Payload URL: https://your-domain.com/webhook
   Content type: application/json
   Secret: <paste_webhook_secret_dari_step_2>
   Events: Just the push event
   Active: ☑ checked
   ```

3. **Klik "Add webhook"**

4. **Verifikasi:**
   - Di GitHub, go to Webhooks → Recent Deliveries
   - Lihat apakah ada ✓ (hijau) atau ✗ (merah)

---

## ✅ Testing

### Test 1: Cek webhook server running

```bash
# Di VPS
curl http://localhost:3001/

# Expected:
# {"status":"Hashiwa Academy Webhook Server is running",...}
```

### Test 2: Manual test push

```bash
# Di local machine
git add .
git commit -m "test: webhook auto-deploy"
git push origin main

# Di VPS, cek logs:
pm2 logs hashiwa-webhook

# Atau:
tail -f /path/to/hashiwa-app/webhook-deploy.log

# Harus ada output:
# [timestamp] === WEBHOOK RECEIVED ===
# [timestamp] Push to main detected
# [timestamp] === DEPLOYMENT COMPLETED SUCCESSFULLY ===
```

### Test 3: Check container restarted

```bash
# Di VPS
docker logs hashiwa-app --tail 10

# Harus ada fresh logs dari recent restart
```

---

## 🎉 Done!

Sekarang setiap push ke GitHub, VPS otomatis:
1. Pull latest code
2. Build Docker image  
3. Restart container
4. Deploy live ✓

---

## 📞 Troubleshooting Quick Fixes

| Problem | Command |
|---------|---------|
| Server tidak jalan | `pm2 restart hashiwa-webhook` |
| Webhook tidak trigger | `curl https://your-domain.com/health` |
| Error di logs | `tail -f webhook-deploy.log` |
| Docker build gagal | `docker logs hashiwa-app` |
| Invalid signature | `grep WEBHOOK_SECRET .env.webhook` |

---

## 📚 Full Documentation

- **WEBHOOK_SETUP_GUIDE.md** - Detailed setup dengan semua options
- **WEBHOOK_QUICK_START.md** - This file (fast setup)

---

## 🚀 You're All Set!

Push kode, GitHub trigger webhook, VPS auto-deploy. Selamat! 🎊

Untuk detail lebih lanjut, baca **WEBHOOK_SETUP_GUIDE.md**


