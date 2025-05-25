const Mark = require("../models/Mark");

exports.assignMarks = async (req, res) => {
    try {
        const { studentId, moduleId, mark } = req.body;
        const professorId = req.user._id.valueOf();
        const professor = await Professor.findById(professorId);
        if (!professor || professor.role !== "professor") {
            return res.status(404).json({ message: "Professor not found" });
        }
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        const module = await Module.findById(moduleId);
        if (!module) {
            return res.status(404).json({ message: "Module not found" });
        }
        if (professor.teachingModules.includes(moduleId)) {
            const createdMark = await Mark.create({ studentId, moduleId, mark });
            res.status(200).json({ message: "Marks assigned successfully", createdMark });
        } else {
            return res.status(404).json({ message: "Professor does not teach this module" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error assigning marks" });
    }
}