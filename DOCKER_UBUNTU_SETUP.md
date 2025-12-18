# Docker & Docker Compose Setup Guide for Ubuntu Server

This guide walks you through installing Docker and Docker Compose on Ubuntu, then setting up the Church360 application.

## Prerequisites

- Ubuntu Server 20.04 LTS or later (22.04 LTS recommended)
- A user account with sudo privileges
- At least 2GB RAM (4GB+ recommended)
- At least 10GB free disk space

---

## Part 1: Installing Docker Engine

### Step 1: Update System Packages

```bash
sudo apt-get update
sudo apt-get upgrade -y
```

### Step 2: Install Required Packages

```bash
sudo apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release
```

### Step 3: Add Docker's Official GPG Key

```bash
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
```

### Step 4: Set Up Docker Repository

```bash
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

### Step 5: Install Docker Engine

```bash
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

### Step 6: Verify Docker Installation

```bash
sudo docker run hello-world
```

If you see "Hello from Docker!", the installation is successful!

### Step 7: Add Your User to Docker Group (Optional but Recommended)

This allows you to run Docker commands without `sudo`:

```bash
sudo usermod -aG docker $USER
```

**Important:** You need to log out and log back in (or restart) for this to take effect.

### Step 8: Verify Docker Without Sudo

After logging back in:

```bash
docker run hello-world
```

---

## Part 2: Installing Docker Compose

Docker Compose is now included as a plugin with Docker Engine (installed in Part 1, Step 5). However, if you need the standalone version:

### Option A: Using Docker Compose Plugin (Recommended - Already Installed)

The plugin version is already installed. Use it with:

```bash
docker compose version
```

### Option B: Installing Standalone Docker Compose

If you prefer the standalone version:

```bash
# Download the latest version (check https://github.com/docker/compose/releases for latest)
DOCKER_COMPOSE_VERSION=$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep 'tag_name' | cut -d\" -f4)
sudo curl -L "https://github.com/docker/compose/releases/download/${DOCKER_COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Make it executable
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker-compose --version
```

---

## Part 3: Setting Up Church360 Application

### Step 1: Clone or Upload the Project

If using Git:

```bash
cd /opt  # or your preferred directory
git clone <your-repo-url> church360
cd church360
```

Or upload the project files to your server using `scp`, `rsync`, or SFTP.

### Step 2: Navigate to Project Directory

```bash
cd /path/to/church360
```

### Step 3: Review Docker Compose Configuration

Check the `docker-compose.yml` file to understand the services:

```bash
cat docker-compose.yml
```

### Step 4: Set Up Environment Variables

Create a `.env` file in the project root if needed (check if backend requires it):

```bash
# Example .env for backend (if needed)
cat > backend/.env << EOF
DATABASE_HOST=db
DATABASE_PORT=5432
DATABASE_USER=church
DATABASE_PASSWORD=church_pass
DATABASE_NAME=church360
PORT=3000
JWT_SECRET=your-secret-key-change-this-in-production
EOF
```

### Step 5: Build and Start Services

```bash
# Build all images
docker compose build

# Start all services in detached mode
docker compose up -d

# View logs
docker compose logs -f
```

### Step 6: Verify Services Are Running

```bash
# Check running containers
docker compose ps

# Check logs for specific service
docker compose logs backend
docker compose logs welfare-frontend
docker compose logs church-frontend
```

### Step 7: Access the Application

- **Backend API:** `http://your-server-ip:5400/api`
- **Backend Docs:** `http://your-server-ip:5400/docs`
- **Welfare Frontend:** `http://your-server-ip:3001`
- **Church Frontend:** `http://your-server-ip:3002`

---

## Part 4: Common Docker Commands

### Managing Services

```bash
# Start services
docker compose up -d

# Stop services
docker compose stop

# Stop and remove containers
docker compose down

# Stop, remove containers, and volumes (⚠️ deletes database data)
docker compose down -v

# Restart a specific service
docker compose restart backend

# View logs
docker compose logs -f [service-name]

# Execute command in running container
docker compose exec backend sh
docker compose exec db psql -U church -d church360
```

### Building and Updating

```bash
# Rebuild specific service
docker compose build --no-cache backend

# Rebuild and restart
docker compose up -d --build backend

# Pull latest images
docker compose pull
```

### Monitoring

```bash
# View resource usage
docker stats

# View container details
docker compose ps
docker inspect <container-name>

# View logs
docker compose logs --tail=100 backend
```

---

## Part 5: Production Considerations

### 1. Configure Firewall

```bash
# Allow Docker ports
sudo ufw allow 5400/tcp  # Backend API
sudo ufw allow 3001/tcp  # Welfare Frontend
sudo ufw allow 3002/tcp  # Church Frontend
sudo ufw allow 80/tcp   # HTTP (if using Nginx)
sudo ufw allow 443/tcp  # HTTPS (if using SSL)

# Enable firewall
sudo ufw enable
```

