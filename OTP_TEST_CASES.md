# OTP Feature - Test Cases & Scenarios

## Overview
This document contains comprehensive test cases for the OTP authentication system.

---

## 1. OTP Generation & Email Sending Tests

### TC1.1: Valid OTP Send Request
**Objective**: Verify OTP is generated and sent for valid email and name
**Steps**:
1. Navigate to `/otp-verification`
2. Enter Full Name: "John Doe"
3. Enter Email: "test@example.com"
4. Click "Send OTP"

**Expected Results**:
- ✅ Success message appears: "OTP sent to your email!"
- ✅ UI moves to Step 2
- ✅ Email received with 6-digit OTP
- ✅ OTP is valid for 5 minutes

**Status**: ✅ Pass / ❌ Fail

---

### TC1.2: Missing Email Field
**Objective**: Verify error when email is not provided
**Steps**:
1. Navigate to `/otp-verification`
2. Enter Full Name: "John Doe"
3. Leave Email empty
4. Click "Send OTP"

**Expected Results**:
- ✅ Error message: "Please enter all fields"
- ✅ No email sent
- ✅ UI remains on Step 1

**Status**: ✅ Pass / ❌ Fail

---

### TC1.3: Missing Full Name Field
**Objective**: Verify error when full name is not provided
**Steps**:
1. Navigate to `/otp-verification`
2. Leave Full Name empty
3. Enter Email: "test@example.com"
4. Click "Send OTP"

**Expected Results**:
- ✅ Error message: "Please enter all fields"
- ✅ No email sent
- ✅ UI remains on Step 1

**Status**: ✅ Pass / ❌ Fail

---

### TC1.4: Invalid Email Format
**Objective**: Verify validation of email format
**Steps**:
1. Navigate to `/otp-verification`
2. Enter Full Name: "John Doe"
3. Enter Email: "invalid-email"
4. Try to send OTP

**Expected Results**:
- ✅ Either browser validation prevents submission
- ✅ Or server returns error about invalid email
- ✅ No email sent

**Status**: ✅ Pass / ❌ Fail

---

### TC1.5: Already Verified User
**Objective**: Verify error when trying to register verified user
**Steps**:
1. Register and verify a user with "existing@example.com"
2. Go to `/otp-verification`
3. Enter same email
4. Click "Send OTP"

**Expected Results**:
- ✅ Error message: "User already registered and verified"
- ✅ No new OTP sent

**Status**: ✅ Pass / ❌ Fail

---

## 2. OTP Verification & Registration Tests

### TC2.1: Valid OTP Verification
**Objective**: Verify successful registration with valid OTP
**Steps**:
1. Send OTP to "test@example.com"
2. Receive 6-digit OTP in email
3. Enter OTP: "123456" (actual OTP)
4. Enter Password: "SecurePass123"
5. Confirm Password: "SecurePass123"
6. Click "Verify & Register"

**Expected Results**:
- ✅ Success message: "Registration successful! Redirecting..."
- ✅ User created in database with isVerified=true
- ✅ JWT token saved in localStorage
- ✅ User auto-logged in
- ✅ Redirected to `/home`

**Status**: ✅ Pass / ❌ Fail

---

### TC2.2: Wrong OTP
**Objective**: Verify error with incorrect OTP
**Steps**:
1. Send OTP to "test@example.com"
2. Receive OTP in email
3. Enter wrong OTP: "000000"
4. Enter Password: "SecurePass123"
5. Confirm Password: "SecurePass123"
6. Click "Verify & Register"

**Expected Results**:
- ✅ Error message: "Invalid or expired OTP"
- ✅ User not created
- ✅ UI remains on Step 2

**Status**: ✅ Pass / ❌ Fail

---

### TC2.3: Expired OTP (5+ minutes old)
**Objective**: Verify error when OTP is expired
**Steps**:
1. Send OTP to "test@example.com"
2. Wait more than 5 minutes
3. Enter OTP (even if correct)
4. Click "Verify & Register"

**Expected Results**:
- ✅ Error message: "Invalid or expired OTP"
- ✅ User not created
- ✅ UI remains on Step 2

**Status**: ✅ Pass / ❌ Fail

---

### TC2.4: Password Mismatch
**Objective**: Verify error when passwords don't match
**Steps**:
1. Send OTP and receive it
2. Enter valid OTP
3. Enter Password: "SecurePass123"
4. Enter Confirm Password: "DifferentPass123"
5. Click "Verify & Register"

