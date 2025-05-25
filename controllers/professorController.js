// Assign a module to a professor

const User = require("../models/User");
const Module = require("../models/Module");
const Mark = require("../models/Mark");

exports.assignModuleToProfessor = async (req, res) => {
  try {
    const professorId = req.user._id.valueOf();
    const { moduleId } = req.body;
    const professor = await Professor.findById(professorId);
    if (!professor || professor.role !== "professor") {
      return res.status(404).json({ message: "Professor not found" });
    }
    const module = await Module.findById(moduleId);
    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }
    // Prevent duplicate assignment
    if (!professor.teachingModules.includes(moduleId)) {
      professor.teachingModules.push(moduleId);
      await professor.save();
    }
    res
      .status(200)
      .json({ message: "Module assigned to professor successfully", module });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error assigning module to professor", error });
  }
};

// Assign a mark to a student

exports.assignMarkToStudent = async (req, res) => {
  try {
    const professorId = req.user._id.valueOf();
    const professor = await User.findById(professorId);
    if (!professor || professor.role !== "professor") {
      return res.status(404).json({ message: "Login as a professor first" });
    }
    const { studentId, mark } = req.body;
    const moduleId = professor.teachingModules[0];
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    const module = await Module.findById(moduleId);
    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }
    const { markType } = req.body;
    if (professor.teachingModules.includes(moduleId)) {
      const createdMark = await Mark.create({
        studentId,
        moduleId,
        mark,
        markType,
      });
      res.status(200).json({
        message: "Mark assigned to student successfully",
        createdMark,
      });
    } else {
      return res
        .status(404)
        .json({ message: "Professor does not teach this module" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error assigning mark to student", error });
  }
};
