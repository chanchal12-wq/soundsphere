import React, { useContext, useState, useEffect } from "react";
import { SidebarContext } from "../Context/SibebarContext";
import musicbg from "../assets/musicbg.jpg";
import '../utils/style.css'
import { Link } from "react-router-dom";
const Home = () => {
  const { showMenu, setShowMenu } = useContext(SidebarContext);
  useEffect(() => {
    if (showMenu) setShowMenu(false);
  }, []);

  const token = localStorage.getItem("access_token") || null;
  return (
    <div
      className="w-full min-h-screen flex justify-center items-center flex-col relative"
      style={{
        background: "linear-gradient(135deg, #1e3a8a 0%, #9333ea 100%)",
      }}
    >
      <img
        src={musicbg}
        alt="music background"
        className="absolute inset-0 w-full h-full object-cover opacity-30 z-0"
        style={{ pointerEvents: 'none' }}
      />
      <div className="flex flex-col justify-center items-center space-y-6 bg-black/60 w-full h-screen lg:space-y-8 z-10 backdrop-blur-sm">
        <h1 className="text-4xl lg:text-6xl text-white font-extrabold drop-shadow-lg tracking-tight animate-pulse">
          <span className="inline-block align-middle mr-2">🎵</span>Music Stream
        </h1>
        <p className="text-white text-2xl lg:text-4xl drop-shadow-md font-light">
          Listen to your favorite songs, discover new music, and share your vibe.
        </p>
        <div className="flex flex-col lg:flex-row space-y-5 lg:space-y-0 lg:space-x-5">
          {
            (token ? (
              <Link to={'/upload'} className="bg-gradient-to-r from-lime-300 to-green-400 w-32 py-2 rounded-md flex justify-center text-[#461e74] font-bold shadow-lg hover:scale-105 transition-transform">Upload</Link>
            ) : (
              <Link to={'/login'} className="bg-gradient-to-r from-lime-300 to-green-400 w-32 py-2 rounded-md flex justify-center text-[#461e74] font-bold shadow-lg hover:scale-105 transition-transform">Login</Link>
            ))
          }
          <Link to={'/explore'} className="bg-gradient-to-r from-pink-400 to-purple-600 w-32 py-2 rounded-md flex justify-center text-white font-bold shadow-lg hover:scale-105 transition-transform">Stream</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
