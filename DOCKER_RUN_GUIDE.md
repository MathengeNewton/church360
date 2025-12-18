# Docker Compose - Quick Start Guide

## 🚀 Running Everything on Docker

### **Quick Start:**

```bash
# From project root directory
docker compose up --build
```

This will:
1. Build all images (backend, welfare-frontend, church-frontend, proxy)
2. Start PostgreSQL database
3. Start backend API on port 5400
4. Start welfare frontend on port 3001
5. Start church frontend on port 3002
6. Start Nginx proxy on port 80

---

## 📍 Access URLs

After running `docker compose up`:

- **Welfare Frontend:** `http://localhost:3001`
- **Church Frontend:** `http://localhost:3002`
- **Backend API:** `http://localhost:5400/api`
- **API Documentation:** `http://localhost:5400/docs`
- **Nginx Proxy:** `http://localhost:80` (optional, for routing)

---

## 🔧 Common Commands

### **Start Everything:**
```bash
docker compose up -d
```

### **Rebuild and Start:**
```bash
docker compose up --build -d
```

### **View Logs:**
```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f backend
docker compose logs -f welfare-frontend
docker compose logs -f church-frontend
```

### **Stop Everything:**
```bash
docker compose down
```

### **Stop and Remove Volumes (⚠️ deletes database):**
```bash
docker compose down -v
```

### **Restart a Service:**
```bash
docker compose restart backend
docker compose restart welfare-frontend
docker compose restart church-frontend
```

---

## 🏗️ Building Individual Services

### **Build Backend Only:**
```bash
docker compose build backend
```

### **Build Frontends Only:**
```bash
docker compose build welfare-frontend church-frontend
```

### **Rebuild Without Cache:**
```bash
docker compose build --no-cache
```

---

## 🐛 Troubleshooting

### **Port Already in Use:**
```bash
# Check what's using the port
sudo lsof -i :3001
sudo lsof -i :3002
sudo lsof -i :5400

# Kill the process or change port in docker-compose.yml
```

### **Container Won't Start:**
```bash
# Check logs
docker compose logs [service-name]

# Check container status
docker compose ps

# Rebuild specific service
docker compose build --no-cache [service-name]
docker compose up -d [service-name]
```

### **Database Connection Issues:**
```bash
# Check if database is running
docker compose ps db

# Check database logs
docker compose logs db

# Restart database
docker compose restart db
```

### **Frontend Not Loading:**
```bash
# Check if frontend built correctly
docker compose logs welfare-frontend
docker compose logs church-frontend

# Rebuild frontends
docker compose build --no-cache welfare-frontend church-frontend
docker compose up -d welfare-frontend church-frontend
```

### **Backend Not Starting:**
```bash
# Check backend logs
docker compose logs backend

# Check if database is ready
docker compose exec db psql -U church -d church360 -c "SELECT 1;"

# Restart backend
docker compose restart backend
```

---

## 🔍 Checking Service Status

```bash
# List all running containers
docker compose ps

# Check resource usage
docker stats

# Inspect a container
docker inspect church360-backend
```

---

## 🧹 Clean Up

### **Remove Stopped Containers:**
```bash
docker compose down
```

### **Remove Everything Including Volumes:**
```bash
docker compose down -v
```

### **Remove All Images:**
```bash
docker compose down --rmi all
```

### **Full Cleanup (⚠️ removes everything):**
```bash
docker compose down -v --rmi all
docker system prune -a
```

---

## 📝 Environment Variables

### **Backend Environment:**
Set in `docker-compose.yml`:
- `DATABASE_HOST=db`
- `DATABASE_PORT=5432`
- `DATABASE_USER=church`
- `DATABASE_PASSWORD=church_pass`
- `DATABASE_NAME=church360`
- `PORT=3000`

### **Frontend Environment:**
Set during build via build args:
- `NEXT_PUBLIC_API_URL=http://localhost:5400/api`

To override, modify `docker-compose.yml`:
```yaml
welfare-frontend:
  build:
    args:
      NEXT_PUBLIC_API_URL: http://your-backend-url/api
```

---

## 🎯 First Time Setup

1. **Ensure Docker is installed:**
   ```bash
   docker --version
   docker compose version
   ```

2. **Build and start everything:**
   ```bash
   docker compose up --build -d
   ```

3. **Wait for services to start:**
   ```bash
   # Watch logs
   docker compose logs -f
   ```

4. **Verify services are running:**
   ```bash
   docker compose ps
   ```

5. **Access the applications:**
   - Welfare: http://localhost:3001
   - Church: http://localhost:3002
   - API Docs: http://localhost:5400/docs

---

## 🔐 Default Credentials

- **Username:** `admin@church360.org`
- **Password:** `admin123`

---

## 📊 Service Architecture

```
┌─────────────────┐
│   PostgreSQL    │ (Port 5455)
│      DB         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Backend      │ (Port 5400)
│   NestJS API    │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌─────────┐ ┌─────────┐
│ Welfare │ │ Church  │
│Frontend │ │Frontend │
│ :3001   │ │ :3002   │
└─────────┘ └─────────┘
```

---

## 🚨 Important Notes

1. **First Run:** Backend will seed default admin user and district
2. **Database Persistence:** Data persists in Docker volume `db_data`
3. **Port Conflicts:** Ensure ports 3001, 3002, 5400, 5455, 80 are available
4. **Build Time:** First build may take 5-10 minutes
5. **API URL:** Frontends are configured to use `http://localhost:5400/api`

---

## ✅ Verification Checklist

After starting with `docker compose up`:

- [ ] Database container running (`docker compose ps db`)
- [ ] Backend container running (`docker compose ps backend`)
- [ ] Welfare frontend container running (`docker compose ps welfare-frontend`)
- [ ] Church frontend container running (`docker compose ps church-frontend`)
- [ ] Backend API accessible (`curl http://localhost:5400/api`)
- [ ] Welfare frontend accessible (`curl http://localhost:3001`)
- [ ] Church frontend accessible (`curl http://localhost:3002`)
- [ ] Can login with admin credentials

---

**Ready to go! Run `docker compose up --build` and access your apps! 🎉**

