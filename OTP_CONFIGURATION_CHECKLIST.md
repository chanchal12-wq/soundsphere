# ✅ OTP Feature - Configuration Checklist

Use this checklist to ensure everything is properly configured before running the application.

## 🔧 Pre-Installation

- [ ] Node.js installed (v14+)
- [ ] MongoDB installed and running (or MongoDB Atlas account)
- [ ] Gmail account (for OTP delivery)
- [ ] Text editor or VS Code

## 📦 Installation Steps

### Backend Setup
- [ ] Navigate to backend folder: `cd backend`
- [ ] Install dependencies: `npm install`
- [ ] Verify nodemailer and speakeasy in package.json

### Frontend Setup
- [ ] Navigate to frontend folder: `cd frontend`
- [ ] Verify dependencies installed
- [ ] Check OTPVerification.jsx exists in src/pages/
- [ ] Check App.jsx has OTP route

## 🔐 Gmail Configuration

### Enable 2-Step Verification
- [ ] Go to https://myaccount.google.com/security
- [ ] Click "2-Step Verification"
- [ ] Follow setup wizard
- [ ] Confirm 2-Step Verification is enabled

### Generate App Password
- [ ] Go to https://myaccount.google.com/apppasswords
- [ ] Select "Mail" in the app dropdown
- [ ] Select your device type
- [ ] Google generates 16-character password
- [ ] Copy the password (you'll need it soon)

## 📝 Environment Variables

### Backend .env File
Create file: `backend/.env`

- [ ] `MONGO_URI=` (Your MongoDB connection string)
  - Local: `mongodb://localhost:27017/music_website`
  - Atlas: `mongodb+srv://user:password@cluster.mongodb.net/database`
- [ ] `JWT_SECRET=` (Create a random secret key, e.g., "your_super_secret_key_123456")
- [ ] `EMAIL_USER=` (Your Gmail address)
- [ ] `EMAIL_PASSWORD=` (16-character App Password from Gmail)
- [ ] `PORT=1337`

### Frontend .env File
Create file: `frontend/.env`

- [ ] `VITE_API_URL=http://localhost:1337` (for development)

### Verify .env Files
- [ ] Backend .env file exists and is NOT tracked by git
- [ ] Frontend .env file exists and is NOT tracked by git
- [ ] .gitignore includes `.env` files
- [ ] No dummy values remain (CHANGE_THIS, etc.)

## 🗄️ Database

### MongoDB Connection
- [ ] MongoDB service is running (Windows/Mac: `mongod`)
- [ ] MONGO_URI is correct
- [ ] Can connect to MongoDB with credentials

### Database Initialization
- [ ] First user registration will create collections automatically
- [ ] No manual database setup needed

## 🚀 Server Startup

### Backend
- [ ] Terminal 1: `cd backend`
- [ ] Terminal 1: `npm start`
- [ ] Verify: "Server is running at localhost:1337"
- [ ] Verify: "MongoDB connected successfully"
- [ ] No errors in console

### Frontend
- [ ] Terminal 2: `cd frontend`
- [ ] Terminal 2: `npm run dev`
- [ ] Verify: "Local: http://localhost:5173"
- [ ] Open browser and check app loads

## 🧪 Testing

### Test OTP Sending
- [ ] Navigate to http://localhost:5173/otp-verification
- [ ] Enter full name and email
- [ ] Click "Send OTP"
- [ ] Check email for OTP (within 5 minutes)
- [ ] Check for errors in backend console

### Test OTP Verification
- [ ] Enter received OTP code
- [ ] Enter password and confirm password
- [ ] Click "Verify & Register"
- [ ] Should see success message
- [ ] Check JWT token in localStorage
- [ ] User should be redirected to home

### Test Resend OTP
- [ ] Go back to OTP verification
- [ ] Click "Resend OTP"
- [ ] Wait for new email
- [ ] Verify 60-second cooldown works

### Test Login
- [ ] Go to http://localhost:5173/login
- [ ] Enter registered email
- [ ] Enter password
- [ ] Click login
- [ ] Should access dashboard

## 📊 Database Verification

### Check User Creation
- [ ] MongoDB: `db.users.findOne({email: "test@example.com"})`
- [ ] Should see user document with:
  - [ ] `fullName` field
  - [ ] `email` field
  - [ ] `isVerified: true`
  - [ ] `password` field (hashed)
  - [ ] `otp: null` (should be cleared after verification)

## 🔍 Troubleshooting Checklist

### If OTP doesn't send:
- [ ] Check EMAIL_USER and EMAIL_PASSWORD are correct
- [ ] Verify Gmail app password (not regular password)
- [ ] Check 2-Step Verification is enabled
- [ ] Look at backend console for errors
- [ ] Try sending from different email (use different EMAIL_USER)

### If registration fails:
- [ ] Check MongoDB is running
- [ ] Verify MONGO_URI in backend .env
- [ ] Check backend console for errors
- [ ] Verify email is valid format
- [ ] Check frontend console for errors

### If login fails:
- [ ] Verify user is verified in database (`isVerified: true`)
- [ ] Confirm password is correct
- [ ] Check backend console for auth errors
- [ ] Verify JWT_SECRET is correct

### If frontend won't connect:
- [ ] Check VITE_API_URL is correct
- [ ] Verify backend is running (check port 1337)
- [ ] Check browser console for CORS errors
- [ ] Try hard refresh (Ctrl+Shift+R)

## 📚 Documentation

- [ ] Read OTP_QUICKSTART.md for quick reference
- [ ] Read OTP_SETUP.md for detailed guide
- [ ] Review .env.example for variable reference
- [ ] Check OTP_IMPLEMENTATION_SUMMARY.md for overview

## 🎯 Final Checks

- [ ] Backend running without errors
- [ ] Frontend running without errors
- [ ] OTP page loads successfully
- [ ] Can send OTP
- [ ] OTP arrives in email
- [ ] Can verify OTP and register
- [ ] Can login with registered account
- [ ] JWT token stored in localStorage
- [ ] Can access protected pages

## 🎉 Ready to Deploy!

Once all checkboxes are marked, your OTP feature is:
- ✅ Properly configured
- ✅ Fully tested
- ✅ Ready for production (after HTTPS setup)

## 📞 Quick Reference

| Component | Status | Location |
|-----------|--------|----------|
| Backend | ✅ Configured | `backend/` |
| Frontend | ✅ Configured | `frontend/` |
| OTP Utils | ✅ Created | `backend/utils/otpUtil.js` |
| OTP Controller | ✅ Created | `backend/controllers/otpcontroller.js` |
| OTP Page | ✅ Created | `frontend/src/pages/OTPVerification.jsx` |
| Routes | ✅ Updated | `frontend/src/App.jsx` |
| Environment | ✅ Configured | `.env` files |

---

**Last Updated**: November 17, 2025
**Version**: 1.0
