import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import helmet from "helmet";
import compression from "compression";
import flash from "connect-flash";
import path from "path";
import { fileURLToPath } from "url";

import homeRoutes from "./routes/homeRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import checkoutRoutes from "./routes/checkoutRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import workspaceRoutes from "./routes/workspaceRoutes.js";

const app = express();

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const projectRoot = path.resolve(dirname, "..");

app.set("view engine", "ejs");
app.set("views", path.join(projectRoot, "views"));

app.use(
  helmet({
    contentSecurityPolicy: false
  })
);

app.use(compression());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(projectRoot, "public")));

app.set("trust proxy", 1);

app.use(
  session({
    name: "craftshop.sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI
    }),
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7
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

app.use((req, res) => {
  res.status(404).render("404", {
    title: "Page Not Found"
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