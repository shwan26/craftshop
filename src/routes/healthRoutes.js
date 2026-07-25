import express from "express";
import mongoose from "mongoose";

const router = express.Router();

router.get("/health", (req, res) => {
  const databaseConnected =
    mongoose.connection.readyState === 1;

  return res.status(
    databaseConnected ? 200 : 503
  ).json({
    status: databaseConnected
      ? "healthy"
      : "unhealthy",

    database: databaseConnected
      ? "connected"
      : "disconnected",

    uptimeSeconds: Math.floor(
      process.uptime()
    ),

    timestamp: new Date().toISOString()
  });
});

export default router;