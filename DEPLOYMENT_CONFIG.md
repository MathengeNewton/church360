# Deployment Configuration - Production API URLs

## ✅ Updated Files

All references to `localhost:5400` have been replaced with `https://api-church360.jerdyl.co.ke/api` in deployment configurations.

### 1. docker-compose.yml
- **welfare-frontend** build arg: `https://api-church360.jerdyl.co.ke/api`
- **church-frontend** build arg: `https://api-church360.jerdyl.co.ke/api`

### 2. Dockerfiles
- **welfare-frontend/Dockerfile**: Default `NEXT_PUBLIC_API_URL` set to production URL
- **church-frontend/Dockerfile**: Default `NEXT_PUBLIC_API_URL` set to production URL

### 3. Frontend API Configuration
- **welfare-frontend/lib/api.js**: Already configured with production URL as default
- **church-frontend/lib/api.js**: Already configured with production URL as default

## 🌐 Production URLs

- **Backend API**: `https://api-church360.jerdyl.co.ke/api`
- **API Documentation**: `https://api-church360.jerdyl.co.ke/docs`
- **Welfare Frontend**: `https://welfare-church360.jerdyl.co.ke`
- **Church Frontend**: `https://church360.jerdyl.co.ke`

## 🚀 Deployment Steps

1. **Build Images**:
   ```bash
   docker compose build --no-cache
   ```

2. **Start Services**:
   ```bash
   docker compose up -d
   ```

3. **Verify**:
   - Check that frontends are making API calls to `https://api-church360.jerdyl.co.ke/api`
   - Verify CORS is configured on backend to allow requests from frontend domains
   - Ensure SSL certificates are configured for all domains

## 📝 Notes

- The `docker-compose.yml` port mappings (3001, 3002, 5400) are for **local development only**
- In production, use the nginx reverse proxy configuration on the server
- The frontend builds will use the production API URL by default
- Environment variables can override the API URL if needed

