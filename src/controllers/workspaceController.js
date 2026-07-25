import mongoose from "mongoose";

import Order from "../models/Order.js";

function isAdmin(req) {
  return req.session.user?.role === "admin";
}

async function findAccessibleOrder(req) {
  if (!mongoose.isValidObjectId(req.params.orderId)) {
    return null;
  }

  const filter = {
    _id: req.params.orderId
  };

  if (!isAdmin(req)) {
    filter.user = req.session.user.id;
  }

  return Order.findOne(filter);
}

export async function addOrderMessage(req, res, next) {
  try {
    const order = await findAccessibleOrder(req);

    if (!order) {
      req.flash("error", "Order not found.");

      return res.redirect(
        isAdmin(req) ? "/admin/orders" : "/orders"
      );
    }

    const body = String(req.body.message || "").trim();

    if (!body) {
      req.flash("error", "Message cannot be empty.");

      return res.redirect(
        isAdmin(req)
          ? `/admin/orders/${order._id}`
          : `/orders/${order._id}`
      );
    }

    if (body.length > 2000) {
      req.flash(
        "error",
        "Messages cannot exceed 2,000 characters."
      );

      return res.redirect(
        isAdmin(req)
          ? `/admin/orders/${order._id}`
          : `/orders/${order._id}`
      );
    }

    order.messages.push({
      sender: req.session.user.id,
      senderName: req.session.user.name,
      senderRole: req.session.user.role,
      body
    });

    await order.save();

    req.flash("success", "Message sent.");

    return res.redirect(
      isAdmin(req)
        ? `/admin/orders/${order._id}#messages`
        : `/orders/${order._id}#messages`
    );
  } catch (error) {
    return next(error);
  }
}