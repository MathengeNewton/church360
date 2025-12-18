# Frontend Configuration Fix Plan

## 🔍 Issues Identified

### Issue 1: Port Redirection (3001 → 3000, 3002 → 3000)
**Root Cause:** 
- Next.js apps are configured with `output: 'export'` (static export)
- When running in development mode, Next.js dev server may redirect to default port 3000
- Static exports don't work well with dev server - they're meant for production builds
- Hardcoded URLs in metadata/OG tags pointing to `localhost:3000`

**Files Affected:**
- `welfare-frontend/next.config.mjs`
- `church-frontend/next.config.mjs`
- `welfare-frontend/app/layout.jsx` (metadata)
- `church-frontend/app/layout.jsx` (metadata)
- Generated `out/` files contain hardcoded `localhost:3000` references

---

### Issue 2: Trailing Slash 404 (`/auth/login/` fails)
**Root Cause:**
- Next.js with `output: 'export'` doesn't handle trailing slashes well
- Need to configure `trailingSlash` option
- Static exports create `/auth/login.html` but not `/auth/login/index.html`

**Files Affected:**
- `welfare-frontend/next.config.mjs`
- `church-frontend/next.config.mjs`

---

### Issue 3: Port 3002 Not Accessible / Redirects to 3000
**Root Cause:**
- Same as Issue 1 - port redirection problem
- May also be related to how the app is being served (dev vs production)
- Could be browser caching or service worker issues

---

### Issue 4: Dashboard Generic Data (Deferred)
**Status:** Will be addressed after config fixes
**Note:** Need to create backend APIs for dashboard stats

---

## 🎯 Solution Plan

### **PHASE 1: Fix Next.js Configuration** (Priority: CRITICAL)

#### Step 1.1: Update Next.js Config for Development
**Problem:** `output: 'export'` is for static builds, not dev servers

**Solution:** 
- Create separate configs for dev vs production
- OR: Remove `output: 'export'` for dev, keep for production builds
- Add proper routing configuration

**Files to Update:**
- `welfare-frontend/next.config.mjs`
- `church-frontend/next.config.mjs`

**Changes:**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Only use static export for production builds
  ...(process.env.NODE_ENV === 'production' && { output: 'export' }),
  
  // Fix trailing slash handling
  trailingSlash: true,
  
  // Ensure proper routing
  reactStrictMode: true,
  
  images: {
    unoptimized: true, // Required for static export
  },
  
  // Base path configuration (if needed)
  // basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
};
```

---

#### Step 1.2: Fix Metadata URLs
**Problem:** Hardcoded `localhost:3000` in metadata

**Solution:** Use environment variables or relative URLs

**Files to Update:**
- `welfare-frontend/app/layout.jsx`
- `church-frontend/app/layout.jsx`

**Changes:**
```javascript
// Use environment variable or relative URLs
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';

openGraph: {
  // ... other fields
  images: [
    {
      url: `${baseUrl}/images/og-image.png`, // Relative or env-based
      // ...
    },
  ],
},
```

---

### **PHASE 2: Fix Routing & Trailing Slash** (Priority: HIGH)

#### Step 2.1: Configure Trailing Slash Handling
**Solution:** Set `trailingSlash: true` in Next.js config

**Files to Update:**
- `welfare-frontend/next.config.mjs`
- `church-frontend/next.config.mjs`

---

#### Step 2.2: Add Redirect Rules
**Solution:** Add middleware or redirects for common routes

**Files to Create/Update:**
- `welfare-frontend/middleware.js` (optional)
- `church-frontend/middleware.js` (optional)

**OR** use `next.config.mjs` redirects:
```javascript
async redirects() {
  return [
    {
      source: '/auth/login',
      destination: '/auth/login/',
      permanent: true,
    },
  ];
}
```

---

### **PHASE 3: Fix Port Configuration** (Priority: CRITICAL)

#### Step 3.1: Environment-Based Port Configuration
**Problem:** Apps hardcode or assume port 3000

**Solution:** Use environment variables for port configuration

**Files to Update:**
- `welfare-frontend/package.json` (dev script)
- `church-frontend/package.json` (dev script)
- Create `.env.local` files

**Changes:**
```json
// package.json
{
  "scripts": {
    "dev": "next dev -p ${PORT:-3001}",
    // OR use separate scripts
    "dev:welfare": "PORT=3001 next dev",
    "dev:church": "PORT=3002 next dev"
  }
}
```

---

#### Step 3.2: Fix Docker Port Mapping
**Problem:** Docker containers expose port 3000 internally but map to different ports externally

**Solution:** Ensure Docker config is correct (already correct in docker-compose.yml)

**Verify:**
- `welfare-frontend`: Container port 3000 → Host port 3001 ✅
- `church-frontend`: Container port 3000 → Host port 3002 ✅

---

### **PHASE 4: Development vs Production Mode** (Priority: MEDIUM)

#### Step 4.1: Separate Dev and Production Configs
**Problem:** Using static export in development causes issues

**Solution:** 
- Development: Run Next.js dev server (no static export)
- Production: Build static files (with static export)

**Approach:**
1. Remove `output: 'export'` from dev mode
2. Keep `output: 'export'` only for production builds
3. Update Dockerfiles to handle both modes

---

## 📋 Implementation Checklist

### **Immediate Fixes (Do First):**

- [ ] **Fix 1:** Update `next.config.mjs` for both frontends
  - [ ] Remove `output: 'export'` for dev mode
  - [ ] Add `trailingSlash: true`
  - [ ] Add proper redirects

- [ ] **Fix 2:** Update `layout.jsx` metadata
  - [ ] Remove hardcoded `localhost:3000`
  - [ ] Use relative URLs or env variables

- [ ] **Fix 3:** Update `package.json` scripts
  - [ ] Add port configuration to dev scripts
  - [ ] Create separate dev scripts for each app

- [ ] **Fix 4:** Test routing
  - [ ] Test `/auth/login` (no trailing slash)
  - [ ] Test `/auth/login/` (with trailing slash)
  - [ ] Test port accessibility (3001 and 3002)

### **Secondary Fixes:**

- [ ] **Fix 5:** Create `.env.local` files
  - [ ] `welfare-frontend/.env.local` with `PORT=3001`
  - [ ] `church-frontend/.env.local` with `PORT=3002`

- [ ] **Fix 6:** Update Dockerfiles (if needed)
  - [ ] Ensure dev mode doesn't use static export
  - [ ] Production builds use static export

- [ ] **Fix 7:** Clean build artifacts
  - [ ] Remove `out/` directories
  - [ ] Remove `.next/` directories
  - [ ] Rebuild fresh

---

## 🔧 Detailed Fix Steps

### **Step 1: Update Next.js Configs**

**File: `welfare-frontend/next.config.mjs`**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Only use static export for production builds
  ...(process.env.NODE_ENV === 'production' && { output: 'export' }),
  
  // Fix trailing slash handling
  trailingSlash: true,
  
  // React strict mode
  reactStrictMode: true,
  
  images: {
    unoptimized: true, // Required for static export
  },
  
  // Redirects for trailing slash consistency
  async redirects() {
    return [
      // Ensure trailing slash consistency
      {
        source: '/auth/login',
        destination: '/auth/login/',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
```

