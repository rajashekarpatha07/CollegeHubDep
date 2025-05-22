// Core modules
import path from "path";
import { fileURLToPath } from "url";

// External packages
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import methodOverride from "method-override";

// Routes
import studentRoutes from "./src/routes/student.route.js";
import facultyRoutes from "./src/routes/faculty.route.js";
import notesRoutes from "./src/routes/notes.route.js";
import noticesRoutes from "./src/routes/notices.route.js";
import questionPaperRoutes from "./src/routes/questionpaper.route.js";
import viewRoutes from "./src/routes/view.route.js";

// Middleware
import { errorMiddleware} from "./src/middlewares/error.middleware.js";
import { cleanupOnError } from "./src/middlewares/multer.middleware.js";

// Configs
import setupRateLimits from "./src/config/rateLimitConfig.js";
import { sessionConfig } from "./src/config/sessionConfig.js";
import { corsOptions } from "./src/config/corsConfig.js";
import { securityHeaders } from "./src/config/SecurityHeaders.js";

import  setupNotFoundHandler  from "./src/loaders/notFoundHandler.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Global Middlewares
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(methodOverride('_method'));
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(securityHeaders);
app.use(sessionConfig);
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

// Rate Limiters
setupRateLimits(app);

// Health Check
app.get(["/health", "/api/health"], (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Healthy",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date()
  });
});

// Routes
app.use("/", viewRoutes);
app.use("/api/v1/students", studentRoutes);
app.use("/api/v1/faculty", facultyRoutes);
app.use("/api/v1/notes", notesRoutes);
app.use("/api/v1/notices", noticesRoutes);
app.use("/api/v1/questionpaper", questionPaperRoutes);

// Fallback 404
setupNotFoundHandler(app);

// Error Handling
app.use(cleanupOnError);
app.use(errorMiddleware);

// Process Events
process.setMaxListeners(20); // Increase max listeners to avoid warning

process.on('uncaughtException', err => {
  console.error('UNCAUGHT EXCEPTION!', err);
  process.exit(1);
});

process.on('unhandledRejection', err => {
  console.error('UNHANDLED REJECTION!', err);
  process.exit(1);
});

export default app;