const Certificate = require("../models/Certificate");
const User = require("../models/User");
const AppError = require("../utils/AppError");
exports.createCertificate = async (req, res, next) => {
  try {
    const { studentId } = req.body;
    if (!req.file) {
      return next(new AppError("Image is required", 400));
    }

    if (!studentId) {
      return next(new AppError("studentId is required", 400));
    }

    const hasCertificate = await Certificate.findOne({ student: studentId });

    if (hasCertificate) {
      return next(new AppError("This student already has a certificate", 400));
    }

    const student = await User.findById(studentId);

    let imagePath = req.file.path;

    imagePath = imagePath.slice(8);

    console.log(imagePath);

    const certificate = new Certificate({
      student,
      image: imagePath,
    });

    await certificate.save();

    res.status(201).json({
      message: "Certificate created successfully",
      certificate,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating certificate",
      error: error.message,
    });
  }
};
