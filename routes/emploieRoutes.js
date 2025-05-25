const express = require("express");
const router = express.Router();
const emploieController = require("./../controllers/emploieController");
const authController = require("./../controllers/authController");

const multer = require("multer");
const path = require("path");

// Set up multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/emploies/");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"), false);
    }
  },
});
const upload = multer({ storage: storage });

router.post(
  "/createEmploie",
  upload.single("image"),
  emploieController.createEmploie
);

router.get(
  "/getUserEmploie",
  authController.protect,
  emploieController.getUserEmploie
);

module.exports = router;
