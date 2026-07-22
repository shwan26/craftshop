import express from "express";

import {
    listServices,
    serviceDetail
} from "../controllers/serviceController.js";

const router = express.Router();

router.get("/", listServices);

router.get("/:slug", serviceDetail);

export default router;