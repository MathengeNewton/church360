#!/bin/bash

# Docker Compose Quick Start Script
# This script builds and starts all services

set -e

echo "=========================================="
echo "Church360 - Docker Compose Startup"
echo "=========================================="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed!"
    echo "Please install Docker first. See DOCKER_UBUNTU_SETUP.md"
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker compose &> /dev/null && ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed!"
    echo "Please install Docker Compose first. See DOCKER_UBUNTU_SETUP.md"
    exit 1
fi

# Check for port conflicts
echo "🔍 Checking for port conflicts..."
PORTS=(3001 3002 5400 5455 80)
CONFLICTS=0

for port in "${PORTS[@]}"; do
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1 ; then
        echo "⚠️  Port $port is already in use"
        CONFLICTS=1
    fi
done

if [ $CONFLICTS -eq 1 ]; then
    echo ""
    echo "⚠️  Warning: Some ports are in use. Services may fail to start."
    echo "   Please stop conflicting services or change ports in docker-compose.yml"
    echo ""
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo ""
echo "🏗️  Building and starting all services..."
echo "   This may take a few minutes on first run..."
echo ""

# Build and start services
docker compose up --build -d

echo ""
echo "⏳ Waiting for services to start..."
sleep 5

echo ""
echo "📊 Service Status:"
docker compose ps

echo ""
echo "=========================================="
echo "✅ Services Started!"
echo "=========================================="
echo ""
echo "📍 Access URLs:"
echo "   • Welfare Frontend:  http://localhost:3001 (Production: https://welfare-church360.jerdyl.co.ke)"
echo "   • Church Frontend:    http://localhost:3002 (Production: https://church360.jerdyl.co.ke)"
echo "   • Backend API:       http://localhost:5400/api (Production: https://api-church360.jerdyl.co.ke/api)"
echo "   • API Documentation: http://localhost:5400/docs (Production: https://api-church360.jerdyl.co.ke/docs)"
echo ""
echo "🔐 Default Login:"
echo "   Username: admin@church360.org"
echo "   Password: admin123"
echo ""
echo "📋 Useful Commands:"
echo "   View logs:        docker compose logs -f"
echo "   Stop services:    docker compose down"
echo "   Restart service:  docker compose restart [service-name]"
echo ""
echo "📖 For more info, see DOCKER_RUN_GUIDE.md"
echo ""

