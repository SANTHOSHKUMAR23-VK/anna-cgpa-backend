// src/routes/adminRoutes.js
import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { getAllUsers, exportUserExcel, exportUserPdf, exportAllUsersExcel, exportAllUsersPdf } from "../controllers/userController.js";

const router = express.Router();


router.get("/users", protect, adminOnly, getAllUsers);
router.get("/export/excel/:userId", protect, adminOnly, exportUserExcel);
router.get("/export/pdf/:userId", protect, adminOnly, exportUserPdf);
router.get("/export/all/excel", protect, adminOnly, exportAllUsersExcel);
router.get("/export/all/pdf", protect, adminOnly, exportAllUsersPdf);

export default router;
