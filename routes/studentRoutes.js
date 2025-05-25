const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");
const authController = require("../controllers/authController");

router.post("/assign-modules", studentController.assignModulesToStudent);
router.post("/assign-group-and-section", studentController.assignGroupAndSection);

router.use(authController.protect);

router.get("/get-marks", studentController.getMarks);

module.exports = router;

