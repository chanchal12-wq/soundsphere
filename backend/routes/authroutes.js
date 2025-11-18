
import express from "express";
import { login, register } from '../controllers/authcontroller.js';
import { sendOTP, verifyOTPCode, resendOTP } from '../controllers/otpcontroller.js';

const router = express.Router();

// Registration OTP routes
router.post("/send-otp", sendOTP); // Send OTP to email for registration
router.post("/verify-otp", verifyOTPCode); // Verify OTP and register user
router.post("/resend-otp", resendOTP); // Resend registration OTP

// Login route (email/password only)
router.post("/login", login); // Login with email and password

// Legacy routes (kept for compatibility)
router.post("/register", register); //register route (deprecated - use send-otp instead)

export default router;





