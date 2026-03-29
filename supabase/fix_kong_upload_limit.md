# Fix Kong API Gateway Upload Limit (Self-Hosted Supabase)

## Masalah
Upload video gagal karena Kong API Gateway membatasi ukuran request body.
Error: "An invalid response was received from the upstream server"

## Solusi: Tambahkan `client_max_body_size` di Kong

### Langkah 1: SSH ke VPS
```bash
ssh root@101.32.239.76
```

### Langkah 2: Edit Kong Configuration
Cari file `kong.yml` di folder docker supabase project Anda.

```bash
# Cari lokasi kong.yml
find / -name "kong.yml" 2>/dev/null
```

### Langkah 3: Tambahkan Plugin `request-size-limiting`
Di bagian `plugins` pada `kong.yml`, tambahkan/edit:

```yaml
plugins:
  - name: request-size-limiting
    config:
      allowed_payload_size: 600  # Dalam MB (600MB untuk video)
```

Atau jika menggunakan `nginx_http_client_max_body_size`:

```bash
# Di environment variables Kong atau docker-compose.yml
KONG_NGINX_HTTP_CLIENT_MAX_BODY_SIZE: "600m"
KONG_NGINX_PROXY_PROXY_BUFFER_SIZE: "160k"
KONG_NGINX_PROXY_PROXY_BUFFERS: "64 160k"
```

### Langkah 4: Jika Menggunakan docker-compose.yml
Edit `docker-compose.yml` pada service `kong`:

```yaml
services:
  kong:
    environment:
      KONG_NGINX_PROXY_CLIENT_MAX_BODY_SIZE: "600m"
      # ... existing vars
```

### Langkah 5: Restart Kong
```bash
cd /path/to/supabase-docker
docker compose restart kong
```

### Langkah 6: Verifikasi
Upload video kecil (< 5MB) dulu untuk test.
Jika berhasil, coba video besar bertahap (10MB, 50MB, 100MB).

## Alternatif: Cek Nginx (Jika Ada Reverse Proxy di Depan Kong)
```bash
# Edit /etc/nginx/nginx.conf atau site config
client_max_body_size 600M;
proxy_read_timeout 600;
proxy_connect_timeout 600;
proxy_send_timeout 600;
```

Restart nginx:
```bash
sudo systemctl restart nginx
```
