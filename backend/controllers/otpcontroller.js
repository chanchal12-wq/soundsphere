import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import conn from "../config/db.js";
import User from "../models/userschema.js";
import { generateOTP, sendOTPEmail, verifyOTP, generateOTPExpiry } from "../utils/otpUtil.js";

// @desc    Send OTP to user email
// @route   POST /api/v1/auth/send-otp
// @access  Public
export const sendOTP = async (req, res) => {
  try {
    const { email, fullName } = req.body;

    if (!email || !fullName) {
      return res.status(400).json({
        message: 'Email and full name are required',
        status: 'error',
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({
        message: 'User already registered and verified',
        status: 'error',
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = generateOTPExpiry();

    try {
      // Send OTP via email
      await sendOTPEmail(email, otp, fullName);

      // Save OTP to database (update or create)
      if (existingUser) {
        existingUser.otp = otp;
        existingUser.otpExpiry = otpExpiry;
        await existingUser.save();
      } else {
        const newUser = new User({
          fullName,
          email,
          otp,
          otpExpiry,
          isVerified: false,
          password: '', // Will be set during verification
        });
        await newUser.save();
      }

      res.status(200).json({
        message: 'OTP sent to your email',
        status: 'success',
        email: email,
      });
    } catch (emailError) {
      return res.status(500).json({
        message: 'Failed to send OTP. Please check your email configuration.',
        status: 'error',
      });
    }
  } catch (err) {
    console.error('Error in sendOTP:', err);
    res.status(500).json({
      message: err.message || 'Server error',
      status: 'error',
    });
  }
};

// @desc    Verify OTP and complete registration
// @route   POST /api/v1/auth/verify-otp
// @access  Public
export const verifyOTPCode = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    if (!email || !otp || !password) {
      return res.status(400).json({
        message: 'Email, OTP, and password are required',
        status: 'error',
      });
      exports.sendSignupOTP = async (req, res) => {
  const { email, password } = req.body;

  const otp = generateOTP();
  const expiry = Date.now() + 5 * 60 * 1000;

  await TempUser.updateOne(
    { email },
    { email, password: await bcrypt.hash(password, 10), otp, otpExpiry: expiry },
    { upsert: true }
  );

  await sendOTP(email, otp);
  res.json({ message: "OTP sent to email" });
};

    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: 'User not found',
        status: 'error',
      });
    }

    // Check if already verified
    if (user.isVerified) {
      return res.status(400).json({
        message: 'User already verified',
        status: 'error',
      });
    }

    // Verify OTP
    if (!verifyOTP(user.otp, otp, user.otpExpiry)) {
      return res.status(400).json({
        message: 'Invalid or expired OTP',
        status: 'error',
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update user
    user.password = hashedPassword;
    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    user.playLists = [];
    await user.save();

    // Generate JWT token
    const token = generateToken(user._id);

    res.status(200).json({
      message: 'Email verified and user registered successfully',
      status: 'success',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (err) {
    console.error('Error in verifyOTPCode:', err);
    res.status(500).json({
      message: err.message || 'Server error',
      status: 'error',
    });
  }
};

// @desc    Resend OTP to user email
// @route   POST /api/v1/auth/resend-otp
// @access  Public
export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: 'Email is required',
        status: 'error',
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: 'User not found',
        status: 'error',
      });
    }

    // Check if already verified
    if (user.isVerified) {
      return res.status(400).json({
        message: 'User already verified',
        status: 'error',
      });
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpiry = generateOTPExpiry();

    try {
      // Send OTP via email
      await sendOTPEmail(email, otp, user.fullName);

      // Update user with new OTP
      user.otp = otp;
      user.otpExpiry = otpExpiry;
      await user.save();

      res.status(200).json({
        message: 'OTP resent to your email',
        status: 'success',
        email: email,
      });
    } catch (emailError) {
      return res.status(500).json({
        message: 'Failed to send OTP email',
        status: 'error',
      });
    }
  } catch (err) {
    console.error('Error in resendOTP:', err);
    res.status(500).json({
      message: err.message || 'Server error',
      status: 'error',
    });
  }
};

// @desc    Send OTP for login
// @route   POST /api/v1/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: 'Email is required',
        status: 'error',
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: 'User does not exist. Please register first',
        status: 'error',
      });
    }

    if (!user.isVerified) {
      return res.status(400).json({
        message: 'Please verify your email first using registration',
        status: 'error',
      });
    }

    // Generate OTP for login
    const otp = generateOTP();
    const otpExpiry = generateOTPExpiry();

    try {
      // Send OTP via email
      await sendOTPEmail(email, otp, user.fullName);

      // Save OTP to database
      user.loginOtp = otp;
      user.loginOtpExpiry = otpExpiry;
      await user.save();

      res.status(200).json({
        message: 'OTP sent to your email for login verification',
        status: 'success',
        email: email,
      });
    } catch (emailError) {
      return res.status(500).json({
        message: 'Failed to send OTP. Please check your email configuration.',
        status: 'error',
      });
    }
  } catch (err) {
    console.error('Error in login:', err);
    res.status(500).json({
      message: err.message || 'Server error',
      status: 'error',
    });
  }
};

