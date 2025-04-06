import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { getNotifications, deleteNotifications } from "../controllers/notification.controller.js";

const router = express.Router();

// Get all notifications (requires authentication)
router.get("/", protectRoute, getNotifications);

// Delete all notifications for the authenticated user
router.delete("/", protectRoute, deleteNotifications);

export default router;
