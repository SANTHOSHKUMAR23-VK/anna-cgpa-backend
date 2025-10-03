// Excel Export for all users (name/email only)
export const downloadUsersExcel = async (req, res) => {
  try {
    const users = await User.find();
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Users");

    sheet.columns = [
      { header: "Name", key: "name" },
      { header: "Email", key: "email" },
    ];

    users.forEach((user) => {
      sheet.addRow({ name: user.name, email: user.email });
    });

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=users.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ message: "Error generating Excel" });
  }
};

// PDF Export for all users (name/email only)
export const downloadUsersPDF = async (req, res) => {
  try {
    const users = await User.find();
    const doc = new PDFDocument();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=users.pdf");

    doc.pipe(res);
    users.forEach((user) => {
      doc.text(`${user.name} - ${user.email}`);
    });
    doc.end();
  } catch (error) {
    res.status(500).json({ message: "Error generating PDF" });
  }
};
// Export ALL users with their CGPA records (Excel)
export const exportAllUsersExcel = async (req, res) => {
  try {
    const users = await User.find().select("name email").lean();

    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Anna CGPA App";

    for (const user of users) {
      const records = await Cgpa.find({ user: user._id }).sort("semester").lean();

      const sheet = workbook.addWorksheet(user.name || "Unnamed User");
      sheet.columns = [
        { header: "Semester", key: "semester", width: 12 },
        { header: "GPA", key: "gpa", width: 10 },
        { header: "Credits", key: "credits", width: 12 },
      ];

      sheet.addRow(["User:", `${user.name} <${user.email}>`] );
      sheet.addRow([]);
      sheet.addRow(["Semester", "GPA", "Credits"]);

      records.forEach(r => {
        sheet.addRow([r.semester, r.gpa, r.credits]);
      });
    }

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=all-users-cgpa.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error("exportAllUsersExcel error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Export ALL users with their CGPA records (PDF)
export const exportAllUsersPdf = async (req, res) => {
  try {
    const users = await User.find().select("name email").lean();

    const doc = new PDFDocument({ size: "A4", margin: 40 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=all-users-cgpa.pdf");

    doc.pipe(res);

    doc.fontSize(20).text("All Users CGPA Report", { align: "center" }).moveDown();

    for (const user of users) {
      doc.fontSize(14).text(`User: ${user.name} <${user.email}>`, { underline: true }).moveDown(0.5);

      const records = await Cgpa.find({ user: user._id }).sort("semester").lean();

      if (!records.length) {
        doc.text("No semester records found.").moveDown();
      } else {
        records.forEach(r => {
          doc.text(`Semester ${r.semester} — GPA: ${r.gpa} — Credits: ${r.credits}`);
        });
        doc.moveDown();
      }

      doc.moveDown();
    }

    doc.end();
  } catch (err) {
    console.error("exportAllUsersPdf error:", err);
    res.status(500).json({ message: err.message });
  }
};
// src/controllers/userController.js
import User from "../models/userModel.js";
import Cgpa from "../models/Cgpa.js";
import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";

/**
 * GET /api/admin/users
 * Admin-only: returns all users (excluding passwords)
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").lean();
    res.json(users);
  } catch (err) {
    console.error("getAllUsers error:", err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET /api/admin/export/excel/:userId
 * Admin-only: generate and download Excel for the given userId
 */
export const exportUserExcel = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select("name email").lean();
    if (!user) return res.status(404).json({ message: "User not found" });

    const records = await Cgpa.find({ user: userId }).sort("semester").lean();

    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Anna CGPA App";
    const sheet = workbook.addWorksheet("CGPA Records");

    sheet.columns = [
      { header: "Semester", key: "semester", width: 12 },
      { header: "GPA", key: "gpa", width: 10 },
      { header: "Credits", key: "credits", width: 12 },
    ];

    // Add a header row with user info
    sheet.addRow([]);
    sheet.addRow([`User: ${user.name} <${user.email}>`]);
    sheet.addRow([`Generated on: ${new Date().toLocaleString()}`]);
    sheet.addRow([]); // empty row
    sheet.addRow(); // ensure header row index stable
    // Now add column headers and rows
    sheet.addRow(["Semester", "GPA", "Credits"]);
    records.forEach(r => sheet.addRow([r.semester, r.gpa, r.credits]));

    // Set response headers
    const filename = `cgpa-${user.name.replace(/\s+/g, "_")}-${userId}.xlsx`;
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    // Stream workbook to response
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error("exportUserExcel error:", err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET /api/admin/export/pdf/:userId
 * Admin-only: generate and download PDF for the given userId
 */
export const exportUserPdf = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select("name email").lean();
    if (!user) return res.status(404).json({ message: "User not found" });

    const records = await Cgpa.find({ user: userId }).sort("semester").lean();

    const doc = new PDFDocument({ size: "A4", margin: 40 });
    const filename = `cgpa-${user.name.replace(/\s+/g, "_")}-${userId}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    // Pipe PDF to HTTP response
    doc.pipe(res);

    doc.fontSize(18).text("CGPA Report", { align: "center" }).moveDown();
    doc.fontSize(12).text(`User: ${user.name} <${user.email}>`);
    doc.text(`Generated on: ${new Date().toLocaleString()}`).moveDown();

    if (!records.length) {
      doc.text("No semester records found.", { italic: true });
    } else {
      records.forEach(r => {
        doc.text(`Semester ${r.semester} — GPA: ${r.gpa} — Credits: ${r.credits}`);
      });
    }

    doc.end();
  } catch (err) {
    console.error("exportUserPdf error:", err);
    res.status(500).json({ message: err.message });
  }
};
