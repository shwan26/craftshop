import express from "express";

import {
  addToCart,
  clearCart,
  removeFromCart,
  showCart
} from "../controllers/cartController.js";

const router = express.Router();

router.get("/", showCart);

router.post("/add", addToCart);

router.post("/remove/:itemId", removeFromCart);

router.post("/clear", clearCart);

export default router;