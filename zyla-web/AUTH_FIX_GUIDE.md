# 🔐 Frontend Auth Setup Guide

## ✅ Cleaned Up Files:

### **KEPT (Working Files):**
- `login.tsx` → Clean login page with validation
- `RegisterPage.tsx` → Clean signup page with validation
- `api.ts` → API service with interceptors

### **DELETED (Duplicates/Broken):**
- ❌ LoginForm.tsx
- ❌ LoginPage.tsx
- ❌ registration.tsx
- ❌ SignupForm.tsx
- ❌ ZylaAuth.tsx

---

## 🚀 How to Fix Login/Signup Issues:

### **Step 1: Start Backend Server**

```bash
cd zyla-backend

# Make sure .env file exists with these variables:
# JWT_SECRET="your-32-plus-character-secret"
# DATABASE_URL="postgresql://..."
# PLAID_CLIENT_ID="..."
# PLAID_SECRET_KEY="..."

# Run debug to check env vars
npm run debug:auth

# Start server
npm run dev
```

You should see:
```
✅ Environment variables validated successfully
🚀 Zyla Backend Server running on http://localhost:5000
```

---

### **Step 2: Check Backend is Running**

Open browser or curl:
```bash
curl http://localhost:5000/health
```

Should return:
```json
{
  "status": "OK",
  "message": "Zyla AI Financial Assistant API is running!"
}
```

---

### **Step 3: Test Registration**

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

Success response:
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "...",
    "name": "Test User",
    "email": "test@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": "7d"
}
```

---

### **Step 4: Test Login**

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

Success response:
```json
{
  "message": "Login successful",
  "user": {
    "id": "...",
    "name": "Test User",
    "email": "test@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### **Step 5: Start Frontend**

```bash
cd zyla-web
npm start
```

---

### **Step 6: Test Full Flow**

1. **Go to Register Page:**
   - Navigate to: `http://localhost:3000/register`
   - Fill in name, email, password
   - Click "Create account"
   - Should redirect to `/dashboard`

2. **Go to Login Page:**
   - Navigate to: `http://localhost:3000/login`
   - Enter email & password
   - Click "Sign in"
   - Should redirect to `/dashboard`

---

## 🔴 Common Errors & Fixes:

### **Error: "Network Error" / "Failed to fetch"**
**Cause:** Backend not running or wrong URL

**Fix:**
```bash
# Check backend is running
curl http://localhost:5000/health

# If not, start it:
cd zyla-backend
npm run dev
```

---

### **Error: "JWT_SECRET is not defined"**
**Cause:** Missing or invalid .env file

**Fix:**
```bash
cd zyla-backend
cp .env.example .env

# Add to .env:
JWT_SECRET="generate-a-very-long-random-secret-at-least-32-characters-long"
```

Generate secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

### **Error: "Invalid credentials" / "User not found"**
**Cause:** Wrong email/password or user doesn't exist

**Fix:**
- Make sure you registered first
- Check email is correct (case-insensitive)
- Try registering a new user

---

### **Error: "User already exists"**
**Cause:** Email already registered

**Fix:**
- Use different email, OR
- Login with existing credentials, OR
- Delete user from database:
```bash
# In database console (Neon/Prisma Studio):
DELETE FROM users WHERE email = 'test@example.com';
```

---

### **Error: "Token expired"**
**Cause:** Token is older than 7 days

**Fix:**
- Login again to get new token
- Token is automatically stored in localStorage

---

### **Error: CORS blocked**
**Cause:** Frontend and backend on different ports

**Fix:**
Check `.env` in backend:
```bash
ALLOWED_ORIGINS="http://localhost:3000,http://localhost:19006"
```

Or update `server.ts`:
```typescript
app.use(cors({
  origin: ['http://localhost:3000'],
  credentials: true
}));
```

---

## 📋 Checklist Before Testing:

- [ ] Backend `.env` file exists with JWT_SECRET, DATABASE_URL, Plaid keys
- [ ] Backend server running on http://localhost:5000
- [ ] Health endpoint returns OK: `curl http://localhost:5000/health`
- [ ] Database connected (run `npm run debug:auth`)
- [ ] Frontend running on http://localhost:3000
- [ ] Browser console has no CORS errors
- [ ] localStorage cleared (if testing fresh): `localStorage.clear()`

---

## 🎯 Working Auth Flow:

1. **User visits** `/register`
2. **Fills form** → Name, Email, Password
3. **Frontend validates** → Email format, password length, etc.
4. **Frontend sends** `POST /api/auth/register` with data
5. **Backend validates** → Zod schema validation
6. **Backend checks** → User doesn't already exist
7. **Backend hashes** → Password with bcrypt (12 rounds)
8. **Backend creates** → User in database
9. **Backend generates** → JWT token (7 day expiry)
10. **Backend returns** → User data + Token
11. **Frontend stores** → Token in `localStorage.zyla_token`
12. **Frontend redirects** → `/dashboard`
13. **All future requests** → Include token in `Authorization: Bearer <token>` header

---

## 🔍 Debug Tips:

**Check localStorage:**
```javascript
// In browser console:
localStorage.getItem('zyla_token')
localStorage.getItem('zyla_user')
```

**Clear localStorage:**
```javascript
localStorage.clear()
```

**Check API calls in Network tab:**
- Open DevTools → Network tab
- Try login/register
- Check request/response headers and payload

**Check backend logs:**
- Backend terminal shows all requests
- Look for error messages

---

## 📞 Need Help?

Run this to test everything:
```bash
# Backend
cd zyla-backend
npm run debug:auth

# Should show:
# ✅ JWT_SECRET: Set (64 chars)
# ✅ Token generation: SUCCESS
# ✅ Database connection: SUCCESS
```

If all ✅, your auth should work! 🎉