### 2. Set Up Nginx Reverse Proxy (Optional)

If you want to use Nginx as a reverse proxy:

```bash
# Install Nginx
sudo apt-get install -y nginx

# Copy the production config
sudo cp nginx-production.conf /etc/nginx/sites-available/church360
sudo ln -s /etc/nginx/sites-available/church360 /etc/nginx/sites-enabled/

# Test and reload
sudo nginx -t
sudo systemctl reload nginx
```

### 3. Set Up SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# Obtain certificates
sudo certbot --nginx -d welfare-church360.jerdyl.co.ke -d church360.jerdyl.co.ke

# Auto-renewal is set up automatically
```

### 4. Configure Docker to Start on Boot

Docker should start automatically, but verify:

```bash
sudo systemctl enable docker
sudo systemctl status docker
```

### 5. Set Up Log Rotation

Create Docker log rotation:

```bash
sudo tee /etc/logrotate.d/docker-containers << EOF
/var/lib/docker/containers/*/*.log {
    rotate 7
    daily
    compress
    size=1M
    missingok
    delaycompress
    copytruncate
}
EOF
```

### 6. Resource Limits (Optional)

Edit `docker-compose.yml` to add resource limits:

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
```

---

## Part 6: Troubleshooting

### Issue: Permission Denied

```bash
# Add user to docker group
sudo usermod -aG docker $USER
# Log out and back in
```

### Issue: Port Already in Use

```bash
# Find process using port
sudo lsof -i :5400
# Or
sudo netstat -tulpn | grep :5400

# Kill the process or change port in docker-compose.yml
```

### Issue: Container Won't Start

```bash
# Check logs
docker compose logs [service-name]

# Check container status
docker compose ps

# Try rebuilding
docker compose build --no-cache [service-name]
docker compose up -d [service-name]
```

### Issue: Database Connection Errors

```bash
# Check if database container is running
docker compose ps db

# Check database logs
docker compose logs db

# Verify database is accessible
docker compose exec db psql -U church -d church360 -c "SELECT 1;"
```

### Issue: Out of Disk Space

```bash
# Clean up unused Docker resources
docker system prune -a

# Remove unused volumes (⚠️ be careful)
docker volume prune
```

### Issue: Can't Access Services from Outside

```bash
# Check firewall
sudo ufw status

# Check Docker network
docker network ls
docker network inspect church360_app-network

# Verify ports are exposed
docker compose ps
```

---

## Part 7: Backup and Restore

### Backup Database

```bash
# Create backup
docker compose exec db pg_dump -U church church360 > backup_$(date +%Y%m%d_%H%M%S).sql

# Or using docker exec directly
docker exec church360-db-1 pg_dump -U church church360 > backup.sql
```

### Restore Database

```bash
# Copy backup file into container
docker cp backup.sql church360-db-1:/tmp/

# Restore
docker compose exec db psql -U church -d church360 < /tmp/backup.sql
```

### Backup Volumes

```bash
# List volumes
docker volume ls

# Backup volume
docker run --rm -v church360_db_data:/data -v $(pwd):/backup ubuntu tar czf /backup/db_backup.tar.gz /data
```

---

## Part 8: Quick Reference

### Essential Commands

```bash
# Start everything
docker compose up -d

# Stop everything
docker compose down

# View logs
docker compose logs -f

# Rebuild after code changes
docker compose up -d --build

# Access backend container shell
docker compose exec backend sh

# Access database
docker compose exec db psql -U church -d church360
```

### Service URLs (Default)

- Backend API: `http://localhost:5400/api`
- API Docs: `http://localhost:5400/docs`
- Welfare Frontend: `http://localhost:3001`
- Church Frontend: `http://localhost:3002`

---

## Part 9: Security Best Practices

1. **Change Default Passwords**: Update database passwords in `docker-compose.yml`
2. **Use Secrets**: For production, use Docker secrets or environment files
3. **Keep Updated**: Regularly update Docker and images
4. **Limit Resources**: Set resource limits in `docker-compose.yml`
5. **Use HTTPS**: Set up SSL certificates for production
6. **Firewall**: Configure UFW to only allow necessary ports
7. **Regular Backups**: Set up automated database backups

---

## Next Steps

1. ✅ Docker and Docker Compose installed
2. ✅ Application running
3. 🔄 Set up Nginx reverse proxy (optional)
4. 🔄 Configure SSL certificates (optional)
5. 🔄 Set up automated backups
6. 🔄 Configure monitoring (optional)

---

## Getting Help

- Docker Docs: https://docs.docker.com/
- Docker Compose Docs: https://docs.docker.com/compose/
- Check logs: `docker compose logs -f`
- Container status: `docker compose ps`

---

**Note:** Replace `docker-compose` with `docker compose` (space instead of hyphen) if using the plugin version, or use `docker-compose` if using standalone version.

