import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import helmet from "helmet";
import compression from "compression";
import flash from "connect-flash";
import path from "path";
import { fileURLToPath } from "url";

import { env } from "./config/env.js";

import { generalLimiter } from "./middleware/rateLimits.js";

import { normalizeInput } from "./middleware/normalizeInput.js";

import homeRoutes from "./routes/homeRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import checkoutRoutes from "./routes/checkoutRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import workspaceRoutes from "./routes/workspaceRoutes.js";
import healthRoutes from "./routes/healthRoutes.js";

const app = express();

const isProduction =
  env.NODE_ENV === "production";

if (isProduction) {
  app.set("trust proxy", 1);
}

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const projectRoot = path.resolve(dirname, "..");

app.set("view engine", "ejs");
app.set("views", path.join(projectRoot, "views"));

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        "default-src": ["'self'"],

        "script-src": [
          "'self'",
          "https://cdn.jsdelivr.net"
        ],

        "style-src": [
          "'self'",
          "'unsafe-inline'",
          "https://cdn.jsdelivr.net",
          "https://fonts.googleapis.com"
        ],

        "font-src": [
          "'self'",
          "https://cdn.jsdelivr.net",
          "https://fonts.gstatic.com",
          "data:"
        ],

        "img-src": [
          "'self'",
          "data:",
          "https:"
        ],

        "connect-src": ["'self'"],

        "object-src": ["'none'"],

        "base-uri": ["'self'"],

        "form-action": ["'self'"],

        "frame-ancestors": ["'none'"]
      }
    }
  })
);

app.use(compression());

app.use(
  express.urlencoded({
    extended: true,
    limit: "100kb",
    parameterLimit: 100
  })
);

app.use(
  express.json({
    limit: "100kb"
  })
);

app.use(normalizeInput);
app.use(healthRoutes);

app.use(generalLimiter);

app.use(express.static(path.join(projectRoot, "public")));

app.set("trust proxy", 1);

app.use(
  session({
    name: "craftshop.sid",

    secret: env.SESSION_SECRET,

    resave: false,

    saveUninitialized: false,

    rolling: true,

    store: MongoStore.create({
      mongoUrl: env.MONGODB_URI,
      dbName: "craftshop",
      collectionName: "sessions",
      ttl: 7 * 24 * 60 * 60
    }),

    cookie: {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    }
  })
);

app.use(flash());

app.use((req, res, next) => {
  res.locals.currentUser = req.session.user ?? null;
  res.locals.cart = req.session.cart ?? [];
  res.locals.successMessages = req.flash("success");
  res.locals.errorMessages = req.flash("error");

  next();
});

app.use("/", homeRoutes);
app.use("/services", serviceRoutes);
app.use(authRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/cart", cartRoutes);
app.use("/checkout", checkoutRoutes);
app.use("/orders", orderRoutes);
app.use("/admin", adminRoutes);
app.use("/", workspaceRoutes);

app.use((error, req, res, next) => {
  const errorId =
    `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`;

  console.error(`[${errorId}]`, error);

  if (res.headersSent) {
    return next(error);
  }

  const statusCode =
    Number.isInteger(error.status)
      ? error.status
      : 500;

  if (env.NODE_ENV === "development") {
    return res.status(statusCode).render("error", {
      title: "Application Error",
      errorId,
      errorMessage: error.message,
      errorStack: error.stack
    });
  }

  return res.status(statusCode).render("error", {
    title: "Something Went Wrong",
    errorId,
    errorMessage: null,
    errorStack: null
  });
});

app.use((error, req, res, next) => {
  console.error(error);

  res.status(error.status ?? 500).render("error", {
    title: "Application Error",
    message:
      process.env.NODE_ENV === "production"
        ? "Something went wrong. Please try again."
        : error.message
  });
});

export default app;