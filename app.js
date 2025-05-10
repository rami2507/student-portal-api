const express = require("express");
const app = express();
const userRoutes = require("./routes/userRoutes");
const globalErrorHandling = require("./controllers/errorController");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const path = require("path");
const server = require("./server");
const dotenv = require("dotenv");
const cors = require("cors");
const AppError = require("./utils/AppError");

// SERVE STATIC FILES
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static("node_modules"));

// Set security HTTP Headers
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "cdn.jsdelivr.net"], // Allow scripts from self and cdn.jsdelivr.net
      // Add more directives as needed based on your application's requirements
    },
  })
);

app.use(
  cors({
    origin: "http://localhost:4200",
    credentials: true, // if you're using cookies or headers that require credentials
  })
);

// PATH TO ENV VARS
dotenv.config({ path: "./.env" });

// PARSE USER INPUTS
app.use(express.json());
app.use(cookieParser());

// API's
app.use("/api/v1/users", userRoutes); // USER ROUTES

app.all(/.*/, (req, res, next) => {
  next(new AppError(`Invalid route: ${req.originalUrl}`, 400));
});

// GLOBAL ERROR HANDLING MIDDLEWARE
app.use(globalErrorHandling);

// HANDLE UNHANDLED REJECTIONS
process.on("unhandledRejection", (err) => {
  console.error(`Unhandled Rejection Error: ${err}`);
  server.close(() => {
    console.error("Shutting Down");
    process.exit(1);
  });
});

module.exports = app;
