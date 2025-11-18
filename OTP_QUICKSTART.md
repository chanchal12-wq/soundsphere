# OTP Feature - Quick Start Guide

## What's New?
Your music website now has a complete OTP (One-Time Password) email verification system for user registration!

## Quick Setup (5 minutes)

### 1. Install Packages
```bash
cd backend
npm install
```

### 2. Add to `.env` file in backend folder
```
MONGO_URI=mongodb://your_connection_string
JWT_SECRET=your_secret_key
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASSWORD=your_16_char_app_password
PORT=1337
```

### 3. Add to `.env` file in frontend folder
```
VITE_API_URL=http://localhost:1337
```

### 4. Get Gmail App Password
- Go to [myaccount.google.com](https://myaccount.google.com)
- Click Security → App passwords → Mail → Get password
- Copy the 16-character password to `EMAIL_PASSWORD` above

### 5. Start the servers
```bash
# Backend (terminal 1)
cd backend
npm start

# Frontend (terminal 2)
cd frontend
npm run dev
```

## How It Works

### Registration (New Users)
1. Click "Register" → Go to OTP Verification page
2. Enter full name and email
3. Receive 6-digit OTP in your inbox
4. Enter OTP + password → Account created!

### Login (Existing Users)
1. Click "Login"
2. Enter email and password
3. Access the app!

## Registration Flow
```
User enters email & name
        ↓
OTP sent to email (5 min validity)
        ↓
User enters OTP + password
        ↓
Email verified, account created
        ↓
JWT token issued, user logged in
```

## Files Created/Modified

### Backend
- ✅ `backend/utils/otpUtil.js` - OTP logic
- ✅ `backend/controllers/otpcontroller.js` - OTP endpoints
- ✅ `backend/models/userschema.js` - New fields added
- ✅ `backend/routes/authroutes.js` - New routes added
- ✅ `backend/package.json` - Dependencies added

### Frontend
- ✅ `frontend/src/pages/OTPVerification.jsx` - Registration page
- ✅ `frontend/src/pages/Login.jsx` - Updated login
- ✅ `frontend/src/App.jsx` - New route added

### Documentation
- ✅ `OTP_SETUP.md` - Complete setup guide
- ✅ `.env.example` - Environment variables reference

## API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/v1/auth/send-otp` | Send OTP to email |
| POST | `/api/v1/auth/verify-otp` | Verify OTP & register |
| POST | `/api/v1/auth/resend-otp` | Resend OTP |
| POST | `/api/v1/auth/login` | Login (requires verified email) |

## Features

✅ 6-digit OTP generation
✅ Email delivery via Gmail SMTP
✅ 5-minute OTP expiration
✅ Resend OTP with 60-second cooldown
✅ Password confirmation
✅ Error handling & validation
✅ Beautiful UI with Tailwind CSS
✅ Two-step registration flow

## Troubleshooting

| Problem | Solution |
|---------|----------|
| OTP not received | Check spam folder, verify Gmail app password |
| "Failed to send OTP" | Check EMAIL_USER & EMAIL_PASSWORD in `.env` |
| Login fails | Ensure email is verified via OTP first |
| API errors | Check VITE_API_URL in frontend `.env` |

## Important Notes

⚠️ **Gmail App Password Required**: Standard Gmail passwords won't work. You MUST use an App Password.

⚠️ **Database**: Ensure MongoDB is connected with proper MONGO_URI.

⚠️ **Environment Variables**: Never commit `.env` file to version control.

## Next Steps

1. Configure Gmail app password
2. Set environment variables
3. Run `npm install` in backend
4. Start both servers
5. Test registration at `/otp-verification`

## Support

See `OTP_SETUP.md` for detailed documentation and troubleshooting.
