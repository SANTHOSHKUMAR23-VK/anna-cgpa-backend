import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { downloadUsersExcel, downloadUsersPDF } from "../controllers/userController.js";
import User from "../models/userModel.js";
import Cgpa from "../models/Cgpa.js";
import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";

const router = express.Router();

// Admin-only download routes
router.get("/download/excel", protect, adminOnly, downloadUsersExcel);
router.get("/download/pdf", protect, adminOnly, downloadUsersPDF);

export default router;