**File: `church-frontend/next.config.mjs`**
```javascript
// Same as above
```

---

### **Step 2: Update Layout Metadata**

**File: `welfare-frontend/app/layout.jsx`**
```javascript
export const metadata = {
  // ... existing fields
  openGraph: {
    // ... existing fields
    images: [
      {
        url: "/images/og-image.png", // Relative URL instead of localhost:3000
        // ... rest of fields
      },
    ],
  },
};
```

**File: `church-frontend/app/layout.jsx`**
```javascript
// Same as above
```

---

### **Step 3: Update Package.json Scripts**

**File: `welfare-frontend/package.json`**
```json
{
  "scripts": {
    "dev": "next dev -p 3001",
    "build": "NODE_ENV=production next build",
    "start": "next start -p 3001"
  }
}
```

**File: `church-frontend/package.json`**
```json
{
  "scripts": {
    "dev": "next dev -p 3002",
    "build": "NODE_ENV=production next build",
    "start": "next start -p 3002"
  }
}
```

---

### **Step 4: Create Environment Files**

**File: `welfare-frontend/.env.local`**
```
PORT=3001
NEXT_PUBLIC_API_URL=http://localhost:5400/api
```

**File: `church-frontend/.env.local`**
```
PORT=3002
NEXT_PUBLIC_API_URL=http://localhost:5400/api
```

---

## 🧪 Testing Plan

### **Test 1: Port Accessibility**
- [ ] Access `http://localhost:3001` → Should load welfare frontend
- [ ] Access `http://localhost:3002` → Should load church frontend
- [ ] No redirects to port 3000

### **Test 2: Trailing Slash**
- [ ] Access `http://localhost:3001/auth/login` → Should work
- [ ] Access `http://localhost:3001/auth/login/` → Should work (no 404)
- [ ] Access `http://localhost:3002/auth/login` → Should work
- [ ] Access `http://localhost:3002/auth/login/` → Should work (no 404)

### **Test 3: Page Refresh**
- [ ] Refresh any page on port 3001 → Should stay on 3001
- [ ] Refresh any page on port 3002 → Should stay on 3002
- [ ] No redirects to port 3000

### **Test 4: Navigation**
- [ ] Navigate between pages → Should work smoothly
- [ ] Login redirect → Should work correctly
- [ ] Logout redirect → Should work correctly

---

## 🚨 Critical Notes

1. **Static Export vs Dev Server:**
   - `output: 'export'` is ONLY for production static builds
   - Dev server should NOT use static export
   - This is likely the main cause of port redirection issues

2. **Trailing Slash:**
   - Next.js handles trailing slashes differently in dev vs production
   - Setting `trailingSlash: true` ensures consistency

3. **Port Configuration:**
   - Always specify port in dev scripts
   - Use environment variables for flexibility
   - Docker port mapping is already correct

4. **Build Artifacts:**
   - Old `out/` directories may contain hardcoded URLs
   - Clean and rebuild after config changes

---

## 📝 Next Steps After Fixes

1. ✅ Fix all configuration issues
2. ✅ Test all routes and ports
3. ⏭️ Then work on dashboard API integration
4. ⏭️ Then work on other functionality

---

**Ready to implement? Let's start with Phase 1!**

