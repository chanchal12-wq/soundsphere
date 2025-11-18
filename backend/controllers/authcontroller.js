import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'
import conn from "../config/db.js";
import sendOTP from "../utils/sendOTP.js";

// ============================
// LOGIN CONTROLLER (with OTP)
// ============================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error("Please add all fields");
    }

    const db = conn.db("music_streaming");
    const collection = db.collection("users");

    const user = await collection.findOne({ email });
    if (!user) {
      res.status(400);
      throw new Error("User does not exist");
    }

    if (!bcrypt.compareSync(password, user.password)) {
      res.status(400);
      throw new Error("Invalid credentials");
    }

    // Generate Login OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await collection.updateOne(
      { email },
      {
        $set: {
          loginOtp: otp,
          loginOtpExpiry: Date.now() + 5 * 60 * 1000, // 5 minutes
        },
      }
    );

    await sendOTP(email, otp);

    return res.status(200).json({
      status: "success",
      message: "OTP sent to your email",
    });

  } catch (err) {
    return res.send(err.message);
  }
};


// ============================
// REGISTER CONTROLLER
// ============================
export const register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      res.status(400);
      throw new Error("Please add all fields");
    }

    const db = conn.db("music_streaming");
    const collection = db.collection("users");

    const existingUser = await collection.findOne({ email });
    if (existingUser) {
      res.status(400);
      throw new Error("User already exists");
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await collection.insertOne({
      fullName,
      email,
      password: hashedPassword,
      playlists: [],
      otp: null,
      otpExpiry: null,
      loginOtp: null,
      loginOtpExpiry: null,
      isVerified: false,
      createdAt: new Date()
    });

    return res.status(201).json({
      status: "success",
      message: "User registered successfully",
    });

  } catch (err) {
    return res.send(err.message);
  }
};
