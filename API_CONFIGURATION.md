# API Configuration Summary

## Overview
Both frontend applications (`welfare-frontend` and `church-frontend`) are now configured to use the same backend API running on **port 5400**.

## Backend Configuration

### Docker Compose
- **Backend Port Mapping**: `5400:3000` (host:container)
- **Backend URL**: `http://localhost:5400`
- **API Base URL**: `http://localhost:5400/api`

### Environment Variables
- Backend runs on port `3000` inside the container
- Exposed on port `5400` on the host machine
- Set `NEXT_PUBLIC_API_URL` environment variable to override API URL in frontends

## Frontend Configuration

### Welfare Frontend (`welfare-frontend/lib/api.js`)
```javascript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5400/api';
```

### Church Frontend (`church-frontend/lib/api.js`)
```javascript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5400/api';
```

## Changes Made

### 1. Fixed Hardcoded URLs
- ✅ Removed hardcoded `http://localhost:3000/api` from `welfare-frontend/app/auth/login/LoginForm.jsx`
- ✅ Updated both frontends to use centralized `apiClient` from `lib/api.js`

### 2. Standardized Authentication
- ✅ Created `AuthContext` for `welfare-frontend` (matching `church-frontend`)
- ✅ Updated `welfare-frontend/app/auth/login/LoginForm.jsx` to use `AuthContext` and `apiClient`
- ✅ Updated `welfare-frontend/app/(dashboard)/DashboardHeader.jsx` to use `AuthContext`
- ✅ Wrapped `welfare-frontend/app/layout.jsx` with `AuthProvider`

### 3. API Client Consistency
- ✅ Both frontends use the same API client pattern
- ✅ Both support `username` or `email` for login (backend accepts both)
- ✅ Both automatically attach JWT tokens via request interceptors
- ✅ Both handle 401 errors and redirect to login

## Testing

### Login Credentials (Both UIs)
- **Email/Username**: `admin@church360.org` or `admin`
- **Password**: `admin123`

### Access Points
- **Backend API**: `http://localhost:5400/api`
- **Backend Swagger**: `http://localhost:5400/api/docs`
- **Welfare Frontend**: `http://localhost:3001`
- **Church Frontend**: `http://localhost:3002`

## Environment Variables

To override the API URL for development or production:

### Development (Local)
```bash
# No need to set - defaults to http://localhost:5400/api
```

### Production/Docker
```bash
# Set in docker-compose.yml or .env file
NEXT_PUBLIC_API_URL=http://backend-service:3000/api
```

### Different Backend Port
```bash
# If backend runs on different port
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

## Verification

To verify both frontends are hitting the correct backend:

1. **Check Network Tab**:
   - Open browser DevTools → Network tab
   - Login to either frontend
   - Verify API calls go to `http://localhost:5400/api/*`

2. **Check Backend Logs**:
   ```bash
   docker compose logs -f backend
   ```
   - Should see requests coming in when you interact with frontends

3. **Test Login**:
   - Use `admin@church360.org` / `admin123` on both frontends
   - Should successfully authenticate and redirect to dashboard

## Troubleshooting

### Frontend hitting wrong port
- Clear browser cache and hard refresh (Ctrl+Shift+R)
- Check `lib/api.js` in the frontend - should have `http://localhost:5400/api`
- Rebuild Docker containers: `docker compose build --no-cache`

### CORS Errors
- Backend CORS is configured in `backend/src/main.ts`
- Allows requests from `localhost:3001` and `localhost:3002`
- If using different ports, update CORS configuration

### 401 Unauthorized
- Check if token is stored: `localStorage.getItem('pcea-token')`
- Verify token is attached: Check Network tab → Request Headers → Authorization
- Try logging out and logging back in

## Notes

- Both frontends share the same backend and authentication system
- Same credentials work for both UIs
- API client automatically handles token storage and attachment
- All API calls go through the centralized `apiClient` object

