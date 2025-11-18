# 📊 OTP SYSTEM - ARCHITECTURE & DIAGRAMS

## 🏗️ SYSTEM ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  /otp-verification (Registration)    /login (Login)            │
│  ┌──────────────────────────┐       ┌─────────────────────┐   │
│  │ Step 1: Email & Name     │       │ Step 1: Email       │   │
│  │ [send-otp]               │       │ [login]             │   │
│  │                          │       │                     │   │
│  │ Step 2: OTP + Password   │       │ Step 2: OTP + Pass  │   │
│  │ [verify-otp]             │       │ [verify-login-otp]  │   │
│  └──────────────────────────┘       └─────────────────────┘   │
│           │                                  │                 │
└───────────┼──────────────────────────────────┼─────────────────┘
            │                                  │
            └──────────────┬───────────────────┘
                           │
        ┌──────────────────▼─────────────────┐
        │  BACKEND ROUTES (Express.js)      │
        ├───────────────────────────────────┤
        │                                   │
        │  POST /api/v1/auth/send-otp       │ (Registration)
        │  POST /api/v1/auth/verify-otp     │ (Registration)
        │  POST /api/v1/auth/resend-otp     │ (Registration)
        │  POST /api/v1/auth/login          │ (Login) ⭐ NEW
        │  POST /api/v1/auth/verify-...     │ (Login) ⭐ NEW
        │  POST /api/v1/auth/resend-...     │ (Login) ⭐ NEW
        │                                   │
        └──────────────────┬─────────────────┘
                           │
        ┌──────────────────▼─────────────────┐
        │  OTP CONTROLLER                   │
        ├───────────────────────────────────┤
        │                                   │
        │  ├─ sendOTP()                     │
        │  ├─ verifyOTPCode()               │
        │  ├─ resendOTP()                   │
        │  ├─ login() ⭐ UPDATED            │
        │  ├─ verifyLoginOTP() ⭐ NEW       │
        │  └─ resendLoginOTP() ⭐ NEW       │
        │                                   │
        └──────────────────┬─────────────────┘
                           │
        ┌──────────────────▼─────────────────┐
        │  OTP UTILITIES                    │
        ├───────────────────────────────────┤
        │                                   │
        │  ├─ generateOTP()                 │
        │  ├─ sendOTPEmail()                │ (Nodemailer)
        │  ├─ verifyOTP()                   │
        │  └─ generateOTPExpiry()           │
        │                                   │
        └──────────────────┬─────────────────┘
                           │
        ┌──────────────────▼─────────────────┐
        │  DATABASE (MongoDB)               │
        ├───────────────────────────────────┤
        │                                   │
        │  Users Collection                 │
        │  ├─ email                         │
        │  ├─ password (hashed)             │
        │  ├─ otp (registration)            │
        │  ├─ otpExpiry (registration)      │
        │  ├─ loginOtp ⭐ NEW               │
        │  ├─ loginOtpExpiry ⭐ NEW         │
        │  ├─ isVerified                    │
        │  └─ createdAt                     │
        │                                   │
        └───────────────────────────────────┘
                           │
        ┌──────────────────▼─────────────────┐
        │  EMAIL SERVICE (Gmail SMTP)       │
        ├───────────────────────────────────┤
        │                                   │
        │  OTP Email Template               │
        │  "Your OTP: 123456"               │
        │  Valid for 5 minutes              │
        │                                   │
        └───────────────────────────────────┘
```

---

## 🔄 REGISTRATION FLOW DIAGRAM

```
USER
  │
  ├─→ Go to /otp-verification
  │
  ├─→ FORM STEP 1
  │   ├─ Enter: Full Name
  │   └─ Enter: Email
  │
  ├─→ CLICK: Send OTP
  │   │
  │   ├─→ Frontend sends POST /api/v1/auth/send-otp
  │   │   { email, fullName }
  │   │
  │   ├─→ Backend checks if user exists
  │   │
  │   ├─→ OTP generated (6 digits)
  │   │
  │   ├─→ OTP sent via Gmail SMTP
  │   │
  │   ├─→ User saved to DB with OTP
  │   │   { email, fullName, otp, otpExpiry, isVerified: false }
  │   │
  │   └─→ Response: "OTP sent to email"
  │
  ├─→ USER RECEIVES EMAIL
  │   ├─ Email Subject: "Your OTP for Music Website"
  │   ├─ Email Body: "Your OTP: 123456"
  │   └─ Valid for: 5 minutes
  │
  ├─→ FORM STEP 2
  │   ├─ Enter: OTP (6 digits)
  │   ├─ Enter: Password
  │   └─ Enter: Confirm Password
  │
  ├─→ CLICK: Verify & Register
  │   │
  │   ├─→ Frontend sends POST /api/v1/auth/verify-otp
  │   │   { email, otp, password }
  │   │
  │   ├─→ Backend verifies OTP
  │   │   ├─ Check OTP matches
  │   │   └─ Check not expired
  │   │
  │   ├─→ Backend hashes password (bcryptjs)
  │   │
  │   ├─→ User updated in DB
  │   │   { ..., password: hashed, isVerified: true, otp: null }
  │   │
  │   ├─→ JWT Token generated
  │   │
  │   └─→ Response: { token, user }
  │
  ├─→ Frontend saves token to localStorage
  │
  └─→ REDIRECT TO HOME PAGE ✅
