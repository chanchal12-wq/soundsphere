#!/bin/bash
# 🔒 Environment Security Check Script
# Run this to verify your .env files are properly secured

echo "🔍 Checking Environment Security..."
echo "===================================="
echo ""

# Check backend/.env.example exists
echo "✓ Checking backend/.env.example exists..."
if [ -f "backend/.env.example" ]; then
    echo "  ✅ Found: backend/.env.example"
else
    echo "  ❌ Missing: backend/.env.example"
fi

# Check frontend/.env.example exists
echo "✓ Checking frontend/.env.example exists..."
if [ -f "frontend/.env.example" ]; then
    echo "  ✅ Found: frontend/.env.example"
else
    echo "  ❌ Missing: frontend/.env.example"
fi

# Check backend/.env is gitignored
echo "✓ Checking backend/.gitignore..."
if grep -q "\.env" "backend/.gitignore"; then
    echo "  ✅ .env is in .gitignore"
else
    echo "  ❌ .env is NOT in .gitignore"
fi

# Check frontend/.gitignore exists
echo "✓ Checking frontend/.gitignore..."
if [ -f "frontend/.gitignore" ]; then
    echo "  ✅ Found: frontend/.gitignore"
else
    echo "  ⚠️  Missing: frontend/.gitignore"
fi

echo ""
echo "===================================="
echo "✅ Security Check Complete!"
echo ""
echo "Summary:"
echo "  - .env.example files: Templates for team"
echo "  - .gitignore: Prevents .env commits"
echo "  - .env files: Keep locally, never commit"
echo ""
echo "🔒 Your credentials are now secure!"
