# 🔧 Environment Setup Guide

## Step 1: Create `.env` file

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

## Step 2: Configure Required Variables

### 1. JWT_SECRET (CRITICAL!)
```bash
# Generate a strong secret (32+ characters):
JWT_SECRET="zyla-super-secret-jwt-key-2024-production-v1-9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c"
```

**Generate one online:**
- https://randomkeygen.com/ (256-bit WPA Key)
- Or run: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

### 2. DATABASE_URL
```bash
# Get from Neon.tech (FREE tier):
DATABASE_URL="postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/zyla_db?sslmode=require"
```

**Setup Neon:**
1. Go to https://neon.tech
2. Sign up (FREE)
3. Create new project "Zyla"
4. Copy connection string
5. Paste above

### 3. Plaid API Keys
```bash
# Get from Plaid Dashboard (FREE sandbox):
PLAID_CLIENT_ID="your-plaid-client-id"
PLAID_SECRET_KEY="your-plaid-secret-sandbox-key"
PLAID_ENVIRONMENT="sandbox"
```

**Setup Plaid:**
1. Go to https://dashboard.plaid.com/signup
2. Sign up (FREE)
3. Get Sandbox keys (Development section)
4. Copy Client ID & Sandbox Secret
5. Keep `PLAID_ENVIRONMENT="sandbox"` for FREE tier

### 4. Optional Settings
```bash
PORT=5000
NODE_ENV="development"
ALLOWED_ORIGINS="http://localhost:3000"
```

## Step 3: Initialize Database

```bash
# Install dependencies
npm install

# Run Prisma migrations
npx prisma migrate dev

# Generate Prisma Client
npx prisma generate
```

## Step 4: Test Setup

```bash
# Start backend
npm run dev

# You should see:
✅ Environment variables validated successfully
🚀 Zyla Backend Server running on http://localhost:5000
🏥 Health Check: http://localhost:5000/health
```

## Step 5: Test Auth Endpoints

### Register User:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## Common Issues & Fixes

### ❌ "JWT_SECRET is not defined"
**Fix:** Add `JWT_SECRET` to `.env` with at least 32 characters

### ❌ "Can't reach database server"
**Fix:** Check `DATABASE_URL` is correct, test connection on Neon dashboard

### ❌ "Invalid token"
**Fix:** 
1. Check token is being sent in header: `Authorization: Bearer <token>`
2. Token might be expired (7 days expiry)
3. Clear localStorage and re-login

### ❌ "User already exists"
**Fix:** Use different email or delete existing user from database

### ❌ CORS errors
**Fix:** Add your frontend URL to `ALLOWED_ORIGINS` in `.env`:
```bash
ALLOWED_ORIGINS="http://localhost:3000,http://localhost:19006"
```

## Security Checklist

- [ ] JWT_SECRET is 32+ characters
- [ ] DATABASE_URL contains `sslmode=require`
- [ ] Never commit `.env` to Git (in `.gitignore`)
- [ ] Use different JWT_SECRET for production
- [ ] Plaid is in sandbox mode for development
- [ ] Rate limiting is enabled (100 req/15min)

## Next Steps

Once setup is complete:
1. ✅ Test auth endpoints (register, login, verify)
2. ✅ Connect Plaid (get link token, exchange token)
3. ✅ Sync accounts and transactions
4. ✅ Wire frontend to backend APIs

---

**Need help?** Check server logs for detailed error messages!