```

---

## 🔄 LOGIN FLOW DIAGRAM (NEW)

```
USER (EXISTING ACCOUNT)
  │
  ├─→ Go to /login
  │
  ├─→ FORM STEP 1
  │   └─ Enter: Email
  │
  ├─→ CLICK: Send OTP
  │   │
  │   ├─→ Frontend sends POST /api/v1/auth/login
  │   │   { email }
  │   │
  │   ├─→ Backend checks if user exists
  │   │
  │   ├─→ Backend checks isVerified = true
  │   │
  │   ├─→ OTP generated (6 digits)
  │   │
  │   ├─→ OTP sent via Gmail SMTP
  │   │
  │   ├─→ User updated with loginOtp
  │   │   { ..., loginOtp: otp, loginOtpExpiry: Date }
  │   │
  │   └─→ Response: "OTP sent to email"
  │
  ├─→ USER RECEIVES EMAIL
  │   ├─ Email Subject: "Your OTP for Music Website Verification"
  │   ├─ Email Body: "Your OTP: 654321"
  │   └─ Valid for: 5 minutes
  │
  ├─→ FORM STEP 2
  │   ├─ Enter: OTP (6 digits)
  │   └─ Enter: Password
  │
  ├─→ CLICK: Login
  │   │
  │   ├─→ Frontend sends POST /api/v1/auth/verify-login-otp
  │   │   { email, otp, password }
  │   │
  │   ├─→ Backend verifies OTP
  │   │   ├─ Check OTP matches
  │   │   └─ Check not expired
  │   │
  │   ├─→ Backend verifies password (bcryptjs compare)
  │   │
  │   ├─→ JWT Token generated
  │   │
  │   ├─→ loginOtp cleared from DB
  │   │
  │   └─→ Response: { token, user }
  │
  ├─→ Frontend saves token to localStorage
  │
  └─→ REDIRECT TO HOME PAGE ✅
```

---

## 📱 UI WIREFRAME - REGISTRATION

```
┌─────────────────────────────────┐
│  STEP 1: Email & Name           │
├─────────────────────────────────┤
│                                 │
│  Music Platform                 │
│  Create your account            │
│                                 │
│  [✓] Full Name                  │
│  [John Doe_____________]        │
│                                 │
│  [✓] Email                      │
│  [john@example.com____]         │
│                                 │
│  [   Send OTP   ]               │
│                                 │
│  Already registered?            │
│  [Login]                        │
└─────────────────────────────────┘

        ↓ (OTP sent)

┌─────────────────────────────────┐
│  STEP 2: OTP & Password         │
├─────────────────────────────────┤
│                                 │
│  Music Platform                 │
│  Verify your email              │
│                                 │
│  OTP sent to: john@example.com  │
│                                 │
│  [✓] Enter OTP                  │
│  [1][2][3][4][5][6]             │
│                                 │
│  [✓] Password                   │
│  [••••••••••••••••••]           │
│                                 │
│  [✓] Confirm Password           │
│  [••••••••••••••••••]           │
│                                 │
│  [Back]    [Verify & Register]  │
│  [Resend OTP] (60s)             │
└─────────────────────────────────┘
```

---

## 📱 UI WIREFRAME - LOGIN (NEW)

```
┌─────────────────────────────────┐
│  STEP 1: Email                  │
├─────────────────────────────────┤
│                                 │
│  Music Platform                 │
│  Login to account               │
│                                 │
│  [✓] Email                      │
│  [john@example.com____]         │
│                                 │
│  [   Send OTP   ]               │
│                                 │
│  Don't have account?            │
│  [Register]                     │
└─────────────────────────────────┘

        ↓ (OTP sent)

┌─────────────────────────────────┐
│  STEP 2: OTP & Password         │
├─────────────────────────────────┤
│                                 │
│  Music Platform                 │
│  Verify your login              │
│                                 │
│  Verifying: john@example.com    │
│                                 │
│  [✓] Enter OTP                  │
│  [6][5][4][3][2][1]             │
│                                 │
│  [✓] Password                   │
│  [••••••••••••••••••]           │
│                                 │
│  [Back]          [Login]        │
│  [Resend OTP] (60s)             │
└─────────────────────────────────┘
```

---

## 🔐 OTP LIFECYCLE

```
TIME    EVENT                          STATE
─────────────────────────────────────────────────────────
T+0     User requests OTP              OTP Generated
        └─ 6-digit code created       loginOtp = "123456"
        └─ Email sent                 loginOtpExpiry = T+5min
        └─ Stored in DB

