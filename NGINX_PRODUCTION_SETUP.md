# Nginx Production Setup Guide

This guide explains how to set up Nginx for production deployment of Church360.

## File Structure

The configuration assumes the following directory structure on your server:

```
/var/www/church360.jerdyl.co.ke/public_html/
├── welfare-frontend/
│   └── out/          # Welfare frontend static files
└── church-frontend/
    └── out/          # Church frontend static files
```

## Setup Steps

### 1. Copy Configuration File

```bash
# Copy the configuration file to Nginx sites-available
sudo cp nginx-production.conf /etc/nginx/sites-available/church360

# Create symlink to enable the site
sudo ln -s /etc/nginx/sites-available/church360 /etc/nginx/sites-enabled/church360
```

### 2. Create Directory Structure

```bash
# Create the web root directory
sudo mkdir -p /var/www/church360.jerdyl.co.ke/public_html/{welfare-frontend,church-frontend}

# Set proper permissions (adjust user/group as needed)
sudo chown -R www-data:www-data /var/www/church360.jerdyl.co.ke
sudo chmod -R 755 /var/www/church360.jerdyl.co.ke
```

### 3. Deploy Static Files

After building your Next.js applications:

```bash
# For welfare frontend
cd welfare-frontend
npm run build
sudo cp -r out/* /var/www/church360.jerdyl.co.ke/public_html/welfare-frontend/out/

# For church frontend
cd church-frontend
npm run build
sudo cp -r out/* /var/www/church360.jerdyl.co.ke/public_html/church-frontend/out/
```

### 4. Configure Backend API

The configuration assumes your backend is running on `localhost:5400`. If your backend is on a different server or port, update the upstream block:

```nginx
upstream backend_api {
    server your-backend-ip:5400;
    # Or use a domain name:
    # server api.church360.jerdyl.co.ke:5400;
}
```

### 5. Test and Reload Nginx

```bash
# Test the configuration
sudo nginx -t

# If test passes, reload Nginx
sudo systemctl reload nginx
```

### 6. DNS Configuration

Make sure your DNS records point to your server:

```
welfare-church360.jerdyl.co.ke  A  your-server-ip
church360.jerdyl.co.ke          A  your-server-ip
```

## SSL/HTTPS Setup (Recommended)

After setting up HTTP, configure SSL certificates using Let's Encrypt:

```bash
# Install certbot
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificates for both domains
sudo certbot --nginx -d welfare-church360.jerdyl.co.ke -d church360.jerdyl.co.ke

# Certbot will automatically update your Nginx config
```

After SSL setup, update the configuration to redirect HTTP to HTTPS and add SSL server blocks.

## Features

- ✅ Static file serving for both frontends
- ✅ API proxying to backend (`/api` routes)
- ✅ Next.js routing support (SPA fallback)
- ✅ Gzip compression
- ✅ Static asset caching (1 year)
- ✅ Security headers
- ✅ Access/error logging

## Troubleshooting

### Check Nginx Status
```bash
sudo systemctl status nginx
```

### View Error Logs
```bash
sudo tail -f /var/log/nginx/welfare_church360_error.log
sudo tail -f /var/log/nginx/church360_error.log
```

### Check File Permissions
```bash
ls -la /var/www/church360.jerdyl.co.ke/public_html/
```

### Verify Backend Connection
```bash
curl http://localhost:5400/api/health
```

## Notes

- The configuration assumes both frontends are static exports (Next.js `output: 'export'`)
- API requests are proxied to `localhost:5400` - adjust if your backend is elsewhere
- Static assets are cached for 1 year for optimal performance
- Hidden files and source files are blocked for security


