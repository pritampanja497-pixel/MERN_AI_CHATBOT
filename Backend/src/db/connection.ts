import { connect, disconnect } from "mongoose";
import { config } from "dotenv";

config();

async function connectToDatabase() {
  try {
    if (!process.env.MONGODB_URL) {
      throw new Error("MONGODB_URL is not defined in .env file");
    }
    await connect(process.env.MONGODB_URL);
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    throw new Error("Could not Connect To MongoDB");
  }
}

async function disconnectFromDatabase() {
  try {
    await disconnect();
  } catch (error) {
    console.log(error);
    throw new Error("Could not Disconnect From MongoDB");
  }
}

export { connectToDatabase, disconnectFromDatabase };
