import dotenv from "dotenv";

// Force dotenv to load .env using absolute path
dotenv.config({ path: "D:/PROJECTS/anna-cgpa-backend/.env" });

console.log("PORT:", process.env.PORT);
console.log("MONGO_URI:", process.env.MONGO_URI);
console.log("JWT_SECRET:", process.env.JWT_SECRET);

