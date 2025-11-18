import React from "react";
import { Link } from "react-router-dom";

const Register = () => {
  return (
    <div className="w-full h-screen flex justify-center items-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="bg-slate-800 rounded-lg shadow-2xl p-8 w-full max-w-md flex flex-col items-center">
        <h1 className="text-3xl font-bold text-white mb-4">Register</h1>
        <p className="text-gray-300 mb-6">To register, please use the OTP verification page.</p>
        <Link to="/otp-verification" className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200">
          Go to OTP Verification
        </Link>
        <div className="flex justify-center items-center mt-6">
          <p className="text-gray-400">Already have an account?</p>
          <Link to="/login" className="ml-2 text-purple-400 hover:text-purple-300 font-bold">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;