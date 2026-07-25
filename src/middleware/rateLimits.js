import { rateLimit } from "express-rate-limit";

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,

  standardHeaders: "draft-8",
  legacyHeaders: false,

  message: {
    error:
      "Too many requests. Please wait before trying again."
  }
});

export const authenticationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,

  standardHeaders: "draft-8",
  legacyHeaders: false,

  skipSuccessfulRequests: true,

  handler(req, res) {
    req.flash(
      "error",
      "Too many authentication attempts. Please wait 15 minutes."
    );

    const redirectPath =
      req.path.includes("register")
        ? "/register"
        : "/login";

    return res.redirect(redirectPath);
  }
});

export const messageLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 20,

  standardHeaders: "draft-8",
  legacyHeaders: false,

  handler(req, res) {
    req.flash(
      "error",
      "You are sending messages too quickly. Please wait a moment."
    );

    return res.redirect(
      req.get("referer") || "/orders"
    );
  }
});

export const checkoutLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,

  standardHeaders: "draft-8",
  legacyHeaders: false,

  handler(req, res) {
    req.flash(
      "error",
      "Too many checkout attempts. Please try again later."
    );

    return res.redirect("/checkout");
  }
});