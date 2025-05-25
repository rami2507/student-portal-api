// Assign group + section to a student

const Student = require("../models/User");
const Module = require("../models/Module");
const Mark = require("../models/Mark");

exports.assignGroupAndSection = async (req, res) => {
  try {
    const { matricule_id, group, section } = req.body;

    const student = await Student.findOne({ matricule_id });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    student.group = group;
    student.section = section;
    await student.save();

    res
      .status(200)
      .json({ message: "Group and section assigned successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error assigning group and section" });
  }
};

// Assign modules to a student
exports.assignModulesToStudent = async (req, res) => {
  try {
    const { studentId, moduleIds } = req.body;
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    const modules = await Module.find({ _id: { $in: moduleIds } });
    if (modules.length !== moduleIds.length) {
      return res.status(404).json({ message: "One or more modules not found" });
    }
    for (const module of modules) {
      student.enrolledModules.push(module._id.valueOf());
    }
    await student.save();
    res
      .status(200)
      .json({ message: "Modules assigned to student successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error assigning modules to student" });
  }
};

// Get marks for a student
exports.getMarks = async (req, res) => {
  try {
    const studentId = req.user._id.valueOf();
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    const marks = await Mark.find({ studentId }).populate("moduleId");
    res.status(200).json({ marks });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error getting marks" });
  }
};

// GET ALL STUDENTS
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find({
      role: "student",
    }).select("name");
    res.status(200).json({ students });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error getting all students" });
  }
};
