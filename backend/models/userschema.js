import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 50,
  },

  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
  },

  password: {
    type: String,
    required: true,
    trim: true,
  },

  playLists: [
    {
      listName: { type: String, required: true, trim: true },
      state: { type: Boolean, default: false },
      songs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Song" }],
    },
  ],

  // Registration OTP
  otp: {
    type: String,
    default: null,
  },
  otpExpiry: {
    type: Date,
    default: null,
  },

 password: {
    type: String,
    required: true
},
isVerified: {
    type: Boolean,
    default: false
}

});

export default mongoose.model("User", userSchema);
