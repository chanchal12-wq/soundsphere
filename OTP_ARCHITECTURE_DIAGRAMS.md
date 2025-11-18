# OTP Feature - System Architecture & Flow Diagrams

## 1. Registration Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     USER REGISTRATION FLOW                       │
└─────────────────────────────────────────────────────────────────┘

User Browser                           Backend Server              Email Service
     │                                     │                            │
     │──────── STEP 1 ─────────────────────│                            │
     │  1. Visit /otp-verification         │                            │
     │  2. Enter name & email              │                            │
     │  3. Click "Send OTP"                │                            │
     │                                     │                            │
     │──POST /send-otp ─────────────────>  │                            │
     │  {email, fullName}                  │                            │
     │                                     │– Generate OTP              │
     │                                     │– Hash with speakeasy       │
     │                                     │– Save to DB (5 min TTL)    │
     │                                     │                            │
     │                                     │──Send Email──────────────> │
     │                                     │  (with OTP code)           │
     │                                     │                            │
     │  <─ {status: success} ──────────────│                            │
     │  "OTP Sent!"                        │                            │
     │                                     │                            │
     │ [User checks email inbox]           │                            │
     │                                     │                            │
     │──────── STEP 2 ─────────────────────│                            │
     │  1. Receive OTP in email            │                            │
     │  2. Enter OTP code                  │                            │
     │  3. Enter password                  │                            │
     │  4. Confirm password                │                            │
     │  5. Click "Verify & Register"       │                            │
     │                                     │                            │
     │──POST /verify-otp ──────────────>   │                            │
     │  {email, otp, password}             │                            │
     │                                     │– Validate OTP              │
     │                                     │– Check expiry              │
     │                                     │– Hash password             │
     │                                     │– Update user               │
     │                                     │– Mark verified             │
     │                                     │                            │
     │  <─ {token, user} ──────────────────│                            │
     │  JWT Token + User info              │                            │
     │  (Auto Login!)                      │                            │
     │                                     │                            │
     │ Save token to localStorage          │                            │
     │ Redirect to /home                   │                            │
     │                                     │                            │
     └─────────────────────────────────────────────────────────────────┘
```

## 2. Login Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                       USER LOGIN FLOW                            │
└─────────────────────────────────────────────────────────────────┘

User Browser                    Backend Server
     │                              │
     │  1. Visit /login             │
     │  2. Enter email              │
     │  3. Enter password           │
     │  4. Click "Login"            │
     │                              │
     │──POST /login ───────────────>│
     │  {email, password}           │
     │                              │
     │                    Check if user exists
     │                    │
     │                    ├─ NOT FOUND?
     │                    │  └─ Return "User not found"
     │                    │
     │                    ├─ NOT VERIFIED?
     │                    │  └─ Return "Verify email first"
     │                    │
     │                    └─ Compare password hash
     │                       │
     │                       ├─ MISMATCH?
     │                       │  └─ Return "Invalid credentials"
     │                       │
     │                       └─ MATCH!
     │                          └─ Generate JWT token
     │                             └─ Return token
     │                              │
     │  <─ {token, message} ────────│
     │  Success! Token received     │
     │                              │
     │ Save token to localStorage   │
     │ Set Auth header for API      │
     │ Redirect to /home            │
     │                              │
     └─────────────────────────────────────────────────────────────┘
```

## 3. OTP Resend Flow

```
┌──────────────────────────────────────────────────────────────┐
│                  OTP RESEND FLOW                             │
└──────────────────────────────────────────────────────────────┘

User Browser                  Backend Server        Email Service
     │                             │                     │
     │ During verification step:   │                     │
     │ - Click "Resend OTP"        │                     │
     │ - Button disabled for 60s   │                     │
     │                             │                     │
     │──POST /resend-otp ────────> │                     │
     │  {email}                    │                     │
     │                             │                     │
     │                    Generate new OTP                │
     │                    Delete old OTP                  │
     │                    Save new OTP (5 min)            │
     │                             │                     │
     │                             │──Send Email ───────>│
     │                             │  (new OTP)          │
     │                             │                     │
     │  <─ {status: success} ──────│                     │
     │  "OTP Resent!"              │                     │
     │                             │                     │
     │ Restart 60s cooldown        │                     │
     │ Check email for new OTP     │                     │
     │                             │                     │
     └──────────────────────────────────────────────────────────┘

Note: Resend button shows countdown "Resend (60s)" then becomes active
```

