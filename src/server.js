import "dotenv/config";

import app from "./app.js";

import { connectDatabase } from "./config/database.js";
import { env } from "./config/env.js";

async function startServer() {
  try {
    await connectDatabase();

    const server = app.listen(
      env.PORT,
      () => {
        console.log(
          `CraftShop running in ${env.NODE_ENV} mode`
        );

        console.log(
          `Server: http://localhost:${env.PORT}`
        );
      }
    );

    async function shutdown(signal) {
      console.log(`${signal} received. Shutting down...`);

      server.close(() => {
        console.log("HTTP server closed.");
        process.exit(0);
      });

      setTimeout(() => {
        console.error(
          "Forced shutdown after timeout."
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