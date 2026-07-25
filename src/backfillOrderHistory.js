import "dotenv/config";
import mongoose from "mongoose";

import { connectDatabase } from "./config/database.js";
import Order from "./models/Order.js";

async function backfillOrderHistory() {
  try {
    await connectDatabase();

    const orders = await Order.find({
      $or: [
        { statusHistory: { $exists: false } },
        { statusHistory: { $size: 0 } }
      ]
    });

    console.log(
      `Found ${orders.length} orders without history.`
    );

    for (const order of orders) {
      order.statusHistory.push({
        status: order.status,
        changedBy: null,
        changedByName: "System",
        note: "Initial status added during data migration.",
        createdAt: order.createdAt,
        updatedAt: order.createdAt
      });

      await order.save();

      console.log(`Updated ${order.orderNumber}`);
    }

    console.log("Order history backfill completed.");
  } catch (error) {
    console.error(
      "Order history backfill failed:",
      error
    );

    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
}

backfillOrderHistory();