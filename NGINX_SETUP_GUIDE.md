# Complete Nginx Virtual Host Setup Guide

## Step 1: Install Nginx

### For Ubuntu/Debian:
```bash
# Update package list
sudo apt update

# Install nginx
sudo apt install nginx -y

# Check if nginx is running
sudo systemctl status nginx
```

### For CentOS/RHEL/Fedora:
```bash
# Install nginx
sudo yum install nginx -y
# or for newer versions:
sudo dnf install nginx -y

# Start and enable nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

## Step 2: Verify Installation

```bash
# Check nginx version
nginx -v

# Check if nginx is running
sudo systemctl status nginx

# Test in browser (default page should appear)
# http://localhost or http://your-server-ip
```

## Step 3: Understand Nginx Directory Structure

```
/etc/nginx/
├── nginx.conf          # Main configuration file
├── sites-available/    # Available virtual host configs (not active)
├── sites-enabled/      # Active virtual host configs (symlinks)
├── conf.d/             # Additional config files
└── snippets/           # Reusable configuration snippets
```

## Step 4: Create Your Virtual Host Configuration

### Option A: For a Static Website (like your Next.js `out` folder)

```bash
# Create a new virtual host config file
sudo nano /etc/nginx/sites-available/church360
```

**Add this configuration:**

```nginx
server {
    listen 80;
    server_name church360.local localhost;  # Change to your domain
    
    # Root directory (point to your Next.js out folder)
    root /home/newton/projects/church360/frontend/out;
    index index.html;

    # Logging
    access_log /var/log/nginx/church360_access.log;
    error_log /var/log/nginx/church360_error.log;

    # Main location block
    location / {
        try_files $uri $uri.html $uri/ =404;
    }

    # Handle Next.js static assets
    location /_next/static {
        alias /home/newton/projects/church360/frontend/out/_next/static;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Deny access to hidden files
    location ~ /\. {
        deny all;
    }
}
```

### Option B: For a Node.js/Next.js Application (with proxy)

```nginx
server {
    listen 80;
    server_name church360.local localhost;

    # Proxy to your Next.js dev server (running on port 3000)
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Logging
    access_log /var/log/nginx/church360_access.log;
    error_log /var/log/nginx/church360_error.log;
}
```

### Option C: For Backend API (NestJS)

```nginx
server {
    listen 80;
    server_name api.church360.local localhost;

    location / {
        proxy_pass http://localhost:3001;  # Your NestJS port
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

## Step 5: Enable the Virtual Host

```bash
# Create symlink to enable the site
sudo ln -s /etc/nginx/sites-available/church360 /etc/nginx/sites-enabled/

# Remove default site (optional)
sudo rm /etc/nginx/sites-enabled/default

# Test nginx configuration for syntax errors
sudo nginx -t

# If test passes, reload nginx
sudo systemctl reload nginx
# or
sudo systemctl restart nginx
```

## Step 6: Set Up Local Domain (for testing)

### Edit /etc/hosts file:

```bash
sudo nano /etc/hosts
```

**Add this line:**
```
127.0.0.1    church360.local
127.0.0.1    api.church360.local
```

Now you can access your site at: `http://church360.local`

## Step 7: Set Proper Permissions

```bash
# Make sure nginx can read your files
sudo chown -R $USER:$USER /home/newton/projects/church360/frontend/out
sudo chmod -R 755 /home/newton/projects/church360/frontend/out

# Or if you want nginx user to own it:
sudo chown -R www-data:www-data /home/newton/projects/church360/frontend/out
sudo chmod -R 755 /home/newton/projects/church360/frontend/out
```

## Step 8: Firewall Configuration (if needed)

```bash
# For Ubuntu/Debian (UFW)
sudo ufw allow 'Nginx Full'
# or
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# For CentOS/RHEL (firewalld)
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

## Step 9: SSL/HTTPS Setup (Optional but Recommended)

### Using Let's Encrypt (Certbot):

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d church360.local -d www.church360.local

# Auto-renewal is set up automatically
```

## Common Commands

```bash
# Check nginx status
sudo systemctl status nginx

# Start nginx
sudo systemctl start nginx

# Stop nginx
sudo systemctl stop nginx

# Restart nginx
sudo systemctl restart nginx

# Reload nginx (without downtime)
sudo systemctl reload nginx

# Test configuration
sudo nginx -t

# View nginx error logs
sudo tail -f /var/log/nginx/error.log

# View access logs
sudo tail -f /var/log/nginx/access.log
```

## Troubleshooting

### 1. Permission Denied Errors
```bash
# Check file permissions
ls -la /home/newton/projects/church360/frontend/out

# Fix permissions
sudo chmod -R 755 /path/to/your/files
```

### 2. 502 Bad Gateway
- Check if your backend service is running
- Verify the proxy_pass URL is correct
- Check backend logs

### 3. 403 Forbidden
- Check directory permissions
- Verify index file exists
- Check SELinux (if on CentOS/RHEL)

### 4. Can't Access Site
- Check firewall: `sudo ufw status`
- Verify nginx is running: `sudo systemctl status nginx`
- Check if port 80 is in use: `sudo netstat -tulpn | grep :80`

## Example: Complete Setup for Your Church360 Project

```bash
# 1. Install nginx
sudo apt update && sudo apt install nginx -y

# 2. Build your Next.js app
cd /home/newton/projects/church360/frontend
npm run build  # This creates the 'out' folder

# 3. Create virtual host
sudo nano /etc/nginx/sites-available/church360
# Paste the static site configuration from Option A above

# 4. Enable site
sudo ln -s /etc/nginx/sites-available/church360 /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# 5. Add to hosts file
echo "127.0.0.1 church360.local" | sudo tee -a /etc/hosts

# 6. Test
curl http://church360.local
# or open in browser: http://church360.local
```

## Multiple Virtual Hosts

You can create multiple virtual hosts for different services:

```bash
# Frontend
sudo nano /etc/nginx/sites-available/church360-frontend
# ... config ...

# Backend API
sudo nano /etc/nginx/sites-available/church360-api
# ... config ...

# Enable both
sudo ln -s /etc/nginx/sites-available/church360-frontend /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/church360-api /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

---

**That's it!** Your nginx virtual host should now be set up and running. 🚀

