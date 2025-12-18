#!/bin/bash

# Docker Installation Script for Ubuntu
# This script installs Docker Engine and Docker Compose on Ubuntu Server

set -e  # Exit on error

echo "=========================================="
echo "Docker & Docker Compose Installation Script"
echo "=========================================="
echo ""

# Check if running as root
if [ "$EUID" -eq 0 ]; then 
   echo "Please do not run this script as root. It will use sudo when needed."
   exit 1
fi

# Check Ubuntu version
if [ ! -f /etc/os-release ]; then
    echo "Error: Cannot detect Ubuntu version"
    exit 1
fi

. /etc/os-release
if [ "$ID" != "ubuntu" ]; then
    echo "Warning: This script is designed for Ubuntu. Proceeding anyway..."
fi

echo "Detected OS: $PRETTY_NAME"
echo ""

# Step 1: Update system
echo "Step 1: Updating system packages..."
sudo apt-get update -qq
sudo apt-get upgrade -y -qq
echo "✓ System updated"
echo ""

# Step 2: Install prerequisites
echo "Step 2: Installing prerequisites..."
sudo apt-get install -y -qq \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    apt-transport-https
echo "✓ Prerequisites installed"
echo ""

# Step 3: Check if Docker is already installed
if command -v docker &> /dev/null; then
    echo "Docker is already installed:"
    docker --version
    read -p "Do you want to reinstall? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Skipping Docker installation"
        SKIP_DOCKER=true
    else
        echo "Removing existing Docker installation..."
        sudo apt-get remove -y docker docker-engine docker.io containerd docker-compose
        sudo apt-get purge -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
        SKIP_DOCKER=false
    fi
else
    SKIP_DOCKER=false
fi

if [ "$SKIP_DOCKER" = false ]; then
    # Step 4: Add Docker's GPG key
    echo "Step 3: Adding Docker's GPG key..."
    sudo install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    sudo chmod a+r /etc/apt/keyrings/docker.gpg
    echo "✓ GPG key added"
    echo ""

    # Step 5: Add Docker repository
    echo "Step 4: Adding Docker repository..."
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
      $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    echo "✓ Repository added"
    echo ""

    # Step 6: Install Docker
    echo "Step 5: Installing Docker Engine..."
    sudo apt-get update -qq
    sudo apt-get install -y -qq docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    echo "✓ Docker Engine installed"
    echo ""
fi

# Step 7: Add user to docker group
echo "Step 6: Adding user to docker group..."
sudo usermod -aG docker $USER
echo "✓ User added to docker group"
echo ""

# Step 8: Verify installation
echo "Step 7: Verifying installation..."
echo "Docker version:"
docker --version 2>/dev/null || echo "Note: You may need to log out and back in for docker command to work without sudo"
echo ""
echo "Docker Compose version:"
docker compose version 2>/dev/null || echo "Note: You may need to log out and back in"
echo ""

# Step 9: Test Docker (requires logout/login to work without sudo)
echo "Step 8: Testing Docker..."
if sudo docker run --rm hello-world > /dev/null 2>&1; then
    echo "✓ Docker is working correctly!"
else
    echo "⚠ Warning: Docker test failed. Check the error above."
fi
echo ""

# Summary
echo "=========================================="
echo "Installation Complete!"
echo "=========================================="
echo ""
echo "Important: You need to LOG OUT and LOG BACK IN for Docker"
echo "commands to work without 'sudo'."
echo ""
echo "After logging back in, verify with:"
echo "  docker run hello-world"
echo ""
echo "To start the Church360 application:"
echo "  cd /path/to/church360"
echo "  docker compose up -d"
echo ""
echo "For more information, see: DOCKER_UBUNTU_SETUP.md"
echo ""

