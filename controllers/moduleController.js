// Create a module

const Module = require("../models/Module");
const User = require("../models/User");


exports.createModule = async (req, res) => {
    try {
        const professorId  = req.user._id.valueOf();
        const { name, code } = req.body;
        const professor = await User.findById(professorId);
        console.log(professor);
        if (!professor || professor.role !== "professor") {
            return res.status(404).json({ message: "Professor not found" });
        }
        const module = await Module.create({ name, code, professorId });
        res.status(201).json({ message: "Module created successfully", module });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error creating module" });
    }
}

// Get all modules
exports.getAllModules = async (req, res) => {
    try {
        const modules = await Module.find();
        res.status(200).json({ message: "Modules fetched successfully", modules });
    } catch (error) {
        res.status(500).json({ message: "Error fetching modules" });
    }
}

// Get a module by id
exports.getModuleById = async (req, res) => {
    try {
        const { id } = req.params;
        const module = await Module.findById(id);
        if (!module) {
            return res.status(404).json({ message: "Module not found" });
        }
        res.status(200).json({ message: "Module fetched successfully", module });
    } catch (error) {
        res.status(500).json({ message: "Error fetching module" });
    }
}