import mongoose from "mongoose";

import Order from "../models/Order.js";

export async function listOrders(req, res, next) {
  try {
    const orders = await Order.find({
      user: req.session.user.id
    })
      .sort({ createdAt: -1 })
      .lean();

    return res.render("orders/index", {
      title: "My Orders | CraftShop",
      orders
    });
  } catch (error) {
    return next(error);
  }
}

export async function showOrder(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.orderId)) {
      return res.status(404).render("404", {
        title: "Order Not Found"
      });
    }

    const order = await Order.findOne({
      _id: req.params.orderId,
      user: req.session.user.id
    })
      .populate("messages.sender", "name role")
      .populate("statusHistory.changedBy", "name role")
      .lean();

    if (!order) {
      return res.status(404).render("404", {
        title: "Order Not Found"
      });
    }

    order.messages = [...(order.messages || [])].sort(
      (a, b) =>
        new Date(a.createdAt) - new Date(b.createdAt)
    );

    order.statusHistory = [
      ...(order.statusHistory || [])
    ].sort(
      (a, b) =>
        new Date(a.createdAt) - new Date(b.createdAt)
    );

    return res.render("orders/detail", {
      title: `${order.orderNumber} | CraftShop`,
      order
    });
  } catch (error) {
    return next(error);
  }
}

export async function cancelOrder(req, res, next) {
  try {
    const { orderId } = req.params;

    if (!mongoose.isValidObjectId(orderId)) {
      req.flash("error", "Invalid order.");
      return res.redirect("/orders");
    }

    const order = await Order.findOne({
      _id: orderId,
      user: req.session.user.id
    });

    if (!order) {
      req.flash("error", "Order not found.");
      return res.redirect("/orders");
    }

    if (order.status !== "pending") {
      req.flash(
        "error",
        "This order can no longer be cancelled."
      );

      return res.redirect(`/orders/${order._id}`);
    }

    const cancellationReason = String(
      req.body.cancellationReason || ""
    ).trim();

    order.status = "cancelled";

    order.statusHistory.push({
      status: "cancelled",
      changedBy: req.session.user.id,
      changedByName: req.session.user.name,
      note: cancellationReason
        ? `Cancelled by customer: ${cancellationReason}`
        : "Order cancelled by customer."
    });

    order.messages.push({
      sender: req.session.user.id,
      senderName: req.session.user.name,
      senderRole: req.session.user.role,
      body: cancellationReason
        ? `I cancelled this order. Reason: ${cancellationReason}`
        : "I cancelled this order."
    });

    await order.save();

    req.flash("success", "Your order has been cancelled.");

    return res.redirect(`/orders/${order._id}`);
  } catch (error) {
    return next(error);
  }
}