T+1sec  User receives email            Valid (4:59 remaining)
        └─ Check inbox                Can verify anytime

T+2min  User enters OTP                Valid (2:58 remaining)
        └─ Click "Login"              OTP verification

T+3min  User enters password           Valid (1:57 remaining)
        └─ Click "Login"              Password verification

T+4min  LOGIN SUCCESS ✅               OTP Cleared
        └─ JWT token generated        loginOtp = null
        └─ User logged in             loginOtpExpiry = null

T+5min  (if not used)                  OTP EXPIRED ❌
        └─ Cannot verify              User must resend
        └─ User gets error

T+6min  User requests resend           NEW OTP Generated
        └─ New OTP sent               loginOtp = "654321"
        └─ Process repeats            loginOtpExpiry = T+11min
```

---

## 🔒 SECURITY LAYERS

```
LAYER 1: Email Verification
├─ OTP sent only to registered email
├─ Prevents unauthorized access
└─ User must own the email

LAYER 2: OTP Validation
├─ 6-digit code (1 in 1,000,000 chance)
├─ Time-limited (5 minutes)
├─ One-time use only
└─ Cannot be reused

LAYER 3: Password Verification
├─ Required after OTP verification
├─ Bcryptjs hashing (salt 10)
├─ Constant-time comparison
└─ Prevents weak OTP compensation

LAYER 4: Session Management
├─ JWT token generated
├─ Token stored in localStorage
├─ Token expires in 7 days
└─ Can be invalidated on logout

LAYER 5: Rate Limiting
├─ Resend cooldown (60 seconds)
├─ Prevents OTP spam
├─ Protects email service
└─ Reduces brute force risk
```

---

## 📊 DATABASE SCHEMA - BEFORE & AFTER

### BEFORE
```
User {
  _id: ObjectId
  fullName: String
  email: String (unique)
  password: String (hashed)
  playLists: Array
  otp: String (registration)
  otpExpiry: Date (registration)
  isVerified: Boolean
  createdAt: Date
}
```

### AFTER (NEW)
```
User {
  _id: ObjectId
  fullName: String
  email: String (unique)
  password: String (hashed)
  playLists: Array
  
  // Registration OTP (unchanged)
  otp: String (registration)
  otpExpiry: Date (registration)
  
  // Login OTP (NEW ⭐)
  loginOtp: String
  loginOtpExpiry: Date
  
  isVerified: Boolean
  createdAt: Date
}
```

---

## 🔄 STATE TRANSITIONS

```
NEW USER REGISTRATION
─────────────────────
    Created
       ↓
    OTP Sent
       ↓
    OTP Verified ✅
       ↓
    isVerified = true
       ↓
    Can Login


EXISTING USER LOGIN
───────────────────
    Login Request
       ↓
    OTP Sent
       ↓
    OTP Verified ✅
       ↓
    Password Verified ✅
       ↓
    JWT Token Generated
       ↓
    Logged In ✅
```

---

## 📈 ERROR FLOW

```
USER ACTION                     ERROR CHECK               RESPONSE
─────────────────────────────────────────────────────────────────

1. Send OTP
   └─ Email empty?          ❌ Email required
   └─ User not exist?       ❌ User not found
   └─ User not verified?    ❌ Not verified yet
   └─ Email send fail?      ❌ Email config error
   └─ SUCCESS               ✅ OTP sent

2. Verify OTP (Registration)
   └─ Email empty?          ❌ Email required
   └─ OTP empty?            ❌ OTP required
   └─ Password empty?       ❌ Password required
   └─ OTP mismatch?         ❌ Invalid OTP
   └─ OTP expired?          ❌ OTP expired
   └─ SUCCESS               ✅ Account created

3. Verify OTP (Login)
   └─ Email empty?          ❌ Email required
   └─ OTP empty?            ❌ OTP required
   └─ Password empty?       ❌ Password required
   └─ User not exist?       ❌ User not found
   └─ Not verified?         ❌ Not verified
   └─ OTP mismatch?         ❌ Invalid OTP
   └─ OTP expired?          ❌ OTP expired
   └─ Password wrong?       ❌ Invalid password
   └─ SUCCESS               ✅ Logged in
```

---

**Created**: November 17, 2025  
**Version**: 2.0  
**Status**: ✅ Production Ready

🎵 Enterprise-Grade OTP System 🎵
