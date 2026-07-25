import bcrypt from "bcrypt";
import User from "../models/User.js";

export function showLogin(req, res) {
  return res.render("auth/login", {
    title: "Login"
  });
}

export function showRegister(req, res) {
  return res.render("auth/register", {
    title: "Register"
  });
}

export async function register(req, res, next) {
  try {
    const name = String(req.body.name || "").trim();

    const email = String(req.body.email || "")
      .trim()
      .toLowerCase();

    const password = String(req.body.password || "");

    if (!name || !email || !password) {
      req.flash("error", "All fields are required.");
      return res.redirect("/register");
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      req.flash("error", "Email already exists.");
      return res.redirect("/register");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    const returnTo = req.session.returnTo || "/dashboard";

    req.session.regenerate((regenerateError) => {
      if (regenerateError) {
        return next(regenerateError);
      }

      req.session.user = {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role
      };

      req.session.save((saveError) => {
        if (saveError) {
          return next(saveError);
        }

        return res.redirect(
          user.role === "admin"
            ? "/admin"
            : returnTo
        );
      });
    });
  } catch (error) {
    return next(error);
  }
}

export async function login(req, res, next) {
  try {
    const email = String(req.body.email || "")
      .trim()
      .toLowerCase();

    const password = String(req.body.password || "");

    const user = await User.findOne({ email });

    if (!user) {
      req.flash("error", "Invalid email or password.");
      return res.redirect("/login");
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatches) {
      req.flash("error", "Invalid email or password.");
      return res.redirect("/login");
    }

    const returnTo = req.session.returnTo || "/dashboard";

    req.session.regenerate((regenerateError) => {
      if (regenerateError) {
        return next(regenerateError);
      }

      req.session.user = {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role
      };

      req.session.save((saveError) => {
        if (saveError) {
          return next(saveError);
        }

        return res.redirect(
          user.role === "admin"
            ? "/admin"
            : returnTo
        );
      });
    });
  } catch (error) {
    return next(error);
  }
}

export function logout(req, res, next) {
  req.session.destroy((error) => {
    if (error) {
      return next(error);
    }

    res.clearCookie("craftshop.sid");

    return res.redirect("/");
  });
}