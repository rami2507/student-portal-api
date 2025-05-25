const Emploie = require("./../models/Emploie");
const AppError = require("./../utils/AppError");
const User = require("./../models/User");

exports.createEmploie = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new AppError("Image is required", 400));
    }
    let imagePath = req.file.path;

    imagePath = imagePath.slice(8);

    const emploie = await Emploie.create({
      groupe: req.body.groupe,
      image: imagePath,
    });
    res.status(200).json({ emploie });
  } catch (error) {
    console.log(error);
  }
};

exports.getUserEmploie = async (req, res, next) => {
  try {
    const userId = req.user._id.valueOf();
    const student = await User.findById(userId);
    const userGroup = student.group;
    const emploie = await Emploie.findOne({ groupe: userGroup });
    if (!emploie) {
      return next(new AppError("No emploie found", 404));
    }
    res.status(200).json({ emploie });
  } catch (error) {
    console.log(error);
  }
};