// @desc    Verify OTP and complete login
// @route   POST /api/v1/auth/verify-login-otp
// @access  Public
export const verifyLoginOTP = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    if (!email || !otp || !password) {
      return res.status(400).json({
        message: 'Email, OTP, and password are required',
        status: 'error',
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: 'User not found',
        status: 'error',
      });
    }

    // Check if user is verified
    if (!user.isVerified) {
      return res.status(400).json({
        message: 'User not verified',
        status: 'error',
      });
    }

    // Verify OTP
    if (!verifyOTP(user.loginOtp, otp, user.loginOtpExpiry)) {
      return res.status(400).json({
        message: 'Invalid or expired OTP',
        status: 'error',
      });
    }

    // Verify password
    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(400).json({
        message: 'Invalid password',
        status: 'error',
      });
    }

    // Clear login OTP
    user.loginOtp = null;
    user.loginOtpExpiry = null;
    await user.save();

    // Generate JWT token
    const token = generateToken(user._id);

    res.status(200).json({
      message: 'Login successful',
      status: 'success',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (err) {
    console.error('Error in verifyLoginOTP:', err);
    res.status(500).json({
      message: err.message || 'Server error',
      status: 'error',
    });
  }
};

// @desc    Resend OTP for login
// @route   POST /api/v1/auth/resend-login-otp
// @access  Public
export const resendLoginOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: 'Email is required',
        status: 'error',
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: 'User not found',
        status: 'error',
      });
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpiry = generateOTPExpiry();

    try {
      // Send OTP via email
      await sendOTPEmail(email, otp, user.fullName);

      // Update user with new OTP
      user.loginOtp = otp;
      user.loginOtpExpiry = otpExpiry;
      await user.save();

      res.status(200).json({
        message: 'OTP resent to your email',
        status: 'success',
        email: email,
      });
    } catch (emailError) {
      return res.status(500).json({
        message: 'Failed to send OTP email',
        status: 'error',
      });
    }
  } catch (err) {
    console.error('Error in resendLoginOTP:', err);
    res.status(500).json({
      message: err.message || 'Server error',
      status: 'error',
    });
  }
};

// @desc    Register a new user (step 1 - send OTP)
// @route   POST /api/v1/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { fullName, email } = req.body;

    if (!fullName || !email) {
      return res.status(400).json({
        message: 'Full name and email are required',
        status: 'error',
      });
    }

    // Check if user exists and is already verified
    const userExists = await User.findOne({ email });
    if (userExists && userExists.isVerified) {
      return res.status(400).json({
        message: 'User already exists',
        status: 'error',
      });
    }

    // Send OTP
    return sendOTP(req, res);
  } catch (err) {
    console.error('Error in register:', err);
    res.status(500).json({
      message: err.message || 'Server error',
      status: 'error',
    });
  }
};

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};
