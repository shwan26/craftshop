import express from "express";

import {
  createService,
  deleteService,
  listAdminOrders,
  listAdminServices,
  showAdminDashboard,
  showAdminOrder,
  showCreateService,
  showEditService,
  updateOrderStatus,
  updateService
} from "../controllers/adminController.js";

import { requireAdmin } from "../middleware/admin.js";

const router = express.Router();

router.use(requireAdmin);

router.get("/", showAdminDashboard);

router.get("/orders", listAdminOrders);
router.get("/orders/:orderId", showAdminOrder);
router.post(
  "/orders/:orderId/status",
  updateOrderStatus
);

router.get("/services", listAdminServices);
router.get("/services/new", showCreateService);
router.post("/services", createService);

router.get(
  "/services/:serviceId/edit",
  showEditService
);

router.post(
  "/services/:serviceId",
  updateService
);

router.post(
  "/services/:serviceId/delete",
  deleteService
);

export default router;