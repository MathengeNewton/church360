# Remote Server Deployment Guide

Complete guide for deploying Church360 to a remote Ubuntu server.

## 📋 Prerequisites

- Ubuntu Server 20.04 LTS or later (22.04 LTS recommended)
- Root or sudo access
- At least 2GB RAM (4GB+ recommended)
- At least 20GB free disk space
- Domain names configured:
  - `api-church360.jerdyl.co.ke` → Backend API
  - `welfare-church360.jerdyl.co.ke` → Welfare Frontend
  - `church360.jerdyl.co.ke` → Church Frontend

---

## 🚀 Step 1: Server Setup

### 1.1 Update System

```bash
sudo apt-get update
sudo apt-get upgrade -y
```

### 1.2 Install Basic Tools

```bash
sudo apt-get install -y \
    curl \
    wget \
    git \
    ufw \
    certbot \
    python3-certbot-nginx
```

---

## 🐳 Step 2: Install Docker & Docker Compose

**Quick Install Script:**

```bash
# Download and run the installation script
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add your user to docker group
sudo usermod -aG docker $USER

# Install Docker Compose plugin (included with Docker)
sudo apt-get install -y docker-compose-plugin

# Verify installation
docker --version
docker compose version
```

**Or use the detailed guide:** See `DOCKER_UBUNTU_SETUP.md` for step-by-step instructions.

**Important:** Log out and log back in after adding user to docker group.

---

## 📁 Step 3: Deploy Project Files

### 3.1 Create Project Directory

```bash
# Create project directory
sudo mkdir -p /opt/church360
sudo chown $USER:$USER /opt/church360
cd /opt/church360
```

### 3.2 Clone or Upload Project

**Option A: Git Clone (if using Git)**

```bash
git clone <your-repo-url> .
```

**Option B: Upload via SCP**

From your local machine:

```bash
# Upload entire project
scp -r /path/to/church360 user@your-server-ip:/opt/church360

# Or use rsync (better for updates)
rsync -avz --exclude 'node_modules' --exclude '.git' \
  /path/to/church360/ user@your-server-ip:/opt/church360/
```

### 3.3 Verify Project Structure

```bash
cd /opt/church360
ls -la
# Should see: backend, welfare-frontend, church-frontend, docker-compose.yml, etc.
```

---

## 🔐 Step 4: Configure Environment

### 4.1 Backend Environment Variables

Create `/opt/church360/backend/.env`:

```bash
cd /opt/church360/backend
nano .env
```

**Required Variables:**

```env
# Database
DATABASE_HOST=db
DATABASE_PORT=5432
DATABASE_USER=church
DATABASE_PASSWORD=church_pass
DATABASE_NAME=church360

# Server
PORT=3000
NODE_ENV=production

# JWT Secret (generate a strong secret)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# CORS Origins (comma-separated)
CORS_ORIGIN=https://welfare-church360.jerdyl.co.ke,https://church360.jerdyl.co.ke

# Optional: Email configuration
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=your-email@gmail.com
# SMTP_PASS=your-password
```

**Generate JWT Secret:**

```bash
openssl rand -base64 32
```

### 4.2 Update docker-compose.yml (if needed)

The `docker-compose.yml` is already configured with production API URLs. Verify:

```bash
grep NEXT_PUBLIC_API_URL docker-compose.yml
# Should show: https://api-church360.jerdyl.co.ke/api
```

---

## 🔥 Step 5: Configure Firewall

```bash
# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Optional: Allow backend port (only if accessing directly)
sudo ufw allow 5400/tcp

# Enable firewall
sudo ufw enable
sudo ufw status
```

---

## 🌐 Step 6: Configure Nginx (Production Reverse Proxy)

### 6.1 Install Nginx

```bash
sudo apt-get install -y nginx
```

### 6.2 Create Nginx Configuration

Create `/etc/nginx/sites-available/church360`:

```nginx
# Backend API Server
server {
    listen 80;
    server_name api-church360.jerdyl.co.ke;

    location / {
        proxy_pass http://localhost:5400;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# Welfare Frontend
server {
    listen 80;
    server_name welfare-church360.jerdyl.co.ke;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# Church Frontend
server {
    listen 80;
    server_name church360.jerdyl.co.ke;

    location / {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 6.3 Enable Site

```bash
# Create symlink
sudo ln -s /etc/nginx/sites-available/church360 /etc/nginx/sites-enabled/

# Remove default site (optional)
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

---

## 🔒 Step 7: Setup SSL Certificates (Let's Encrypt)

```bash
# Obtain SSL certificates for all domains
sudo certbot --nginx \
  -d api-church360.jerdyl.co.ke \
  -d welfare-church360.jerdyl.co.ke \
  -d church360.jerdyl.co.ke

# Certbot will automatically update your Nginx config
# Test auto-renewal
sudo certbot renew --dry-run
```

---

## 🗄️ Step 8: Configure DNS

Point your domains to the server IP:

