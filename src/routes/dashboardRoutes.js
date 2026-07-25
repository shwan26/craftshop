import express from "express";

import Order from "../models/Order.js";
import { requireLogin } from "../middleware/auth.js";

const router = express.Router();

router.get("/", requireLogin, async (req, res, next) => {
  try {
    const orders = await Order.find({
      user: req.session.user.id
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    const orderCount = await Order.countDocuments({
      user: req.session.user.id
    });

    const activeOrderCount = await Order.countDocuments({
      user: req.session.user.id,
      status: {
        $in: ["pending", "confirmed", "in-progress"]
      }
    });

    const completedOrderCount = await Order.countDocuments({
      user: req.session.user.id,
      status: "delivered"
    });

    return res.render("dashboard/index", {
      title: "Dashboard | CraftShop",
      orders,
      orderCount,
      activeOrderCount,
      completedOrderCount
    });
  } catch (error) {
    return next(error);
  }
});

export default router;