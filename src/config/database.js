import mongoose from "mongoose";

export async function connectDatabase() {
  const mongodbUri = process.env.MONGODB_URI;

  if (!mongodbUri) {
    throw new Error("MONGODB_URI is missing from the .env file.");
  }

  await mongoose.connect(mongodbUri);

  console.log(`MongoDB connected: ${mongoose.connection.host}`);
}