```
Type    Name                              Value
A       api-church360.jerdyl.co.ke        YOUR_SERVER_IP
A       welfare-church360.jerdyl.co.ke   YOUR_SERVER_IP
A       church360.jerdyl.co.ke            YOUR_SERVER_IP
```

**Verify DNS:**

```bash
dig api-church360.jerdyl.co.ke
dig welfare-church360.jerdyl.co.ke
dig church360.jerdyl.co.ke
```

---

## 🏗️ Step 9: Build and Start Services

### 9.1 Build Docker Images

```bash
cd /opt/church360

# Build all services (this will take several minutes)
docker compose build --no-cache

# Or build specific service
docker compose build backend
docker compose build welfare-frontend
docker compose build church-frontend
```

### 9.2 Start Services

```bash
# Start all services
docker compose up -d

# Check status
docker compose ps

# View logs
docker compose logs -f
```

### 9.3 Verify Services

```bash
# Check backend
curl http://localhost:5400/api/health

# Check frontends
curl http://localhost:3001
curl http://localhost:3002

# Check via domain (after DNS propagates)
curl https://api-church360.jerdyl.co.ke/api/health
```

---

## 🔄 Step 10: Setup Auto-Start on Boot

### 10.1 Enable Docker Service

```bash
sudo systemctl enable docker
sudo systemctl start docker
```

### 10.2 Create Systemd Service (Optional)

Create `/etc/systemd/system/church360.service`:

```ini
[Unit]
Description=Church360 Docker Compose
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/church360
ExecStart=/usr/bin/docker compose up -d
ExecStop=/usr/bin/docker compose down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
```

Enable and start:

```bash
sudo systemctl daemon-reload
sudo systemctl enable church360
sudo systemctl start church360
```

---

## 📊 Step 11: Monitoring & Maintenance

### 11.1 Useful Commands

```bash
# View logs
docker compose logs -f [service-name]

# Restart service
docker compose restart [service-name]

# Stop all services
docker compose down

# Start services
docker compose up -d

# View resource usage
docker stats

# Backup database
docker compose exec db pg_dump -U church church360 > backup.sql

# Restore database
docker compose exec -T db psql -U church church360 < backup.sql
```

### 11.2 Health Checks

Create a simple health check script `/opt/church360/health-check.sh`:

```bash
#!/bin/bash
echo "Checking services..."
docker compose ps
echo ""
echo "Checking API..."
curl -f http://localhost:5400/api/health || echo "API check failed"
```

Make executable:

```bash
chmod +x /opt/church360/health-check.sh
```

---

## 🔧 Step 12: Update Deployment

When you need to update:

```bash
cd /opt/church360

# Pull latest changes (if using Git)
git pull

# Or upload new files via SCP/rsync

# Rebuild and restart
docker compose down
docker compose build --no-cache
docker compose up -d

# Check logs
docker compose logs -f
```

---

## ✅ Verification Checklist

- [ ] Docker and Docker Compose installed
- [ ] Project files deployed to `/opt/church360`
- [ ] Backend `.env` file configured
- [ ] Firewall configured (ports 22, 80, 443)
- [ ] Nginx installed and configured
- [ ] SSL certificates obtained
- [ ] DNS records pointing to server
- [ ] Docker services running (`docker compose ps`)
- [ ] Backend API accessible (`curl https://api-church360.jerdyl.co.ke/api/health`)
- [ ] Frontends accessible via domains
- [ ] Database accessible and initialized
- [ ] Auto-start configured (optional)

---

## 🐛 Troubleshooting

### Services Won't Start

```bash
# Check logs
docker compose logs

# Check Docker status
sudo systemctl status docker

# Check disk space
df -h

# Check memory
free -h
```

### Nginx Issues

```bash
# Test configuration
sudo nginx -t

# Check error logs
sudo tail -f /var/log/nginx/error.log

# Reload Nginx
sudo systemctl reload nginx
```

### Database Issues

```bash
# Check database container
docker compose ps db

# View database logs
docker compose logs db

# Connect to database
docker compose exec db psql -U church church360
```

### Port Conflicts

```bash
# Check what's using ports
sudo lsof -i :80
sudo lsof -i :443
sudo lsof -i :5400
sudo lsof -i :3001
sudo lsof -i :3002

# Stop conflicting services
sudo systemctl stop [service-name]
```

---

## 📝 Notes

- **Security**: Change default passwords in `docker-compose.yml` and `.env`
- **Backups**: Set up regular database backups
- **Monitoring**: Consider setting up monitoring (e.g., Prometheus, Grafana)
- **Updates**: Keep system and Docker updated regularly
- **SSL Renewal**: Certbot auto-renews certificates, but monitor renewal logs

---

## 🆘 Support

For issues, check:
- Docker logs: `docker compose logs`
- Nginx logs: `/var/log/nginx/`
- System logs: `journalctl -u docker`

---

**Deployment Complete! 🎉**

Your Church360 application should now be accessible at:
- **Welfare**: https://welfare-church360.jerdyl.co.ke
- **Church**: https://church360.jerdyl.co.ke
- **API**: https://api-church360.jerdyl.co.ke/api

