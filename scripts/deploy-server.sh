#!/bin/bash

# Church360 Remote Server Deployment Script
# Run this script on your remote server after uploading project files

set -e

echo "=========================================="
echo "Church360 - Server Deployment Script"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -eq 0 ]; then 
   echo -e "${RED}Please do not run as root. Use a user with sudo privileges.${NC}"
   exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}Docker not found. Installing Docker...${NC}"
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    echo -e "${GREEN}Docker installed. Please log out and log back in, then run this script again.${NC}"
    exit 0
fi

# Check if Docker Compose is available
if ! command -v docker compose &> /dev/null; then
    echo -e "${YELLOW}Docker Compose not found. Installing...${NC}"
    sudo apt-get update
    sudo apt-get install -y docker-compose-plugin
fi

# Check if project directory exists
if [ ! -f "docker-compose.yml" ]; then
    echo -e "${RED}Error: docker-compose.yml not found!${NC}"
    echo "Please run this script from the project root directory."
    exit 1
fi

echo -e "${GREEN}✓ Docker and Docker Compose found${NC}"
echo ""

# Check for backend .env file
if [ ! -f "backend/.env" ]; then
    echo -e "${YELLOW}⚠ Backend .env file not found!${NC}"
    echo "Creating backend/.env from template..."
    
    # Generate JWT secret
    JWT_SECRET=$(openssl rand -base64 32)
    
    cat > backend/.env << EOF
# Database
DATABASE_HOST=db
DATABASE_PORT=5432
DATABASE_USER=church
DATABASE_PASSWORD=church_pass
DATABASE_NAME=church360

# Server
PORT=3000
NODE_ENV=production

# JWT Secret
JWT_SECRET=${JWT_SECRET}

# CORS Origins
CORS_ORIGIN=https://welfare-church360.jerdyl.co.ke,https://church360.jerdyl.co.ke
EOF
    
    echo -e "${GREEN}✓ Created backend/.env file${NC}"
    echo -e "${YELLOW}⚠ Please review and update backend/.env with your actual values!${NC}"
    echo ""
fi

# Check firewall
echo "Checking firewall..."
if command -v ufw &> /dev/null; then
    if sudo ufw status | grep -q "Status: active"; then
        echo -e "${GREEN}✓ Firewall is active${NC}"
        # Ensure ports are open
        sudo ufw allow 22/tcp 2>/dev/null || true
        sudo ufw allow 80/tcp 2>/dev/null || true
        sudo ufw allow 443/tcp 2>/dev/null || true
    else
        echo -e "${YELLOW}⚠ Firewall is not active. Consider enabling it.${NC}"
    fi
fi

echo ""
echo "=========================================="
echo "Building Docker Images"
echo "=========================================="
echo "This may take several minutes..."
echo ""

# Build images
docker compose build --no-cache

echo ""
echo "=========================================="
echo "Starting Services"
echo "=========================================="
echo ""

# Start services
docker compose up -d

echo ""
echo "⏳ Waiting for services to start..."
sleep 10

echo ""
echo "=========================================="
echo "Service Status"
echo "=========================================="
docker compose ps

echo ""
echo "=========================================="
echo "✅ Deployment Complete!"
echo "=========================================="
echo ""
echo "📍 Service URLs:"
echo "   • Backend API:       http://localhost:5400/api"
echo "   • Welfare Frontend:  http://localhost:3001"
echo "   • Church Frontend:   http://localhost:3002"
echo ""
echo "📋 Next Steps:"
echo "   1. Configure Nginx reverse proxy (see REMOTE_SERVER_DEPLOYMENT.md)"
echo "   2. Setup SSL certificates with Let's Encrypt"
echo "   3. Configure DNS records"
echo "   4. Verify services are accessible via domains"
echo ""
echo "📖 View logs: docker compose logs -f"
echo "🔄 Restart: docker compose restart [service-name]"
echo "🛑 Stop: docker compose down"
echo ""


