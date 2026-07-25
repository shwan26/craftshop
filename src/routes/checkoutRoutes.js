import express from "express";

import {
  createOrder,
  showCheckout,
  showCheckoutSuccess
} from "../controllers/checkoutController.js";

import { requireLogin } from "../middleware/auth.js";

import {
  checkoutLimiter
} from "../middleware/rateLimits.js";

const router = express.Router();

router.get("/", requireLogin, showCheckout);

router.post("/", requireLogin, checkoutLimiter, createOrder);

router.get(
  "/success/:orderId",
  requireLogin,
  showCheckoutSuccess
);

export default router;