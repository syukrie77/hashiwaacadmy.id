#!/bin/bash
cd /home/ubuntu/supabase-project-2

# Backup
cp docker-compose.yml docker-compose.yml.bak

# Add FILE_SIZE_LIMIT before TENANT_ID line in storage section
sed -i '/^      TENANT_ID: ${STORAGE_TENANT_ID}$/i\      FILE_SIZE_LIMIT: 524288000' docker-compose.yml

# Verify the change
echo "=== Storage section after fix ==="
grep -A15 'storage:' docker-compose.yml | head -20

# Restart storage container
echo "=== Restarting storage container ==="
docker compose restart storage
echo "=== Done ==="
