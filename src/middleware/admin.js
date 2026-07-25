export function requireAdmin(req, res, next) {
  if (!req.session.user) {
    req.session.returnTo = req.originalUrl;

    req.flash("error", "Please log in to continue.");

    return res.redirect("/login");
  }

  if (req.session.user.role !== "admin") {
    req.flash("error", "You do not have permission to access that page.");

    return res.redirect("/dashboard");
  }

  next();
}