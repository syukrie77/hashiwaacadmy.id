# 🚀 GitHub Webhook Auto-Deploy Setup Guide

## 📋 Cara Kerja

```
Anda push code ke GitHub
         ↓
GitHub mengirim webhook ke VPS
         ↓
webhook-server.js menerima & validate
         ↓
Pull latest code dari GitHub
         ↓
Build Docker image baru
         ↓
Restart container dengan code terbaru
         ↓
Auto-deploy selesai! ✅
```

---

## 🎯 Prerequisites

Pastikan sudah ada di VPS:
- ✅ Node.js (v14+)
- ✅ Docker & Docker Compose
- ✅ Git
- ✅ Repository sudah di-clone ke VPS
- ✅ `.env.app` sudah di-setup

---

## ⚙️ STEP 1: Setup Webhook Server di VPS

### 1.1 Copy webhook files ke VPS

```bash
# SSH ke VPS
ssh user@vps_ip

# Pergi ke folder app
cd /path/to/hashiwa-app

# Copy dari repo (jika sudah git pull)
# Files yang diperlukan:
# - webhook-server.js
# - .env.webhook.example
# - package.json (sudah ada)
```

### 1.2 Install dependencies

```bash
# Install express dan dotenv jika belum ada
npm install express dotenv crypto

# Atau update package.json
npm install
```

### 1.3 Setup environment variables

```bash
# Copy template
cp .env.webhook.example .env.webhook

# Edit dengan config VPS Anda
nano .env.webhook
```

**Isi .env.webhook:**
```
WEBHOOK_PORT=3001
GITHUB_WEBHOOK_SECRET=your_secret_here
REPO_PATH=/home/user/hashiwa-app
BRANCH=main
```

---

## 🔐 STEP 2: Setup GitHub Webhook Secret

### 2.1 Generate webhook secret

```bash
# Di VPS, generate random secret
openssl rand -hex 32
# Output: abcd1234efgh5678ijkl9012mnop3456...
```

### 2.2 Update .env.webhook

```bash
# Edit .env.webhook
nano .env.webhook

# Ganti:
GITHUB_WEBHOOK_SECRET=abcd1234efgh5678ijkl9012mnop3456...
```

---

## 📱 STEP 3: Setup GitHub Webhook

### 3.1 Go to GitHub Repository Settings

1. Buka repository di GitHub
2. Settings → Webhooks → Add webhook

### 3.2 Configure Webhook

Fill the form:

```
Payload URL:
  https://your-domain.com/webhook
  
  Atau jika port:
  https://your-domain.com:3001/webhook
  
  PENTING: Harus HTTPS, bukan HTTP!

Content type:
  application/json

Secret:
  (paste secret yang sudah dibuat)
  abcd1234efgh5678ijkl9012mnop3456...

Events:
  ☑ Just the push event (atau bisa select "Send me everything")

Active:
  ☑ Active (pastikan di-check)
```

Klik "Add webhook"

### 3.3 Verify webhook

Setelah create, GitHub akan show "Recent Deliveries":
- Jika ada ✓ (hijau) = berhasil
- Jika ada ✗ (merah) = error, cek logs

---

## 🌐 STEP 4: Setup Reverse Proxy (Nginx)

Webhook server harus accessible dari internet. Setup Nginx reverse proxy:

### 4.1 Create Nginx config

```bash
# Edit Nginx config
sudo nano /etc/nginx/sites-available/hashiwa-webhook

# Paste ini:
```

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Webhook server
    location /webhook {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 60s;
        proxy_connect_timeout 60s;
    }

    # Health check
    location /health {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }

    # Logs endpoint (optional)
    location /logs {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }

    # Redirect main app
    location / {
        proxy_pass http://localhost:4321;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }
}
```

### 4.2 Enable config

```bash
# Symbolic link
sudo ln -s /etc/nginx/sites-available/hashiwa-webhook /etc/nginx/sites-enabled/

# Test config
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### 4.3 Setup SSL (HTTPS)

GitHub webhooks HARUS HTTPS. Gunakan Let's Encrypt:

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Generate certificate
sudo certbot --nginx -d your-domain.com

# Auto-renew
sudo systemctl enable certbot.timer
```

---

## 🚀 STEP 5: Start Webhook Server

### Option A: Manual Start

```bash
# Run server
node webhook-server.js

# Logs akan muncul di terminal
# Tekan Ctrl+C untuk stop
```

### Option B: Using PM2 (Recommended)

PM2 akan keep server running di background dan auto-restart jika crash:

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start webhook server
pm2 start webhook-server.js --name hashiwa-webhook

# Setup auto-start on reboot
pm2 startup
pm2 save

# Check status
pm2 list

# View logs
pm2 logs hashiwa-webhook

# Stop
pm2 stop hashiwa-webhook

# Restart
pm2 restart hashiwa-webhook
```

---

## ✅ STEP 6: Verify Setup

### 6.1 Test webhook server

```bash
# Dari VPS
curl http://localhost:3001/

# Output:
# {
#   "status": "Hashiwa Academy Webhook Server is running",
#   "webhook_url": "/webhook",
#   "timestamp": "2024-04-07T..."
# }
```

### 6.2 Test health check

```bash
curl http://localhost:3001/health

# Output:
# {"status":"ok","timestamp":"2024-04-07T..."}
```

### 6.3 Check logs

```bash
curl http://localhost:3001/logs

# Atau langsung:
cat /path/to/hashiwa-app/webhook-deploy.log
```

### 6.4 Test HTTPS access

```bash
# Dari local machine (bukan VPS)
curl https://your-domain.com/health

# Harus berhasil tanpa SSL error
```

