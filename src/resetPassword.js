import "dotenv/config";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

import { connectDatabase } from "./config/database.js";
import User from "./models/User.js";

const email = process.argv[2];
const newPassword = process.argv[3];

if (!email || !newPassword) {
  console.error(
    'Usage: pnpm reset-password "your@email.com" "NewPassword123"'
  );
  process.exit(1);
}

if (newPassword.length < 8) {
  console.error("Password must contain at least 8 characters.");
  process.exit(1);
}

async function resetPassword() {
  try {
    await connectDatabase();

    console.log("MongoDB host:", mongoose.connection.host);
    console.log("MongoDB database:", mongoose.connection.name);

    const users = await User.find({}, "name email role").lean();

    console.log("Users in this database:");

    if (users.length === 0) {
      console.log("No users found.");
    } else {
      users.forEach((user) => {
        console.log(
          `${user.name} | ${user.email} | ${user.role}`
        );
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail
    });

    if (!user) {
      console.error(
        `No user was found with email: ${normalizedEmail}`
      );
      process.exitCode = 1;
      return;
    }

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    console.log(`Password updated for ${user.email}.`);
  } catch (error) {
    console.error("Password reset failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
}

resetPassword();