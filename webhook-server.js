#!/usr/bin/env node

/**
 * GitHub Webhook Server untuk Auto-Deploy Hashiwa Academy
 * 
 * Cara kerja:
 * 1. GitHub mengirim webhook ke server ini setiap kali ada push
 * 2. Server validate webhook signature
 * 3. Server pull latest code dari git
 * 4. Server rebuild dan restart Docker container
 * 5. Server log semua activity
 * 
 * Setup:
 * 1. npm install express crypto dotenv
 * 2. Copy .env.webhook ke VPS
 * 3. node webhook-server.js
 * 
 * Atau pakai PM2:
 * 1. npm install -g pm2
 * 2. pm2 start webhook-server.js --name hashiwa-webhook
 * 3. pm2 save && pm2 startup
 */

const express = require('express');
const crypto = require('crypto');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.webhook' });

const app = express();
const PORT = process.env.WEBHOOK_PORT || 3000;
const SECRET = process.env.GITHUB_WEBHOOK_SECRET || '';
const REPO_PATH = process.env.REPO_PATH || '/home/user/hashiwa-app';
const BRANCH = process.env.BRANCH || 'main';

// Log file
const logFile = path.join(REPO_PATH, 'webhook-deploy.log');

// Middleware
app.use(express.json());

// Helper: append to log
function log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    console.log(logMessage);
    try {
        fs.appendFileSync(logFile, logMessage);
    } catch (err) {
        console.error('Failed to write to log file:', err);
    }
}

// Helper: execute command
function executeCommand(command, cwd = REPO_PATH) {
    return new Promise((resolve, reject) => {
        log(`Executing: ${command}`);
        exec(command, { cwd }, (error, stdout, stderr) => {
            if (stdout) log(`stdout: ${stdout}`);
            if (stderr) log(`stderr: ${stderr}`);
            if (error) {
                log(`ERROR: ${error.message}`);
                reject(error);
            } else {
                resolve(stdout);
            }
        });
    });
}

// Helper: validate webhook signature
function verifyWebhookSignature(req) {
    if (!SECRET) {
        log('WARNING: GITHUB_WEBHOOK_SECRET not set, skipping signature verification');
        return true;
    }

    const signature = req.headers['x-hub-signature-256'];
    if (!signature) {
        log('ERROR: No x-hub-signature-256 header found');
        return false;
    }

    const body = req.rawBody || JSON.stringify(req.body);
    const hash = 'sha256=' + crypto
        .createHmac('sha256', SECRET)
        .update(body)
        .digest('hex');

    const valid = crypto.timingSafeEqual(hash, signature);
    if (!valid) {
        log('ERROR: Invalid webhook signature');
    }
    return valid;
}

// Middleware untuk capture raw body
app.use((req, res, next) => {
    let data = '';
    req.on('data', chunk => {
        data += chunk;
    });
    req.on('end', () => {
        req.rawBody = data;
        next();
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        status: 'Hashiwa Academy Webhook Server is running',
        webhook_url: `/webhook`,
        timestamp: new Date().toISOString()
    });
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Logs endpoint
app.get('/logs', (req, res) => {
    try {
        const logs = fs.readFileSync(logFile, 'utf-8');
        res.type('text/plain').send(logs);
    } catch (err) {
        res.json({ error: 'No logs yet', message: err.message });
    }
});

// Main webhook endpoint
app.post('/webhook', async (req, res) => {
    try {
        log('=== WEBHOOK RECEIVED ===');
        log(`Event: ${req.headers['x-github-event']}`);

        // Validate signature
        if (!verifyWebhookSignature(req)) {
            return res.status(401).json({ error: 'Invalid signature' });
        }

        const payload = req.body;
        const eventType = req.headers['x-github-event'];

        // Only process push events
        if (eventType !== 'push') {
            log(`Ignoring event type: ${eventType}`);
            return res.json({ status: 'ignored', reason: 'not a push event' });
        }

        // Check branch
        const ref = payload.ref; // refs/heads/main
        const currentBranch = ref.split('/').pop();
        if (currentBranch !== BRANCH) {
            log(`Ignoring push to branch: ${currentBranch} (watching ${BRANCH})`);
            return res.json({ status: 'ignored', reason: `not ${BRANCH} branch` });
        }

        log(`Push to ${BRANCH} detected`);
        log(`Commits: ${payload.commits.length}`);
        payload.commits.forEach(commit => {
            log(`  - ${commit.id.substring(0, 7)}: ${commit.message}`);
        });

        // Start deployment
        log('Starting auto-deployment...');
        
        // Step 1: Fetch latest changes
        log('[Step 1/4] Pulling latest code from GitHub...');
        await executeCommand('git fetch origin');
        await executeCommand(`git checkout ${BRANCH}`);
        await executeCommand('git pull origin ' + BRANCH);
        log('✓ Code updated');

        // Step 2: Check .env.app
        log('[Step 2/4] Validating .env.app...');
        if (!fs.existsSync(path.join(REPO_PATH, '.env.app'))) {
            throw new Error('.env.app file not found on VPS');
        }
        log('✓ .env.app found');

        // Step 3: Build Docker image
        log('[Step 3/4] Building Docker image...');
        await executeCommand(
            'docker compose -f docker-compose.app.yml --env-file .env.app build --no-cache'
        );
        log('✓ Docker image built');

        // Step 4: Restart container
        log('[Step 4/4] Restarting container...');
        await executeCommand(
            'docker compose -f docker-compose.app.yml --env-file .env.app up -d'
        );
        log('✓ Container restarted');

        // Wait for health check
        log('Waiting for application to start...');
        await new Promise(resolve => setTimeout(resolve, 5000));

        // Check container status
        try {
            const status = await executeCommand(
                "docker ps --filter name=hashiwa-app --format '{{.Status}}'"
            );
            log(`Container status: ${status.trim()}`);
        } catch (err) {
            log(`Warning: Could not check container status: ${err.message}`);
        }

        log('=== DEPLOYMENT COMPLETED SUCCESSFULLY ===');
        res.json({
            status: 'success',
            message: 'Deployment completed',
            branch: currentBranch,
            commits: payload.commits.length,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        log(`=== DEPLOYMENT FAILED ===`);
        log(`Error: ${error.message}`);
        log(`Stack: ${error.stack}`);
        
        res.status(500).json({
            status: 'error',
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
    log(`Unhandled error: ${err.message}`);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
    log(`=== WEBHOOK SERVER STARTED ===`);
    log(`Listening on port ${PORT}`);
    log(`Webhook URL: http://localhost:${PORT}/webhook`);
    log(`Branch watching: ${BRANCH}`);
    log(`Repo path: ${REPO_PATH}`);
    log(`Log file: ${logFile}`);
    log(`================================`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    log('Server shutting down...');
    process.exit(0);
});
