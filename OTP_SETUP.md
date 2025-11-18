# OTP Feature Implementation Guide

## Overview
This music website now includes a complete One-Time Password (OTP) authentication system. Users must verify their email with an OTP before registering and accessing the platform.

## Features
- 6-digit OTP generation
- Email-based OTP delivery
- 5-minute OTP expiration
- Resend OTP functionality
- Two-step registration process (Email verification → Password setup)
- Email verification required for login

## Architecture

### Backend Components

#### 1. **User Schema Updates** (`backend/models/userschema.js`)
Added fields:
- `otp`: Stores the 6-digit OTP temporarily
- `otpExpiry`: Timestamp for OTP expiration
- `isVerified`: Boolean flag for email verification status
- `createdAt`: User creation timestamp

#### 2. **OTP Utility Functions** (`backend/utils/otpUtil.js`)
- `generateOTP()`: Generates a 6-digit OTP using speakeasy
- `sendOTPEmail()`: Sends OTP via Gmail using nodemailer
- `verifyOTP()`: Validates OTP against stored value and checks expiration
- `generateOTPExpiry()`: Creates 5-minute expiration timestamp

#### 3. **OTP Controller** (`backend/controllers/otpcontroller.js`)
Endpoints:
- `POST /api/v1/auth/send-otp` - Send OTP to email
- `POST /api/v1/auth/verify-otp` - Verify OTP and complete registration
- `POST /api/v1/auth/resend-otp` - Resend OTP
- Updated `POST /api/v1/auth/login` - Requires email verification

#### 4. **Auth Routes** (`backend/routes/authroutes.js`)
All new OTP routes are registered here.

### Frontend Components

#### 1. **OTP Verification Page** (`frontend/src/pages/OTPVerification.jsx`)
Two-step registration UI:
- **Step 1**: Enter name and email, receive OTP
- **Step 2**: Enter OTP and set password, complete registration
- Features:
  - Real-time validation
  - Resend OTP with 60-second cooldown
  - Error and success messages
  - Password confirmation

#### 2. **Updated Login Page** (`frontend/src/pages/Login.jsx`)
- Enhanced error handling
- Links to OTP registration
- Email verification requirement

#### 3. **App Routes** (`frontend/src/App.jsx`)
Added `/otp-verification` route for the new registration flow.

## Setup Instructions

### 1. Install Dependencies
Backend:
```bash
cd backend
npm install nodemailer speakeasy
```

### 2. Configure Environment Variables

Create a `.env` file in the backend root with:
```env
MONGO_URI=mongodb://your_connection_string
JWT_SECRET=your_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
PORT=1337
NODE_ENV=development
```

Create a `.env` file in the frontend root with:
```env
VITE_API_URL=http://localhost:1337
```

### 3. Gmail Setup (Required for OTP delivery)

1. Go to [myaccount.google.com](https://myaccount.google.com)
2. Select **Security** from the left sidebar
3. Enable **2-Step Verification** (if not already enabled)
4. Search for **App passwords**
5. Select **Mail** and **Windows Computer** (or your OS)
6. Google will generate a 16-character password
7. Copy this password and paste it as `EMAIL_PASSWORD` in your `.env`

**Note**: Standard Gmail passwords won't work. You must use an App Password.

## API Endpoints

### Send OTP
```
POST /api/v1/auth/send-otp
Content-Type: application/json

{
  "email": "user@example.com",
  "fullName": "John Doe"
}

Response (200):
{
  "message": "OTP sent to your email",
  "status": "success",
  "email": "user@example.com"
}
```

### Verify OTP & Register
```
POST /api/v1/auth/verify-otp
Content-Type: application/json

{
  "email": "user@example.com",
  "otp": "123456",
  "password": "your_password"
}

Response (200):
{
  "message": "Email verified and user registered successfully",
  "status": "success",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "fullName": "John Doe",
    "email": "user@example.com"
  }
}
```

### Resend OTP
```
POST /api/v1/auth/resend-otp
Content-Type: application/json

{
  "email": "user@example.com"
}

Response (200):
{
  "message": "OTP resent to your email",
  "status": "success",
  "email": "user@example.com"
}
```

### Login (Updated)
```
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "your_password"
}

Response (200):
{
  "message": "User logged in",
  "status": "success",
  "token": "jwt_token_here"
}
```

## User Registration Flow

### Step 1: Request OTP
- User enters full name and email
- System checks if email is already verified
- OTP is generated and sent via email
- OTP stored in database with 5-minute expiry

### Step 2: Verify OTP & Complete Registration
- User enters received OTP and password
- System validates OTP (must not be expired)
- Password is hashed and stored
- User marked as verified
- JWT token returned for immediate login

### Step 3: Login
- User can now login with email and password
- System verifies email is verified before allowing login

## Error Handling

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| "Invalid or expired OTP" | OTP is wrong or past 5 minutes | Request a new OTP using resend button |
| "User already registered" | Account exists and is verified | Use login instead |
| "Failed to send OTP" | Email configuration issue | Check Gmail app password setup |
| "Please verify your email first" | Trying to login with unverified email | Complete OTP verification first |

## Security Considerations

1. **OTP Expiration**: Set to 5 minutes for security balance
2. **Password Hashing**: Uses bcryptjs with salt rounds
3. **JWT Tokens**: Expire after 7 days
4. **Email Verification**: Required before account activation
5. **Rate Limiting**: Consider implementing for production
6. **HTTPS**: Use in production environment

## Future Enhancements

1. Add SMS-based OTP option
2. Implement OTP rate limiting
3. Add resend OTP rate limiting
4. Password reset via OTP
5. Two-factor authentication
6. Account recovery options
7. Email change verification

## Troubleshooting

### OTP not receiving?
- Check spam/trash folder
- Verify `EMAIL_USER` is correct
- Ensure Gmail app password is correct
- Check backend logs for email errors

### "Failed to connect to database"?
- Verify `MONGO_URI` in `.env`
- Ensure MongoDB service is running
- Check network connectivity

### Frontend API errors?
- Verify `VITE_API_URL` matches your backend URL
- Check CORS configuration in backend
- Verify backend is running on port 1337

## Files Modified/Created

### New Files:
- `backend/utils/otpUtil.js`
- `backend/controllers/otpcontroller.js`
- `frontend/src/pages/OTPVerification.jsx`
- `.env.example`
- `OTP_SETUP.md` (this file)

### Modified Files:
- `backend/package.json` - Added nodemailer, speakeasy
- `backend/models/userschema.js` - Added OTP fields
- `backend/routes/authroutes.js` - Added OTP routes
- `frontend/src/pages/Login.jsx` - Enhanced with error handling
- `frontend/src/App.jsx` - Added OTP verification route

## Dependencies Added

```json
"nodemailer": "^6.9.7",
"speakeasy": "^2.0.0"
```

## Support
For issues or questions, check the error messages and logs. Most common issues are related to Gmail configuration or MongoDB connection.
