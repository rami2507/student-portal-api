const Demand = require("../models/Demand");
const User = require("../models/User");
const AppError = require("../utils/AppError");
const Certificate = require("../models/Certificate");

exports.createDemand = async (req, res, next) => {
  try {
    const studentId = req.user._id;

    if (!studentId) {
      return next(new AppError("studentId is required", 400));
    }

    const student = await User.findById(studentId);
    if (!student) {
      return next(new AppError("Student not found", 400));
    }

    if (student.role !== "student") {
      return next(new AppError("Only students can create demands", 400));
    }

    const demand = new Demand({
      student,
      status: "pending",
    });

    await demand.save();

    res.status(201).json({
      message: "Demand created successfully",
      demand,
    });
  } catch (error) {
    next(error);
  }
};

exports.rejectDemand = async (req, res, next) => {
  try {
    const { demandId } = req.body;
    if (!demandId) {
      return next(new AppError("demandId is required", 400));
    }

    const demand = await Demand.findById(demandId);
    if (!demand) {
      return next(new AppError("Demand not found", 400));
    }

    demand.status = "rejected";
    await demand.save();

    res.status(200).json({
      message: "Demand rejected successfully",
      demand,
    });
  } catch (error) {
    next(error);
  }
};

exports.acceptDemand = async (req, res, next) => {
  try {
    const { demandId } = req.body;
    if (!demandId) {
      return next(new AppError("demandId is required", 400));
    }

    const demand = await Demand.findById(demandId);
    if (!demand) {
      return next(new AppError("Demand not found", 400));
    }

    const certificate = await Certificate.findOne({
      student: demand.student,
    });

    if (!certificate) {
      demand.status = "rejected";
      await demand.save();
      return next(
        new AppError("Certificate not found and demand rejected", 400)
      );
    }

    demand.status = "approved";
    demand.image = certificate.image;
    await demand.save();

    res.status(200).json({
      message: "Demand accepted successfully",
      demand,
    });
  } catch (error) {
    next(error);
  }
};

exports.getStudentDemands = async (req, res, next) => {
  try {
    const studentId = req.user._id;
    if (!studentId) {
      return next(new AppError("studentId is required", 400));
    }

    const demands = await Demand.find({ student: studentId });
    if (!demands) {
      return next(new AppError("Demands not found", 400));
    }

    res.status(200).json({
      message: "Demands fetched successfully",
      demands,
    });
  } catch (error) {
    next(error);
  }
};

exports.getDemands = async (req, res, next) => {
  try {
    const demands = await Demand.find({
      status: "pending",
    }).populate({
      path: "student",
      select: "name group section -_id",
    });
    if (!demands) {
      return next(new AppError("Demands not found", 400));
    }

    res.status(200).json({
      message: "Demands fetched successfully",
      demands,
    });
  } catch (error) {
    next(error);
  }
};
