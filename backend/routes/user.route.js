import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { getProfile, followUnFollowUser, getSuggestedUsers, updateUser } from "../controllers/user.controller.js";  // ✅ Added updateUser

const router = express.Router();

router.get("/profile/:username", protectRoute, getProfile);
router.post("/follow/:id", protectRoute, followUnFollowUser);
router.get("/suggested", protectRoute, getSuggestedUsers);
router.post("/update", protectRoute, updateUser); // ✅ Route is correct

export default router; // ✅ Exporting correctly
