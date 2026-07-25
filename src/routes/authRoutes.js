import express from "express";

import {

showLogin,
showRegister,
login,
register,
logout

} from "../controllers/authController.js";

import {
  authenticationLimiter
} from "../middleware/rateLimits.js";

const router = express.Router();

router.get("/login", showLogin);

router.post("/login", authenticationLimiter, login);

router.get("/register", showRegister);

router.post("/register", authenticationLimiter, register);

router.post("/logout", logout);

export default router;