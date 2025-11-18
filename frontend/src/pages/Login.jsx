import React, { useState } from "react";
import { Link, useNavigate} from "react-router-dom";
import {AiOutlineLogin } from 'react-icons/ai'

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  let __URL__ ;
  if ( document.domain === "localhost" ) {
    __URL__ = "http://localhost:1337";
  } else {
    __URL__ = "https://music-player-app-backend-yq0c.onrender.com";
  }

  // Handle login with email and password only
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await fetch(`${__URL__}/api/v1/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if(data.status === "success"){
        localStorage.setItem("access_token", data.token);
        setSuccess("Login Successful! Redirecting...");
        setTimeout(() => {
          setSuccess("");
          navigate('/');
        }, 1500);
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full h-screen flex justify-center items-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <form
        className="bg-slate-800 rounded-lg shadow-2xl p-8 w-full max-w-md"
        onSubmit={handleLogin}
      >
        <h1 className="text-3xl font-bold text-white mb-2">Music Platform</h1>
        <p className="text-gray-400 mb-8">Login to your account</p>
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-500/20 border border-green-500 text-green-200 px-4 py-3 rounded-lg mb-4 animate-bounce-in">
            {success}
          </div>
        )}
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
            <span>{loading ? 'Logging in...' : 'Login'}</span><AiOutlineLogin/>
          </button>
          <div className="flex justify-center items-center space-x-2">
            <p className="text-gray-400">Don't have an account?</p>
            <Link to="/otp-verification" className="text-purple-400 hover:text-purple-300 font-bold">
              Register
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;