---

## 🧪 STEP 7: Manual Test Deployment

### 7.1 Create test branch

```bash
# Di local machine
git checkout -b test-webhook
echo "# Test" >> README.md
git add README.md
git commit -m "test: webhook deployment"
git push origin test-webhook
```

### 7.2 Create pull request dan merge ke main

1. GitHub → Create Pull Request
2. Merge PR ke main
3. GitHub otomatis send webhook ke server

### 7.3 Check if deployment worked

```bash
# Di VPS
docker logs -f hashiwa-app

# Tunggu dan lihat logs
# Harus ada [API/LOGIN] atau [LOGIN] logs jika ada request

# Atau cek webhook logs:
tail -f /path/to/hashiwa-app/webhook-deploy.log
```

---

## 🎯 Workflow Setelah Setup

Setiap kali Anda push ke GitHub:

```bash
# Di local machine
git add .
git commit -m "feat: update login"
git push origin main
```

VPS akan **otomatis**:
1. Pull latest code ✓
2. Build Docker image ✓
3. Restart container ✓
4. Deploy aplikasi ✓

Tidak perlu manual `bash deploy.sh` lagi! 🎉

---

## 🐛 Troubleshooting

### Problem 1: Webhook tidak trigger

**Check:**
```bash
# Lihat webhook logs di GitHub
GitHub Settings → Webhooks → Recent Deliveries

# Atau check server logs
tail -f /path/to/hashiwa-app/webhook-deploy.log
```

**Fix:**
```bash
# Pastikan webhook URL benar
# Pastikan HTTPS, bukan HTTP
# Pastikan secret sama di GitHub dan .env.webhook
# Restart webhook server
pm2 restart hashiwa-webhook
```

### Problem 2: Deployment gagal

**Check logs:**
```bash
# Webhook server logs
pm2 logs hashiwa-webhook

# Docker logs
docker logs hashiwa-app

# Webhook deploy log
cat /path/to/hashiwa-app/webhook-deploy.log | tail -50
```

**Common issues:**
```
ERROR: .env.app not found
  → .env.app belum ada di VPS

ERROR: Cannot reach Kong
  → Docker network issue, cek DOCKER_NETWORK_NAME di .env.app

ERROR: git pull failed
  → SSH key tidak setup, cek git credentials di VPS
```

### Problem 3: "Connection refused" dari GitHub

**Check:**
```bash
# Pastikan server running
pm2 list | grep hashiwa-webhook

# Pastikan port accessible
sudo netstat -tlnp | grep 3001

# Pastikan Nginx working
sudo systemctl status nginx

# Test locally
curl https://localhost:3001/webhook
```

**Fix:**
```bash
# Restart webhook server
pm2 restart hashiwa-webhook

# Restart Nginx
sudo systemctl restart nginx

# Check firewall
sudo ufw status
sudo ufw allow 443  # HTTPS
sudo ufw allow 80   # HTTP
```

### Problem 4: "Invalid signature"

**Fix:**
```bash
# Check GitHub secret matches .env.webhook
cat .env.webhook | grep WEBHOOK_SECRET

# Compare dengan GitHub Settings → Webhooks → Edit webhook

# Jika berbeda, update .env.webhook dan restart
pm2 restart hashiwa-webhook
```

---

## 📊 Monitoring

### Check webhook status anytime

```bash
# Health check
curl https://your-domain.com/health

# See all logs
curl https://your-domain.com/logs
```

### Setup PM2 monitoring

```bash
# Install PM2 monitoring (optional)
pm2 web

# View dashboard: http://localhost:9615
```

### View real-time logs

```bash
# Option 1: PM2
pm2 logs hashiwa-webhook

# Option 2: Direct file
tail -f /path/to/hashiwa-app/webhook-deploy.log

# Option 3: Docker
docker logs -f hashiwa-app
```

---

## 🔄 Update Webhook Server

Jika ada update ke webhook-server.js:

```bash
# Pull latest code
cd /path/to/hashiwa-app
git pull origin main

# Restart webhook server
pm2 restart hashiwa-webhook
```

---

## 🎓 Security Best Practices

### 1. Always use HTTPS
```
GitHub webhooks harus HTTPS, bukan HTTP
Setup SSL dengan Let's Encrypt
```

### 2. Validate webhook secret
```
Webhook server validate signature dari GitHub
Prevent unauthorized deployments
```

### 3. Limit access
```
Hanya watch main branch
Tidak auto-deploy dari sembarang branch
```

### 4. Monitor logs
```
Regular check webhook logs
Alert jika ada error
```

### 5. Backup before deploy
```
Webhook server check .env.app exist
Prevent deployment tanpa config
```

---

## 🎉 Summary

Sekarang Anda punya fully automated deployment:

✅ Push ke GitHub  
✅ Webhook trigger  
✅ Code pulled  
✅ Docker built  
✅ Container restarted  
✅ Live! 🚀

Tidak perlu manual `bash deploy.sh` lagi!

---

## 📞 Quick Commands

```bash
# Start webhook server (PM2)
pm2 start webhook-server.js --name hashiwa-webhook

# Check status
pm2 status

# View logs
pm2 logs hashiwa-webhook

# Stop
pm2 stop hashiwa-webhook

# Restart
pm2 restart hashiwa-webhook

# Check health
curl https://your-domain.com/health

# View deployment logs
curl https://your-domain.com/logs
```

---

## 🚀 You're All Set!

Webhook auto-deploy sekarang siap digunakan. Setiap push ke GitHub akan automatically deploy ke VPS!

Enjoy automated deployments! 🎊


