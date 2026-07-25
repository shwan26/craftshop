import mongoose from "mongoose";

import Order from "../models/Order.js";
import Service from "../models/Service.js";
import User from "../models/User.js";

const allowedOrderStatuses = [
  "pending",
  "confirmed",
  "in-progress",
  "delivered",
  "cancelled"
];

function createSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizePackages(body) {
  const names = Array.isArray(body.packageName)
    ? body.packageName
    : [body.packageName];

  const prices = Array.isArray(body.packagePrice)
    ? body.packagePrice
    : [body.packagePrice];

  const deliveryDays = Array.isArray(body.packageDeliveryDays)
    ? body.packageDeliveryDays
    : [body.packageDeliveryDays];

  const features = Array.isArray(body.packageFeatures)
    ? body.packageFeatures
    : [body.packageFeatures];

  return names
    .map((name, index) => {
      const packageFeatures = String(features[index] || "")
        .split("\n")
        .map((feature) => feature.trim())
        .filter(Boolean);

      return {
        name: String(name || "").trim(),
        price: Number(prices[index]),
        deliveryDays: Number(deliveryDays[index]),
        features: packageFeatures
      };
    })
    .filter(
      (pkg) =>
        pkg.name &&
        Number.isFinite(pkg.price) &&
        pkg.price >= 0 &&
        Number.isInteger(pkg.deliveryDays) &&
        pkg.deliveryDays > 0
    );
}

export async function showAdminDashboard(req, res, next) {
  try {
    const [
      userCount,
      serviceCount,
      orderCount,
      pendingOrderCount,
      recentOrders
    ] = await Promise.all([
      User.countDocuments(),
      Service.countDocuments(),
      Order.countDocuments(),
      Order.countDocuments({
        status: {
          $in: ["pending", "confirmed", "in-progress"]
        }
      }),
      Order.find()
        .populate("user", "name email")
        .sort({ createdAt: -1 })
        .limit(5)
        .lean()
    ]);

    return res.render("admin/dashboard", {
      title: "Admin Dashboard | CraftShop",
      userCount,
      serviceCount,
      orderCount,
      pendingOrderCount,
      recentOrders
    });
  } catch (error) {
    return next(error);
  }
}

export async function listAdminOrders(req, res, next) {
  try {
    const status = req.query.status;

    const filter =
      status && allowedOrderStatuses.includes(status)
        ? { status }
        : {};

    const orders = await Order.find(filter)
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .lean();

    return res.render("admin/orders/index", {
      title: "Manage Orders | CraftShop",
      orders,
      selectedStatus: status || "",
      allowedOrderStatuses
    });
  } catch (error) {
    return next(error);
  }
}

export async function showAdminOrder(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.orderId)) {
      return res.status(404).render("404", {
        title: "Order Not Found"
      });
    }

    const order = await Order.findById(req.params.orderId)
      .populate("user", "name email")
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

    return res.render("admin/orders/detail", {
      title: `${order.orderNumber} | Admin`,
      order,
      allowedOrderStatuses
    });
  } catch (error) {
    return next(error);
  }
}

export async function updateOrderStatus(req, res, next) {
  try {
    const { status } = req.body;
    const statusNote = String(
      req.body.statusNote || ""
    ).trim();

    if (!allowedOrderStatuses.includes(status)) {
      req.flash("error", "Invalid order status.");

      return res.redirect(
        `/admin/orders/${req.params.orderId}`
      );
    }

    if (!mongoose.isValidObjectId(req.params.orderId)) {
      req.flash("error", "Order not found.");
      return res.redirect("/admin/orders");
    }

    const order = await Order.findById(
      req.params.orderId
    );

    if (!order) {
      req.flash("error", "Order not found.");
      return res.redirect("/admin/orders");
    }

    if (order.status === status) {
      req.flash(
        "error",
        `The order is already marked as ${status.replace("-", " ")}.`
      );

      return res.redirect(
        `/admin/orders/${order._id}`
      );
    }

    order.status = status;

    order.statusHistory.push({
      status,
      changedBy: req.session.user.id,
      changedByName: req.session.user.name,
      note: statusNote
    });

    await order.save();

    req.flash(
      "success",
      `${order.orderNumber} was updated to ${status.replace("-", " ")}.`
    );

    return res.redirect(
      `/admin/orders/${order._id}`
    );
  } catch (error) {
    return next(error);
  }
}

export async function listAdminServices(req, res, next) {
  try {
    const services = await Service.find()
      .sort({ createdAt: -1 })
      .lean();

    return res.render("admin/services/index", {
      title: "Manage Services | CraftShop",
      services
    });
  } catch (error) {
    return next(error);
  }
}

export function showCreateService(req, res) {
  return res.render("admin/services/create", {
    title: "Create Service | CraftShop"
  });
}

export async function createService(req, res, next) {
  try {
    const {
      title,
      description,
      category,
      icon
    } = req.body;

    const packages = normalizePackages(req.body);

    if (
      !title?.trim() ||
      !description?.trim() ||
      !category?.trim()
    ) {
      req.flash(
        "error",
        "Title, description, and category are required."
      );

      return res.redirect("/admin/services/new");
    }

    if (packages.length === 0) {
      req.flash(
        "error",
        "Add at least one valid package."
      );

      return res.redirect("/admin/services/new");
    }

    const baseSlug = createSlug(title);
    let slug = baseSlug;
    let counter = 2;

    while (await Service.exists({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter += 1;
    }

    await Service.create({
      title: title.trim(),
      slug,
      description: description.trim(),
      category: category.trim(),
      icon: icon?.trim() || "bi-tools",
      packages
    });

    req.flash("success", "Service created successfully.");

    return res.redirect("/admin/services");
  } catch (error) {
    return next(error);
  }
}

export async function showEditService(req, res, next) {
  try {
    const service = await Service.findById(
      req.params.serviceId
    ).lean();

    if (!service) {
      return res.status(404).render("404", {
        title: "Service Not Found"
      });
    }

    return res.render("admin/services/edit", {
      title: `Edit ${service.title} | CraftShop`,
      service
    });
  } catch (error) {
    return next(error);
  }
}

export async function updateService(req, res, next) {
  try {
    const {
      title,
      description,
      category,
      icon
    } = req.body;

    const packages = normalizePackages(req.body);

    if (
      !title?.trim() ||
      !description?.trim() ||
      !category?.trim()
    ) {
      req.flash(
        "error",
        "Title, description, and category are required."
      );

      return res.redirect(
        `/admin/services/${req.params.serviceId}/edit`
      );
    }

    if (packages.length === 0) {
      req.flash(
        "error",
        "Add at least one valid package."
      );

      return res.redirect(
        `/admin/services/${req.params.serviceId}/edit`
      );
    }

    const service = await Service.findById(
      req.params.serviceId
    );

    if (!service) {
      req.flash("error", "Service not found.");
      return res.redirect("/admin/services");
    }

    service.title = title.trim();
    service.description = description.trim();
    service.category = category.trim();
    service.icon = icon?.trim() || "bi-tools";
    service.packages = packages;

    await service.save();

    req.flash("success", "Service updated successfully.");

    return res.redirect("/admin/services");
  } catch (error) {
    return next(error);
  }
}

export async function deleteService(req, res, next) {
  try {
    const service = await Service.findByIdAndDelete(
      req.params.serviceId
    );

    if (!service) {
      req.flash("error", "Service not found.");
      return res.redirect("/admin/services");
    }

    req.flash(
      "success",
      `${service.title} was deleted.`
    );

    return res.redirect("/admin/services");
  } catch (error) {
    return next(error);
  }
}