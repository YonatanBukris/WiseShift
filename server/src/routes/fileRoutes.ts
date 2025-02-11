import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router.get("/:filename", (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, "../../uploads", filename);
    console.log("Trying to serve file:", filePath);

    if (!filename) {
      return res.status(400).json({
        success: false,
        message: "No filename provided",
      });
    }

    // Get the original file name from the database or from the query
    const originalName = (req.query.name as string) || filename;

    // Set Content-Disposition to 'inline' to open in browser
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${encodeURIComponent(originalName)}"`
    );

    // Set Content-Type based on file extension
    const ext = path.extname(originalName).toLowerCase();
    const mimeTypes: Record<string, string> = {
      ".pdf": "application/pdf",
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".docx":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ".doc": "application/msword",
      ".xls": "application/vnd.ms-excel",
      ".xlsx":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ".ppt": "application/vnd.ms-powerpoint",
      ".pptx":
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    };

    if (mimeTypes[ext]) {
      res.setHeader("Content-Type", mimeTypes[ext]);
    }

    res.sendFile(filePath, (err) => {
      if (err) {
        console.error("Error sending file:", err);
        res.status(404).json({
          success: false,
          message: "File not found",
          error: err.message,
        });
      }
    });
  } catch (error) {
    console.error("Error in file route:", error);
    res.status(500).json({
      success: false,
      message: "Error serving file",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
