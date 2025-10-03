

import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { downloadUsersExcel, downloadUsersPDF } from "../controllers/userController.js";
import { protect, adminOnly as admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Auth routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Export routes
router.get("/users/download/excel", protect, admin, downloadUsersExcel);
router.get("/users/download/pdf", protect, admin, downloadUsersPDF);

export default router;
