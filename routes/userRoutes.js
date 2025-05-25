const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");
const studentController = require("./../controllers/studentController");
const express = require("express");
const router = express.Router();

// SIGNUP
router.post("/signup", authController.signup);
// LOGIN
router.post("/login", authController.login);
// LOGOUT
router.post("/logout", authController.logout);
// RESET PASSWORD
router.post("/reset-password", authController.resetPassword);
router.use(authController.protect);

// USERS
// GET ALL USERS
router.get("/allusers", userController.getAllUsers);
// DELETE ALL USERS
router.delete("/deleteAllUsers", userController.deleteAllUsers);
// DELETE A USER
router.delete("/deleteUser/:id", userController.deleteUser);
// MODIFY A USER
router.patch("/modifyUser/:id", userController.modifyUser);

// STUDENTS
router.get("/allstudents", studentController.getAllStudents);

module.exports = router;
