import React, { useState } from "react";
import { Link, useNavigate} from "react-router-dom";
import {AiOutlineLogin } from 'react-icons/ai'

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState(1); // 1: Enter email, 2: Enter OTP & password
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  let __URL__ ;
  if ( document.domain === "localhost" ) {
    __URL__ = "http://localhost:1337";
  } else {
    __URL__ = "https://music-player-app-backend-yq0c.onrender.com";
  }

  // Step 1: Send OTP
  const handleSendOTP = async (e) =>{
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${__URL__}/api/v1/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email })
      });
      const data = await res.json();

      if(data.status === "success"){
        setStep(2);
        setError("");
        startResendTimer();
      } else {
        setError(data.message || "Failed to send OTP");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Step 2: Verify OTP and Password
  const handleVerifyLogin = async (e) =>{
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${__URL__}/api/v1/auth/verify-login-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp, password })
      });
      const data = await res.json();

      if(data.status === "success"){
        localStorage.setItem("access_token", data.token);
        alert("Login Successful");
        navigate('/')
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Resend OTP
  const handleResendOTP = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${__URL__}/api/v1/auth/resend-login-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email })
      });
      const data = await res.json();

      if(data.status === "success"){
        setError("");
        startResendTimer();
      } else {
        setError(data.message || "Failed to resend OTP");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Timer for resend button
  const startResendTimer = () => {
    setResendTimer(60);
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Go back to step 1
  const handleBackToStep1 = () => {
    setStep(1);
    setOtp("");
    setPassword("");
    setError("");
  };

  return (
    <div className="w-full h-screen flex justify-center items-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <form
        className="bg-slate-800 rounded-lg shadow-2xl p-8 w-full max-w-md"
        onSubmit={step === 1 ? handleSendOTP : handleVerifyLogin}
      >
        <h1 className="text-3xl font-bold text-white mb-2">Music Platform</h1>
        <p className="text-gray-400 mb-8">
          {step === 1 ? 'Login to your account' : 'Verify your login'}
        </p>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Step 1: Enter Email */}
        {step === 1 && (
          <div className="flex flex-col space-y-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                placeholder="Enter your email"
                disabled={loading}
                required
              />
            </div>
            <button 
              type="submit"
              disabled={loading}
              className="flex justify-center items-center space-x-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-semibold py-2 rounded-lg transition duration-200 w-full"
            >
              <span>{loading ? 'Sending OTP...' : 'Send OTP'}</span><AiOutlineLogin/>
            </button>
            <div className="flex justify-center items-center space-x-2">
              <p className="text-gray-400">Don't have an account?</p>
              <Link to="/otp-verification" className="text-purple-400 hover:text-purple-300 font-bold">
                Register
              </Link>
            </div>
          </div>
        )}

        {/* Step 2: Enter OTP & Password */}
        {step === 2 && (
          <div className="flex flex-col space-y-4">
            <div className="bg-slate-700 p-4 rounded-lg">
              <p className="text-gray-300 text-sm">
                Verifying: <strong className="text-purple-400">{email}</strong>
              </p>
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Enter OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.slice(0, 6))}
                maxLength="6"
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-center text-2xl tracking-widest placeholder-gray-400 focus:outline-none focus:border-purple-500"
                placeholder="000000"
                disabled={loading}
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                placeholder="Enter your password"
                disabled={loading}
                required
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="flex justify-center items-center space-x-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-semibold py-2 rounded-lg transition duration-200 w-full"
            >
              <span>{loading ? 'Verifying...' : 'Login'}</span><AiOutlineLogin/>
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleBackToStep1}
                disabled={loading}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 rounded-lg transition duration-200"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={loading || resendTimer > 0}
                className="flex-1 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold py-2 rounded-lg transition duration-200"
              >
                {resendTimer > 0 ? `Resend (${resendTimer}s)` : 'Resend OTP'}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default Login;