**Expected Results**:
- ✅ Error message: "Passwords do not match"
- ✅ User not created
- ✅ UI remains on Step 2

**Status**: ✅ Pass / ❌ Fail

---

### TC2.5: Password Too Short
**Objective**: Verify error when password is less than 6 characters
**Steps**:
1. Send OTP and receive it
2. Enter valid OTP
3. Enter Password: "Pass1"
4. Enter Confirm Password: "Pass1"
5. Click "Verify & Register"

**Expected Results**:
- ✅ Error message: "Password must be at least 6 characters"
- ✅ User not created

**Status**: ✅ Pass / ❌ Fail

---

### TC2.6: Missing OTP Field
**Objective**: Verify error when OTP is not entered
**Steps**:
1. On Step 2
2. Leave OTP empty
3. Enter Password & Confirm Password
4. Click "Verify & Register"

**Expected Results**:
- ✅ Error message: "Please fill all fields"
- ✅ User not created

**Status**: ✅ Pass / ❌ Fail

---

## 3. Resend OTP Tests

### TC3.1: Resend OTP Success
**Objective**: Verify OTP can be resent successfully
**Steps**:
1. Send OTP to "test@example.com"
2. Go to Step 2
3. Click "Resend OTP" button
4. Receive new OTP in email

**Expected Results**:
- ✅ Success message: "OTP resent to your email!"
- ✅ New OTP sent to email
- ✅ Previous OTP invalidated
- ✅ Button disabled for 60 seconds

**Status**: ✅ Pass / ❌ Fail

---

### TC3.2: Resend Cooldown Timer
**Objective**: Verify 60-second cooldown after resend
**Steps**:
1. Send OTP
2. Go to Step 2
3. Click "Resend OTP"
4. Observe countdown

**Expected Results**:
- ✅ Button shows "Resend (60s)" and counts down
- ✅ Button is disabled for 60 seconds
- ✅ After 60s, button becomes active again
- ✅ Button text changes to "Resend OTP"

**Status**: ✅ Pass / ❌ Fail

---

### TC3.3: Old OTP Invalid After Resend
**Objective**: Verify old OTP doesn't work after resend
**Steps**:
1. Send OTP to "test@example.com"
2. Note the OTP received
3. Click "Resend OTP"
4. Receive new OTP
5. Try to verify with old OTP

**Expected Results**:
- ✅ Error message: "Invalid or expired OTP"
- ✅ Registration fails
- ✅ New OTP works instead

**Status**: ✅ Pass / ❌ Fail

---

## 4. Login Tests

### TC4.1: Successful Login
**Objective**: Verify verified user can login
**Steps**:
1. Complete registration with "user@example.com" and password "Pass123"
2. Go to `/login`
3. Enter Email: "user@example.com"
4. Enter Password: "Pass123"
5. Click "Login"

**Expected Results**:
- ✅ Success message: "Login Successful"
- ✅ JWT token saved in localStorage
- ✅ User redirected to `/home`
- ✅ Can access protected pages

**Status**: ✅ Pass / ❌ Fail

---

### TC4.2: Unverified User Cannot Login
**Objective**: Verify unverified user cannot login
**Steps**:
1. Have a user record with isVerified=false
2. Try to login with that email and password

**Expected Results**:
- ✅ Error message: "Please verify your email first"
- ✅ User not logged in
- ✅ No token generated

**Status**: ✅ Pass / ❌ Fail

---

### TC4.3: Wrong Password
**Objective**: Verify login fails with wrong password
**Steps**:
1. Go to `/login`
2. Enter Email: "user@example.com" (existing verified user)
3. Enter Password: "WrongPassword"
4. Click "Login"

**Expected Results**:
- ✅ Error message: "Invalid credentials"
- ✅ User not logged in

**Status**: ✅ Pass / ❌ Fail

---

### TC4.4: Non-existent User
**Objective**: Verify login fails for non-existent user
**Steps**:
1. Go to `/login`
2. Enter Email: "nonexistent@example.com"
3. Enter Password: "SomePassword"
4. Click "Login"

**Expected Results**:
- ✅ Error message: "User does not exist"
- ✅ User not logged in

**Status**: ✅ Pass / ❌ Fail

---

### TC4.5: Missing Email Field
**Objective**: Verify validation when email is missing
**Steps**:
1. Go to `/login`
2. Leave Email empty
3. Enter Password: "SomePassword"
4. Click "Login"

**Expected Results**:
- ✅ Error message or validation error
- ✅ Login not attempted

**Status**: ✅ Pass / ❌ Fail

