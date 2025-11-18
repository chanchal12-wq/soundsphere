import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

console.log("🔍 Testing MongoDB Connection...\n");
console.log("MONGO_URI:", process.env.MONGO_URI || "NOT SET");

if (!process.env.MONGO_URI) {
  console.error("❌ ERROR: MONGO_URI not set in .env file");
  console.log("\n📝 Please add to .env:");
  console.log("MONGO_URI=mongodb://localhost:27017/music_website");
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully!");
    console.log("📊 Connection details:");
    console.log("  - Host:", mongoose.connection.host);
    console.log("  - Port:", mongoose.connection.port);
    console.log("  - Database:", mongoose.connection.name);
    process.exit(0);
  })
  .catch(err => {
    console.error("❌ MongoDB connection failed!");
    console.error("Error:", err.message);
    console.log("\n💡 Troubleshooting tips:");
    console.log("  1. Check if MongoDB is running");
    console.log("  2. Verify MONGO_URI in .env file");
    console.log("  3. Check MongoDB credentials");
    console.log("  4. Ensure network access if using MongoDB Atlas");
    process.exit(1);
  });
