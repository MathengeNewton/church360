# Server Build Optimization Guide

## 🐌 Problem: Slow Docker Builds

Builds are taking 15+ minutes per service due to slow npm installs.

## ✅ Solutions

### Option 1: Use Build Cache (Recommended)

Build services one at a time and let them complete:

```bash
# Build backend first (usually fastest)
docker compose build backend

# Then build frontends (can run in parallel)
docker compose build welfare-frontend &
docker compose build church-frontend &
wait

# Finally build proxy
docker compose build proxy
```

### Option 2: Use Faster npm Registry Mirror

If you're in a region with slow npm registry access, use a mirror:

**For China/Asia:**
```bash
# Edit Dockerfiles to use Taobao mirror
npm config set registry https://registry.npmmirror.com
```

**For Europe:**
```bash
npm config set registry https://registry.npmjs.eu
```

### Option 3: Build with More Resources

Increase Docker build resources:

```bash
# Check current limits
docker system info | grep -i memory

# Increase Docker memory limit (if using Docker Desktop)
# Or on server, ensure enough RAM is available
free -h
```

### Option 4: Use BuildKit (Faster Builds)

Enable BuildKit for parallel builds:

```bash
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1

docker compose build
```

### Option 5: Build Locally and Push Images

Build on your local machine (faster) then push to registry:

```bash
# On local machine
docker compose build
docker compose push

# On server
docker compose pull
docker compose up -d
```

### Option 6: Optimize Dockerfile Layer Caching

The current Dockerfiles already optimize caching by copying package.json first.

## 🚀 Quick Fix: Let Current Build Complete

If build is already running:

1. **Don't interrupt** - Let it finish (even if slow)
2. **Monitor progress**: `docker compose build --progress=plain`
3. **Once complete**, start services: `docker compose up -d`

## 📊 Check Server Resources

```bash
# Check CPU
nproc

# Check RAM
free -h

# Check disk space
df -h

# Check network speed
curl -o /dev/null -s -w "%{speed_download}\n" https://registry.npmjs.org/
```

## ⚡ Recommended: Use BuildKit + Parallel Builds

```bash
# Enable BuildKit
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1

# Build with progress output
docker compose build --progress=plain

# This will show detailed progress and can be faster
```

## 🔧 If Build Fails or Times Out

1. **Increase npm timeout** (already done in Dockerfiles)
2. **Check network**: `ping registry.npmjs.org`
3. **Use local npm cache**: Mount `.npm` directory
4. **Build without cache**: `docker compose build --no-cache` (slower but ensures clean build)

## ✅ After Build Completes

```bash
# Start all services
docker compose up -d

# Check status
docker compose ps

# View logs
docker compose logs -f
```