## 4. Database Schema

```
┌─────────────────────────────────────────────────────────────┐
│                    USERS COLLECTION                         │
├─────────────────────────────────────────────────────────────┤
│ {                                                           │
│   _id: ObjectId,                                            │
│   fullName: String,              ← User's full name        │
│   email: String (unique),        ← Email address           │
│   password: String,              ← Hashed password         │
│   otp: String or null,           ← Current OTP (null=sent) │
│   otpExpiry: Date or null,       ← OTP valid until time    │
│   isVerified: Boolean,           ← Email verification flag │
│   playLists: [                   ← User's playlists        │
│     {                                                      │
│       listName: String,                                    │
│       state: Boolean,                                      │
│       songs: [ObjectId]                                    │
│     }                                                      │
│   ],                                                       │
│   createdAt: Date                ← Account creation time   │
│ }                                                           │
└─────────────────────────────────────────────────────────────┘

IMPORTANT FIELDS:
• otp: Contains 6-digit code while waiting for verification
       Set to null after successful verification
       
• otpExpiry: Timestamp of when OTP expires (5 minutes from generation)
             Used to validate OTP hasn't expired
             
• isVerified: false - User just requested OTP, not yet registered
              true - User verified email and completed registration
              Only verified users can login
```

## 5. Authentication State Management

```
┌──────────────────────────────────────────────────────────┐
│         USER STATE LIFECYCLE                             │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  NEW USER                                               │
│    │                                                    │
│    ├─ Registers via /otp-verification                  │
│    │  - OTP generated, sent to email                   │
│    │  - User saved with isVerified=false               │
│    │  ├─ otp: "123456"                                 │
│    │  └─ otpExpiry: 2025-11-17 10:05:00               │
│    │                                                    │
│    ├─ Enters OTP during verification                   │
│    │  - If valid & not expired:                        │
│    │    ├─ Password hashed & saved                     │
│    │    ├─ isVerified set to true                      │
│    │    ├─ otp cleared (set to null)                   │
│    │    ├─ JWT token generated                         │
│    │    └─ User auto-logged in                         │
│    │                                                    │
│    └─ REGISTERED & VERIFIED                            │
│       ├─ Can login with email + password               │
│       ├─ Token stored in localStorage                  │
│       ├─ Can access all app features                   │
│       └─ Token sent in API request headers             │
│                                                          │
│  EXISTING USER                                          │
│    │                                                    │
│    ├─ Visits /login                                    │
│    ├─ Enters credentials                               │
│    ├─ Backend validates:                               │
│    │  ├─ User exists                                   │
│    │  ├─ isVerified == true                            │
│    │  └─ Password matches                              │
│    ├─ JWT token generated                              │
│    └─ User logged in, token saved                      │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

## 6. Email Template

```
┌─────────────────────────────────────────────────────┐
│          EMAIL SENT TO USER                         │
├─────────────────────────────────────────────────────┤
│                                                     │
│  From: your_email@gmail.com                        │
│  To: user@example.com                              │
│  Subject: Your OTP for Music Website Verification  │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ Email Verification                          │   │
│  │                                             │   │
│  │ Hello John Doe,                             │   │
│  │                                             │   │
│  │ Your One-Time Password (OTP) for email      │   │
│  │ verification is:                            │   │
│  │                                             │   │
│  │         ┌───────────────┐                   │   │
│  │         │  1  2  3  4  5  6  │            │   │
│  │         │               │                   │   │
│  │         │ (Formatted)   │                   │   │
│  │         └───────────────┘                   │   │
│  │                                             │   │
│  │ This OTP is valid for 5 minutes.            │   │
│  │                                             │   │
│  │ If you didn't request this code, please     │   │
│  │ ignore this email.                          │   │
│  │                                             │   │
│  │ ─────────────────────────────────────────── │   │
│  │ Please don't share this OTP with anyone.    │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

