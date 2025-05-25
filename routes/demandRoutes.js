const express = require("express");
const {
  createDemand,
  rejectDemand,
  acceptDemand,
  getStudentDemands,
  getDemands,
} = require("../controllers/demandController");
const { protect } = require("../controllers/authController");
const router = express.Router();

router.use(protect);
router.post("/", createDemand);
router.post("/reject", rejectDemand);
router.post("/accept", acceptDemand);
router.get("/get-student-demands", getStudentDemands);
router.get("/get-demands", getDemands);
module.exports = router;
