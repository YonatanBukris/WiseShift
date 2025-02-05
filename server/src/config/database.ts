import mongoose from "mongoose";
import { config } from "dotenv";

config();

const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    const conn = await mongoose.connect(mongoUri);
    
    // Drop all indexes on startup (only during development)
    if (process.env.NODE_ENV === 'development') {
      await conn.connection.collection('users').dropIndexes();
    }
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export default connectDB; 