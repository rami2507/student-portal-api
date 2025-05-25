const express = require("express");
const app = express();
const userRoutes = require("./routes/userRoutes");
const studentRoutes = require("./routes/studentRoutes");
const moduleRoutes = require("./routes/moduleRoutes");
const professorRoutes = require("./routes/professorRoutes");
const marksRoutes = require("./routes/markRoutes");
const certificateRoutes = require("./routes/certificateRoutes");
const demandRoutes = require("./routes/demandRoutes");
const emploieRoutes = require("./routes/emploieRoutes");
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
app.use(express.static(path.join(__dirname, "uploads")));
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
app.use("/api/v1/students", studentRoutes); // STUDENT ROUTES
app.use("/api/v1/modules", moduleRoutes); // MODULE ROUTES
app.use("/api/v1/professors", professorRoutes); // PROFESSOR ROUTES
app.use("/api/v1/marks", marksRoutes); // Marks ROUTES
app.use("/api/v1/certificates", certificateRoutes); // Certificate ROUTES
app.use("/api/v1/demandes", demandRoutes); // Demande ROUTES
app.use("/api/v1/emploies", emploieRoutes); // Emploie ROUTES
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