---

### TC4.6: Missing Password Field
**Objective**: Verify validation when password is missing
**Steps**:
1. Go to `/login`
2. Enter Email: "user@example.com"
3. Leave Password empty
4. Click "Login"

**Expected Results**:
- ✅ Error message or validation error
- ✅ Login not attempted

**Status**: ✅ Pass / ❌ Fail

---

## 5. Navigation & UI Tests

### TC5.1: Navigation to OTP Page
**Objective**: Verify link navigation to OTP verification
**Steps**:
1. Go to `/login`
2. Click "Register" link

**Expected Results**:
- ✅ Navigated to `/otp-verification`
- ✅ Page loads successfully

**Status**: ✅ Pass / ❌ Fail

---

### TC5.2: Back Button on OTP Page
**Objective**: Verify back button returns to Step 1
**Steps**:
1. Go to `/otp-verification`
2. Send OTP (move to Step 2)
3. Click "Back" button

**Expected Results**:
- ✅ Return to Step 1
- ✅ Form fields cleared
- ✅ Errors cleared

**Status**: ✅ Pass / ❌ Fail

---

### TC5.3: Loading States
**Objective**: Verify UI shows loading state during processing
**Steps**:
1. Go to `/otp-verification`
2. Click "Send OTP" and observe button

**Expected Results**:
- ✅ Button text changes to "Sending OTP..."
- ✅ Button is disabled
- ✅ Button text reverts after completion

**Status**: ✅ Pass / ❌ Fail

---

### TC5.4: Error Message Display
**Objective**: Verify error messages display correctly
**Steps**:
1. Try invalid action (e.g., send OTP without email)
2. Observe error display

**Expected Results**:
- ✅ Red error alert appears
- ✅ Error message is clear
- ✅ Error clears on next action

**Status**: ✅ Pass / ❌ Fail

---

## 6. Database Tests

### TC6.1: User Created with Correct Fields
**Objective**: Verify user document structure in database
**Steps**:
1. Complete registration
2. Query MongoDB: `db.users.findOne({email: "test@example.com"})`

**Expected Results**:
- ✅ User document exists
- ✅ fullName field present
- ✅ email field present
- ✅ password field contains hash (not plain text)
- ✅ isVerified = true
- ✅ otp = null
- ✅ otpExpiry = null
- ✅ createdAt timestamp present

**Status**: ✅ Pass / ❌ Fail

---

### TC6.2: OTP Stored During Registration
**Objective**: Verify OTP is temporarily stored in database
**Steps**:
1. Send OTP to "test@example.com"
2. Immediately query: `db.users.findOne({email: "test@example.com"})`

**Expected Results**:
- ✅ otp field contains 6-digit code
- ✅ otpExpiry contains future timestamp
- ✅ isVerified = false

**Status**: ✅ Pass / ❌ Fail

---

### TC6.3: OTP Cleared After Verification
**Objective**: Verify OTP is cleared after successful verification
**Steps**:
1. Send OTP and verify successfully
2. Query: `db.users.findOne({email: "test@example.com"})`

**Expected Results**:
- ✅ otp = null
- ✅ otpExpiry = null
- ✅ isVerified = true

**Status**: ✅ Pass / ❌ Fail

---

## 7. Security Tests

### TC7.1: Password Hashing
**Objective**: Verify passwords are hashed, not stored in plain text
**Steps**:
1. Register user with password "TestPass123"
2. Query database

**Expected Results**:
- ✅ Password field contains hash
- ✅ Hash doesn't contain "TestPass123"
- ✅ Hash starts with "$2a$" or "$2b$" (bcryptjs format)

**Status**: ✅ Pass / ❌ Fail

---

### TC7.2: OTP Not in Plain Text
**Objective**: Verify OTP stored securely (if hashed)
**Steps**:
1. Send OTP
2. Check database
3. Check email

**Expected Results**:
- ✅ Email contains readable OTP
- ✅ Database may store securely (depending on implementation)

**Status**: ✅ Pass / ❌ Fail

---

### TC7.3: JWT Token in localStorage
**Objective**: Verify JWT token is stored correctly
**Steps**:
1. Login successfully
2. Open browser DevTools → Application → localStorage

**Expected Results**:
- ✅ "access_token" or "token" key present
- ✅ Contains JWT format (3 parts separated by dots)
- ✅ Token not empty

**Status**: ✅ Pass / ❌ Fail

---

## 8. Integration Tests

