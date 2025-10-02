import express from "express";

import { addCgpa, getCgpa, updateSemester, deleteSemester } from "../controllers/cgpaController.js";
import { protect as auth } from "../middleware/authMiddleware.js";

const router = express.Router();


router.post("/", auth, addCgpa); // Add GPA
router.get("/", auth, getCgpa); // Fetch GPA + CGPA


// Update semester GPA by _id
router.put("/:id", auth, updateSemester);

// Delete semester GPA by _id
router.delete("/:id", auth, deleteSemester); // 👈 New delete route

export default router;
