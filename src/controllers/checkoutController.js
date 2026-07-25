import { randomBytes } from "node:crypto";

import Order from "../models/Order.js";
import Service from "../models/Service.js";
import User from "../models/User.js";

function getCart(req) {
  if (!Array.isArray(req.session.cart)) {
    req.session.cart = [];
  }

  return req.session.cart;
}

function createOrderNumber() {
  const datePart = new Date()
    .toISOString()
    .slice(0, 10)
    .replaceAll("-", "");

  const randomPart = randomBytes(3)
    .toString("hex")
    .toUpperCase();

  return `CS-${datePart}-${randomPart}`;
}

export async function showCheckout(req, res, next) {
  try {
    const minimumDeadline = new Date().toISOString().slice(0, 10);

    const cart = getCart(req);

    if (cart.length === 0) {
      req.flash("error", "Your cart is empty.");
      return res.redirect("/cart");
    }

    const user = await User.findById(req.session.user.id).lean();

    if (!user) {
      req.session.destroy(() => {});
      return res.redirect("/login");
    }

    const total = cart.reduce(
      (sum, item) => sum + Number(item.price),
      0
    );

    return res.render("checkout/index", {
      title: "Checkout | CraftShop",
      cart,
      total,
      user,
      minimumDeadline
    });
  } catch (error) {
    return next(error);
  }
}

export async function createOrder(req, res, next) {
  try {
    const cart = getCart(req);

    if (cart.length === 0) {
      req.flash("error", "Your cart is empty.");
      return res.redirect("/cart");
    }

    const {
      projectBrief,
      preferredDeadline,
      contactEmail
    } = req.body;

    if (!projectBrief || projectBrief.trim().length < 20) {
      req.flash(
        "error",
        "Please provide a project brief of at least 20 characters."
      );

      return res.redirect("/checkout");
    }

    if (!contactEmail || !contactEmail.includes("@")) {
      req.flash("error", "Please provide a valid contact email.");
      return res.redirect("/checkout");
    }

    const orderItems = [];
    let verifiedTotal = 0;

    for (const cartItem of cart) {
      const service = await Service.findById(
        cartItem.serviceId
      ).lean();

      if (!service) {
        req.flash(
          "error",
          `${cartItem.serviceTitle} is no longer available.`
        );

        return res.redirect("/cart");
      }

      const selectedPackage =
        service.packages[cartItem.packageIndex];

      if (!selectedPackage) {
        req.flash(
          "error",
          `The selected package for ${service.title} is no longer available.`
        );

        return res.redirect("/cart");
      }

      const price = Number(selectedPackage.price);

      verifiedTotal += price;

      orderItems.push({
        service: service._id,
        serviceTitle: service.title,
        serviceSlug: service.slug,
        packageName: selectedPackage.name,
        packageIndex: cartItem.packageIndex,
        price,
        deliveryDays: Number(
          selectedPackage.deliveryDays
        ),
        features: selectedPackage.features ?? []
      });
    }

    let parsedDeadline = null;

    if (preferredDeadline) {
      const deadline = new Date(preferredDeadline);

      if (Number.isNaN(deadline.getTime())) {
        req.flash("error", "Please provide a valid deadline.");
        return res.redirect("/checkout");
      }

      if (deadline < new Date()) {
        req.flash(
          "error",
          "The preferred deadline must be in the future."
        );

        return res.redirect("/checkout");
      }

      parsedDeadline = deadline;
    }

    const order = await Order.create({
      orderNumber: createOrderNumber(),
      user: req.session.user.id,
      items: orderItems,
      total: verifiedTotal,
      projectBrief: projectBrief.trim(),
      preferredDeadline: parsedDeadline,
      contactEmail: contactEmail.trim().toLowerCase(),

      statusHistory: [
        {
          status: "pending",
          changedBy: req.session.user.id,
          changedByName: req.session.user.name,
          note: "Order submitted by customer."
        }
      ]
    });

    req.session.cart = [];

    req.flash(
      "success",
      `Order ${order.orderNumber} was created successfully.`
    );

    return res.redirect(
      `/checkout/success/${order._id}`
    );
  } catch (error) {
    return next(error);
  }
}

export async function showCheckoutSuccess(
  req,
  res,
  next
) {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
      user: req.session.user.id
    }).lean();

    if (!order) {
      return res.status(404).render("404", {
        title: "Order Not Found"
      });
    }

    return res.render("checkout/success", {
      title: "Order Confirmed | CraftShop",
      order
    });
  } catch (error) {
    return next(error);
  }
}