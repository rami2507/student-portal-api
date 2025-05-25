const express = require("express");
const router = express.Router();
const moduleController = require("../controllers/moduleController");
const authController = require("../controllers/authController");

router.use(authController.protect);

router.post("/create-module", moduleController.createModule);
router.get("/get-all-modules", moduleController.getAllModules);
router.get("/get-module-by-id/:id", moduleController.getModuleById);

module.exports = router;
