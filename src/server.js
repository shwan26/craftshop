import "dotenv/config";

import mongoose from "mongoose";

import app from "./app.js";
import { connectDatabase } from "./config/database.js";
import { env } from "./config/env.js";

async function startServer() {
  try {
    await connectDatabase();

    const server = app.listen(env.PORT, () => {
      console.log(
        `CraftShop running in ${env.NODE_ENV} mode`
      );

      console.log(
        `Server listening on port ${env.PORT}`
      );
    });

    let shuttingDown = false;

    async function shutdown(signal) {
      if (shuttingDown) {
        return;
      }

      shuttingDown = true;

      console.log(
        `${signal} received. Starting graceful shutdown.`
      );

      server.close(async () => {
        try {
          await mongoose.connection.close();

          console.log("MongoDB connection closed.");
          console.log("HTTP server closed.");

          process.exit(0);
        } catch (error) {
          console.error(
            "Shutdown failed:",
            error
          );

          process.exit(1);
        }
      });

      setTimeout(() => {
        console.error(
          "Forced shutdown after 10 seconds."
        );

        process.exit(1);
      }, 10000).unref();
    }

    process.on("SIGTERM", () => {
      shutdown("SIGTERM");
    });

    process.on("SIGINT", () => {
      shutdown("SIGINT");
    });
  } catch (error) {
    console.error(
      "Application startup failed:",
      error
    );

    process.exit(1);
  }
}

startServer();