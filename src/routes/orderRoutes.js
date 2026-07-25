import express from "express";

import {
  listOrders,
  showOrder,
  cancelOrder,
} from "../controllers/orderController.js";

import { requireLogin } from "../middleware/auth.js";

const router = express.Router();

router.get("/", requireLogin, listOrders);

router.get("/:orderId", requireLogin, showOrder);

router.post(
  "/:orderId/cancel",
  requireLogin,
  cancelOrder
);

export default router;