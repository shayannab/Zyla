// 🔍 Auth Debugging Script
// Run with: node src/debug-auth.js

require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

console.log('\n🔍 Zyla Auth Debugging Tool\n');

// 1. Check Environment Variables
console.log('📋 Environment Variables Check:');
const envChecks = {
  'JWT_SECRET': process.env.JWT_SECRET,
  'DATABASE_URL': process.env.DATABASE_URL ? '✅ Set' : '❌ Missing',
  'PLAID_CLIENT_ID': process.env.PLAID_CLIENT_ID ? '✅ Set' : '❌ Missing',
  'PLAID_SECRET_KEY': process.env.PLAID_SECRET_KEY ? '✅ Set' : '❌ Missing',
  'PORT': process.env.PORT || '5000 (default)',
  'NODE_ENV': process.env.NODE_ENV || 'development (default)'
};

for (const [key, value] of Object.entries(envChecks)) {
  if (key === 'JWT_SECRET') {
    if (!value) {
      console.log(`   ❌ ${key}: Missing!`);
    } else if (value.length < 32) {
      console.log(`   ⚠️  ${key}: Too short (${value.length} chars, need 32+)`);
    } else {
      console.log(`   ✅ ${key}: Set (${value.length} chars)`);
    }
  } else {
    console.log(`   ${value.toString().includes('❌') ? '❌' : '✅'} ${key}: ${value}`);
  }
}

// 2. Test JWT Token Generation
console.log('\n🔐 JWT Token Test:');
try {
  if (!process.env.JWT_SECRET) {
    console.log('   ❌ Cannot test JWT - JWT_SECRET is missing!');
  } else {
    const testToken = jwt.sign({ userId: 'test-user-123' }, process.env.JWT_SECRET, { expiresIn: '7d' });
    console.log('   ✅ Token generation: SUCCESS');
    console.log(`   📝 Sample token: ${testToken.substring(0, 50)}...`);
    
    // Test verification
    const decoded = jwt.verify(testToken, process.env.JWT_SECRET);
    console.log('   ✅ Token verification: SUCCESS');
    console.log(`   👤 Decoded userId: ${decoded.userId}`);
  }
} catch (error) {
  console.log(`   ❌ JWT Error: ${error.message}`);
}

// 3. Test Password Hashing
console.log('\n🔒 Password Hashing Test:');
try {
  const testPassword = 'password123';
  const hashedPassword = bcrypt.hashSync(testPassword, 12);
  console.log('   ✅ Password hashing: SUCCESS');
  console.log(`   📝 Hash: ${hashedPassword.substring(0, 40)}...`);
  
  // Test comparison
  const isMatch = bcrypt.compareSync(testPassword, hashedPassword);
  console.log(`   ✅ Password comparison: ${isMatch ? 'MATCH' : 'NO MATCH'}`);
} catch (error) {
  console.log(`   ❌ Hashing Error: ${error.message}`);
}

// 4. Database Connection Test
console.log('\n💾 Database Connection Test:');
if (!process.env.DATABASE_URL) {
  console.log('   ❌ DATABASE_URL is missing!');
} else {
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    
    (async () => {
      try {
        await prisma.$connect();
        console.log('   ✅ Database connection: SUCCESS');
        
        // Test user count
        const userCount = await prisma.user.count();
        console.log(`   👥 Total users in database: ${userCount}`);
        
        await prisma.$disconnect();
      } catch (dbError) {
        console.log(`   ❌ Database Error: ${dbError.message}`);
        console.log('   💡 Check your DATABASE_URL and run "npx prisma migrate dev"');
      }
    })();
  } catch (error) {
    console.log(`   ❌ Prisma Error: ${error.message}`);
  }
}

// 5. Sample cURL Commands
console.log('\n📡 Test API Endpoints:');
console.log('\n1️⃣ Register User:');
console.log(`curl -X POST http://localhost:${process.env.PORT || 5000}/api/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'`);

console.log('\n2️⃣ Login:');
console.log(`curl -X POST http://localhost:${process.env.PORT || 5000}/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"email":"test@example.com","password":"password123"}'`);

console.log('\n3️⃣ Health Check:');
console.log(`curl http://localhost:${process.env.PORT || 5000}/health`);

console.log('\n✅ Debugging complete!\n');
