import express from "express";
import {login, register} from '../controllers/authcontroller.js'


import {sendLoginOTP , verifyOTPCode, resendOTP, verifyLoginOTP, resendLoginOTP } from '../controllers/otpcontroller.js'
const router = express.Router();

// Registration OTP routes
router.post("/send-otp", sendOTP); // Send OTP to email for registration
router.post("/verify-otp", verifyOTPCode); // Verify OTP and register user
router.post("/resend-otp", resendOTP); // Resend registration OTP

// Login OTP routes (NEW)
router.post("/login", sendLoginOTP); // Send OTP for login
router.post("/verify-login-otp", verifyLoginOTP); // Verify OTP and complete login
router.post("/resend-login-otp", resendLoginOTP); // Resend login OTP

// Legacy routes (kept for compatibility)
router.post("/register", register); //register route (deprecated - use send-otp instead)

export default router;



