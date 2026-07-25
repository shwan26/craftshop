import bcrypt from "bcrypt";
import User from "../models/User.js";

export function showLogin(req, res) {

    res.render("auth/login", {
        title: "Login"
    });

}

export function showRegister(req, res) {

    res.render("auth/register", {
        title: "Register"
    });

}

export async function register(req, res) {

    const {
        name,
        email,
        password
    } = req.body;

    const exists = await User.findOne({ email });

    if (exists) {

        req.flash("error", "Email already exists.");

        return res.redirect("/register");

    }

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({

        name,
        email,
        password: hash

    });

    req.session.user = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
    };

    const returnTo = req.session.returnTo || "/dashboard";

    delete req.session.returnTo;

    return res.redirect(returnTo);
}

export async function login(req, res) {

    const {
        email,
        password
    } = req.body;

    const user = await User.findOne({ email });

    if (!user) {

        req.flash("error", "Invalid credentials.");

        return res.redirect("/login");

    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {

        req.flash("error", "Invalid credentials.");

        return res.redirect("/login");

    }

    req.session.user = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
    };

    const returnTo = req.session.returnTo || "/dashboard";

    delete req.session.returnTo;

    return res.redirect(returnTo);

}

export function logout(req, res) {

    req.session.destroy(() => {

        res.redirect("/");

    });

}