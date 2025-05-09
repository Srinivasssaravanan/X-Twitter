import express from "express";
import { signup,login,logout,getMe } from "../controllers/auth.controller.js";
import protectRoute from "../middleware/protectRoute.js";
const router = express.Router();

router.post("/signup", signup)
router.post("/login", login) //This line in your server code tells the backend to handle any POST request sent to the /login URL relative to the base URL defined by your API route.
router.post("/logout", logout)
router.get("/me", protectRoute, getMe) 
export default router;