const express = require("express");

const router = express.Router();

const authController = require("../controllers/authController");
const markController = require("../controllers/markController");

router.use(authController.protect);

router.post("/assign-marks", markController.assignMarks);

module.exports = router;