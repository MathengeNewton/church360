# Docker Quick Start Guide

## 🚀 Quick Installation (Ubuntu)

### Option 1: Automated Script

```bash
# Download and run the installation script
cd /path/to/church360
chmod +x scripts/install-docker.sh
./scripts/install-docker.sh

# Log out and log back in, then verify:
docker run hello-world
```

### Option 2: Manual Installation

```bash
# Update system
sudo apt-get update && sudo apt-get upgrade -y

# Install prerequisites
sudo apt-get install -y ca-certificates curl gnupg lsb-release

# Add Docker's GPG key
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# Add Docker repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Add user to docker group
sudo usermod -aG docker $USER

# Log out and log back in, then verify:
docker run hello-world
```

---

## 📦 Starting Church360 Application

```bash
# Navigate to project directory
cd /path/to/church360

# Build and start all services
docker compose up -d

# View logs
docker compose logs -f

# Check status
docker compose ps
```

---

## 🔧 Essential Commands

### Service Management

```bash
# Start services
docker compose up -d

# Stop services
docker compose stop

# Stop and remove containers
docker compose down

# Restart a service
docker compose restart backend

# View logs
docker compose logs -f [service-name]

# Rebuild after code changes
docker compose up -d --build
```

### Accessing Containers

```bash
# Access backend shell
docker compose exec backend sh

# Access database
docker compose exec db psql -U church -d church360

# Run command in container
docker compose exec backend npm run migrate
```

### Monitoring

```bash
# View resource usage
docker stats

# View container details
docker compose ps

# View logs (last 100 lines)
docker compose logs --tail=100 backend
```

---

## 🌐 Access URLs

- **Backend API:** `http://your-server-ip:5400/api`
- **API Docs:** `http://your-server-ip:5400/docs`
- **Welfare Frontend:** `http://your-server-ip:3001`
- **Church Frontend:** `http://your-server-ip:3002`

---

## 🛠️ Troubleshooting

### Permission Denied

```bash
sudo usermod -aG docker $USER
# Log out and back in
```

### Port Already in Use

```bash
# Find process using port
sudo lsof -i :5400

# Or change port in docker-compose.yml
```

### Container Won't Start

```bash
# Check logs
docker compose logs [service-name]

# Rebuild
docker compose build --no-cache [service-name]
docker compose up -d [service-name]
```

### Clean Up

```bash
# Remove stopped containers
docker compose down

# Remove everything including volumes (⚠️ deletes data)
docker compose down -v

# Clean up unused Docker resources
docker system prune -a
```

---

## 💾 Backup Database

```bash
# Create backup
docker compose exec db pg_dump -U church church360 > backup_$(date +%Y%m%d).sql

# Restore backup
docker compose exec -T db psql -U church church360 < backup.sql
```

---

## 📚 Full Documentation

For detailed instructions, see:
- **Full Setup Guide:** `DOCKER_UBUNTU_SETUP.md`
- **Production Nginx:** `NGINX_PRODUCTION_SETUP.md`

---

## ⚡ Quick Reference

```bash
# Start everything
docker compose up -d

# Stop everything  
docker compose down

# View all logs
docker compose logs -f

# Rebuild specific service
docker compose up -d --build backend

# Access database
docker compose exec db psql -U church -d church360
```

---

**Note:** After installation, always log out and log back in for Docker group changes to take effect!

