export function requireLogin(req, res, next) {
  if (!req.session.user) {
    const returnTo =
      req.method === "GET" && req.originalUrl
        ? req.originalUrl
        : "/dashboard";

    req.session.returnTo = returnTo;

    req.flash("error", "Please log in to continue.");

    return res.redirect("/login");
  }

  next();
}