## 7. API Endpoints Summary

```
┌─────────────────────────────────────────────────────────────────┐
│                    API ENDPOINTS                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. POST /api/v1/auth/send-otp                                 │
│     Request:  {email, fullName}                                │
│     Response: {message, status, email}                         │
│     Purpose:  Send OTP to user's email                         │
│                                                                 │
│  2. POST /api/v1/auth/verify-otp                               │
│     Request:  {email, otp, password}                           │
│     Response: {message, status, token, user}                   │
│     Purpose:  Verify OTP and create user account               │
│                                                                 │
│  3. POST /api/v1/auth/resend-otp                               │
│     Request:  {email}                                          │
│     Response: {message, status, email}                         │
│     Purpose:  Generate and send new OTP                        │
│                                                                 │
│  4. POST /api/v1/auth/login                                    │
│     Request:  {email, password}                                │
│     Response: {message, status, token}                         │
│     Purpose:  Login with verified account                      │
│                                                                 │
│  5. All other protected endpoints                              │
│     Header:   Authorization: Bearer {token}                    │
│     Purpose:  JWT validation for access                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 8. Error Handling Flow

```
┌──────────────────────────────────────────────────────┐
│              ERROR HANDLING                          │
├──────────────────────────────────────────────────────┤
│                                                      │
│ SEND OTP ERRORS:                                    │
│ ├─ Email already verified → "User already exists"   │
│ ├─ Invalid email format → "Invalid email"           │
│ ├─ Email service down → "Failed to send OTP"        │
│                                                      │
│ VERIFY OTP ERRORS:                                  │
│ ├─ Wrong OTP → "Invalid OTP"                        │
│ ├─ OTP expired → "OTP expired (5+ min old)"         │
│ ├─ Missing OTP → "Invalid or expired OTP"           │
│ ├─ Password too weak → "Password must be 6+ chars"  │
│ ├─ Passwords don't match → "Passwords don't match"  │
│                                                      │
│ LOGIN ERRORS:                                       │
│ ├─ User not found → "User does not exist"           │
│ ├─ Email not verified → "Verify email first"        │
│ ├─ Wrong password → "Invalid credentials"           │
│                                                      │
│ SERVER ERRORS:                                      │
│ ├─ DB connection → "Server error"                   │
│ ├─ Email service → "Failed to send OTP"             │
│ ├─ JWT generation → "Server error"                  │
│                                                      │
└──────────────────────────────────────────────────────┘
```

## 9. Technology Stack

```
┌─────────────────────────────────────────────────────────┐
│                  TECHNOLOGY STACK                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  BACKEND:                                               │
│  ├─ Express.js - API Server                            │
│  ├─ MongoDB - Database                                 │
│  ├─ Mongoose - ODM                                     │
│  ├─ Nodemailer - Email Sending                         │
│  ├─ Speakeasy - OTP Generation                         │
│  ├─ bcryptjs - Password Hashing                        │
│  └─ JWT - Token Authentication                         │
│                                                         │
│  FRONTEND:                                              │
│  ├─ React - UI Library                                 │
│  ├─ React Router - Routing                             │
│  ├─ Axios - HTTP Client                                │
│  ├─ Tailwind CSS - Styling                             │
│  └─ React Icons - Icons                                │
│                                                         │
│  EMAIL:                                                 │
│  ├─ Gmail SMTP - Mail Server                           │
│  └─ App Passwords - Authentication                     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

**Generated**: November 17, 2025
**Version**: 1.0 OTP System
