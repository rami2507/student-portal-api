const AppError = require("../utils/AppError");
const asyncHandler = require("express-async-handler");
const User = require("./../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

exports.resetPassword = asyncHandler(async (req, res, next) => {
  const { matricule_id, password } = req.body;
  const user = await User.findOne({ matricule_id });
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  user.password = await bcrypt.hash(password, 12);
  await user.save();
  res.status(200).json({
    status: "success",
    message: "Password reset successfully",
  });
});

exports.signup = asyncHandler(async (req, res, next) => {
  let user = req.body;
  user.password = await bcrypt.hash(user.password, 12);
  const newUser = await User.create(user);
  // SEND RESPONSE
  res.status(201).json({
    status: "success",
    data: {
      newUser,
    },
  });
});

exports.login = asyncHandler(async (req, res, next) => {
  const { matricule_id, password } = req.body;
  if (!matricule_id || !password) {
    return next(new AppError("Please specify username and password", 404));
  }
  const user = await User.findOne({ matricule_id });
  if (!user) {
    return next(
      new AppError("Can not find a user with that matricule_id", 404)
    );
  }
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return next(new AppError("username or password is not correct", 404));
  }
  // SIGN TOKEN
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "24d",
  });
  // SEND TOKEN AS A COOKIE
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: false, // true if using HTTPS (false for localhost)
    sameSite: "Lax", // or 'None' if cross-site
  });
  // SEND RESPONSE TO CLIENT
  res.status(201).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
});

exports.protect = asyncHandler(async (req, res, next) => {
  // 1) Getting Token And Check If It's There
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token)
    return next(
      new AppError("Your are not logged in! Please login to get access", 401)
    );
  // 2) Validate token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // 3) Check If User Still Exist
  const currentUser = await User.findById(decoded.userId);
  if (!currentUser) {
    return next(
      new AppError("the user belonging to this token does no longer exist")
    );
  }
  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});

// ONLY FOR RENDERED PAGES ,, NO ERRORS
exports.isLoggedIn = asyncHandler(async (req, res, next) => {
  // 1) Getting Token And Check If It's There
  let token;
  if (req.cookies.jwt) {
    token = req.cookies.jwt;
    try {
      // 2) Validate token
      const decoded = await promisify(jwt.verify)(
        token,
        process.env.JWT_SECRET
      );
      // 3) Check If User Still Exists
      const currentUser = await User.findById(decoded.userId);
      if (!currentUser) {
        return next();
      }
      // THERE IS A LOGGED IN USER
      req.user = currentUser;
      res.locals.user = currentUser; // Optionally, store user data in locals
    } catch (err) {
      // Handle invalid or expired token
      console.error("Invalid or expired JWT token:", err);
    }
  }
  next();
});

exports.logout = asyncHandler(async (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000), // Set expiration time to 10 seconds from now
    httpOnly: true,
  });
  res.status(200).json({
    status: "success",
    message: "Your are logged out successfuly",
  });
});