### TC8.1: Complete User Journey
**Objective**: Verify entire user flow from registration to accessing app
**Steps**:
1. Navigate to `/otp-verification`
2. Register with name and email
3. Receive OTP
4. Verify OTP and create account
5. Auto-logged in
6. Access protected pages (songs, playlists)
7. Logout
8. Login again

**Expected Results**:
- ✅ All steps successful
- ✅ Can access protected resources after login
- ✅ Cannot access protected resources after logout

**Status**: ✅ Pass / ❌ Fail

---

### TC8.2: Multiple Simultaneous OTPs
**Objective**: Verify different users can have OTPs simultaneously
**Steps**:
1. Send OTP to "user1@example.com"
2. Send OTP to "user2@example.com"
3. Verify both users receive different OTPs
4. Verify with user1's OTP
5. Try to verify user2 with user1's OTP

**Expected Results**:
- ✅ Both users receive different OTPs
- ✅ User1 verification succeeds
- ✅ User2 cannot verify with user1's OTP

**Status**: ✅ Pass / ❌ Fail

---

## 9. Email Delivery Tests

### TC9.1: Email Delivery Time
**Objective**: Verify OTP email arrives within reasonable time
**Steps**:
1. Send OTP
2. Check email arrival time

**Expected Results**:
- ✅ Email arrives within 1-2 minutes
- ✅ Contains correct 6-digit OTP
- ✅ Contains user's name
- ✅ Contains validity duration (5 minutes)

**Status**: ✅ Pass / ❌ Fail

---

### TC9.2: Email Content Verification
**Objective**: Verify email contains correct information
**Steps**:
1. Send OTP to "test@example.com"
2. Check email content

**Expected Results**:
- ✅ Subject contains "OTP" and "Verification"
- ✅ Body contains 6-digit OTP
- ✅ Body contains greeting with name
- ✅ Body mentions 5-minute validity
- ✅ Formatted nicely

**Status**: ✅ Pass / ❌ Fail

---

## 10. Performance Tests

### TC10.1: Response Time - Send OTP
**Objective**: Verify acceptable response time for sending OTP
**Steps**:
1. Note time
2. Click "Send OTP"
3. Note time when success message appears

**Expected Results**:
- ✅ Response time < 5 seconds
- ✅ Typically 1-3 seconds

**Status**: ✅ Pass / ❌ Fail

---

### TC10.2: Response Time - Verify OTP
**Objective**: Verify acceptable response time for verification
**Steps**:
1. Note time
2. Click "Verify & Register"
3. Note time when success message appears

**Expected Results**:
- ✅ Response time < 3 seconds
- ✅ Typically 1-2 seconds

**Status**: ✅ Pass / ❌ Fail

---

## 11. Error Recovery Tests

### TC11.1: Recover from Invalid OTP
**Objective**: Verify user can recover after entering wrong OTP
**Steps**:
1. Send OTP
2. Enter wrong OTP
3. Get error message
4. Click "Resend OTP"
5. Enter new OTP correctly

**Expected Results**:
- ✅ Can resend OTP
- ✅ New OTP works
- ✅ Registration completes

**Status**: ✅ Pass / ❌ Fail

---

### TC11.2: Recover from Expired OTP
**Objective**: Verify user can recover from expired OTP
**Steps**:
1. Send OTP
2. Wait 5+ minutes
3. Try to verify (fails with expired message)
4. Click "Resend OTP"
5. Enter new OTP

**Expected Results**:
- ✅ Can resend OTP
- ✅ New OTP works
- ✅ Registration completes

**Status**: ✅ Pass / ❌ Fail

---

## Test Summary

| Category | Total Tests | Passed | Failed | Status |
|----------|-------------|--------|--------|--------|
| OTP Generation | 5 | __ | __ | ○ |
| OTP Verification | 6 | __ | __ | ○ |
| Resend OTP | 3 | __ | __ | ○ |
| Login | 6 | __ | __ | ○ |
| Navigation & UI | 4 | __ | __ | ○ |
| Database | 3 | __ | __ | ○ |
| Security | 3 | __ | __ | ○ |
| Integration | 2 | __ | __ | ○ |
| Email Delivery | 2 | __ | __ | ○ |
| Performance | 2 | __ | __ | ○ |
| Error Recovery | 2 | __ | __ | ○ |
| **TOTAL** | **40** | **__** | **__** | **○** |

---

**Test Report**: _______________
**Tester Name**: ________________
**Date**: ______________________
**Notes**: _____________________

---

**Generated**: November 17, 2025
**Version**: 1.0
