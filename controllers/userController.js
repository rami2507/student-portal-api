const AppError = require("../utils/AppError");
const asyncHandler = require("express-async-handler");
const User = require("./../models/User");

// GET ALL USERS
exports.getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});

// DELETE ALL USERS
exports.deleteAllUsers = asyncHandler(async (req, res, next) => {
  await User.deleteMany();
  res.status(204).json({
    status: "success",
    message: "Users are deleted successfuly",
  });
});

// DELETE A USER
exports.deleteUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: "success",
    messgae: "user has been delete successfuly",
  });
});

// MODIFY A USER
exports.modifyUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError("No user found with that id", 404));
  }
  const updatedUser = await User.findByIdAndUpdate(user._id, req.body);
  res.status(200).json({
    status: "success",
    message: "User has been updated successfuly",
    data: {
      updatedUser,
    },
  });
});
