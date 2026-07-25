import express from "express";

import { requireLogin } from "../middleware/auth.js";

import {
  messageLimiter
} from "../middleware/rateLimits.js";

import {
  addOrderMessage
} from "../controllers/workspaceController.js";

const router = express.Router();

router.post(
  "/orders/:orderId/messages",
  requireLogin,
  messageLimiter,
  addOrderMessage
);



export default router;