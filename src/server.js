
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import cgpaRoutes from "./routes/cgpaRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();
connectDB();



const app = express();
app.use(cors({
  origin: "*", // or restrict to your Netlify domain
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to Anna University CGPA Calculator Backend 🚀");
});


app.use("/api/auth", authRoutes);
app.use("/api/cgpa", cgpaRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);

