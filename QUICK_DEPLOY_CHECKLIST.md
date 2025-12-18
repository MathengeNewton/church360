# Quick Deployment Checklist

## 🚀 What to Add/Install on Remote Server

### 1. **Software Requirements**
- [ ] Docker Engine
- [ ] Docker Compose Plugin
- [ ] Nginx (for reverse proxy)
- [ ] Certbot (for SSL certificates)
- [ ] Basic tools (curl, git, ufw)

### 2. **Project Files**
- [ ] Upload entire `church360` project to `/opt/church360`
- [ ] Or clone from Git repository

### 3. **Configuration Files**
- [ ] `backend/.env` - Backend environment variables
- [ ] `docker-compose.yml` - Already configured ✅
- [ ] Nginx config at `/etc/nginx/sites-available/church360`

### 4. **Network Configuration**
- [ ] Firewall rules (ports 22, 80, 443)
- [ ] DNS records pointing to server IP:
  - `api-church360.jerdyl.co.ke` → Server IP
  - `welfare-church360.jerdyl.co.ke` → Server IP
  - `church360.jerdyl.co.ke` → Server IP

### 5. **SSL Certificates**
- [ ] Let's Encrypt certificates for all domains

### 6. **Docker Services**
- [ ] Build images: `docker compose build`
- [ ] Start services: `docker compose up -d`

---

## 📦 Minimal Server Setup (One Command)

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh get-docker.sh
sudo usermod -aG docker $USER
# Log out and back in

# Install Docker Compose
sudo apt-get install -y docker-compose-plugin

# Install Nginx & Certbot
sudo apt-get install -y nginx certbot python3-certbot-nginx
```

---

## 🎯 Quick Deploy Steps

1. **Upload project** to `/opt/church360`
2. **Create** `backend/.env` file
3. **Run** `./scripts/deploy-server.sh`
4. **Configure** Nginx reverse proxy
5. **Setup** SSL certificates
6. **Configure** DNS records

---

## 📚 Full Documentation

See `REMOTE_SERVER_DEPLOYMENT.md` for complete step-by-step guide.

