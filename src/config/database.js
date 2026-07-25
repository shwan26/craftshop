import mongoose from "mongoose";

import { env } from "./env.js";

export async function connectDatabase() {
  try {
    await mongoose.connect(env.MONGODB_URI, {
      dbName: "craftshop"
    });

    console.log(
      `MongoDB connected: ${mongoose.connection.host}`
    );

    console.log(
      `MongoDB database: ${mongoose.connection.name}`
    );
  } catch (error) {
    console.error(
      "MongoDB connection failed:",
      error.message
    );

    throw error;
  }
}