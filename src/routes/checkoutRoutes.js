import express from "express";

import {
  createOrder,
  showCheckout,
  showCheckoutSuccess
} from "../controllers/checkoutController.js";

import { requireLogin } from "../middleware/auth.js";

const router = express.Router();

router.get("/", requireLogin, showCheckout);

router.post("/", requireLogin, createOrder);

router.get(
  "/success/:orderId",
  requireLogin,
  showCheckoutSuccess
);

export default router;