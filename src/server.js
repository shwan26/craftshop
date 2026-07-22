import "dotenv/config";

import app from "./app.js";
import { connectDatabase } from "./config/database.js";

const port = Number(process.env.PORT) || 3000;

async function startServer() {
  try {
    await connectDatabase();

    app.listen(port, "0.0.0.0", () => {
      console.log(`CraftShop running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to start CraftShop:", error);
    process.exit(1);
  }
}

startServer();