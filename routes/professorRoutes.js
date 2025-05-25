const express = require("express");

const router = express.Router();

const professorController = require("../controllers/professorController");
const authController = require("../controllers/authController");

router.use(authController.protect);

router.post("/assign-module", professorController.assignModuleToProfessor);
router.post("/assign-mark", professorController.assignMarkToStudent);

module.exports = router;