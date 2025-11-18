import React, { useState } from "react";
import axios from "axios";

const OtpVerifyPage = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const otpInputs = Array.from({ length: 6 }, (_, i) => React.createRef());

  const handleOtpChange = (idx, value) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[idx] = value;
    setOtp(newOtp);
    if (value && idx < 5) otpInputs[idx + 1].current.focus();
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!email || otp.some((d) => d === "")) {
      setMessage("Please enter your email and the 6-digit OTP.");
      return;
    }
    setLoading(true);
    try {
      // Replace with your backend endpoint
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || "http://localhost:1337"}/api/v1/auth/verify-otp`,
        { email, otp: otp.join("") }
      );
      setMessage(response.data.message || "OTP verified successfully!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-600 p-4">
      <div className="bg-white/90 rounded-xl shadow-2xl p-8 w-full max-w-md flex flex-col items-center">
        <h2 className="text-2xl font-bold text-purple-700 mb-4">OTP Verification</h2>
        <form onSubmit={handleVerify} className="w-full flex flex-col items-center space-y-6">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:border-purple-500 text-gray-700"
            required
            disabled={loading}
          />
          <div className="flex gap-2 justify-center">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={otpInputs[idx]}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleOtpChange(idx, e.target.value)}
                className="w-12 h-12 text-2xl text-center border border-purple-400 rounded-lg focus:outline-none focus:border-pink-500 bg-white text-purple-700 shadow"
                disabled={loading}
              />
            ))}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-2 rounded-lg shadow-lg hover:from-purple-600 hover:to-pink-500 transition-all"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
        {message && (
          <div className="mt-4 text-center text-sm text-purple-800 font-semibold">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default OtpVerifyPage;
