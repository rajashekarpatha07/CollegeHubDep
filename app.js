import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import studentRoutes from "./src/routes/student.route.js";
import facultyRoutes from "./src/routes/faculty.route.js";
import notesRoutes from "./src/routes/notes.route.js";
import noticesRoutes from "./src/routes/notices.route.js";
import questionPaperRoutes from "./src/routes/questionpaper.route.js";
import { verifyStudent } from "./src/middlewares/auth.js";
import morgan from "morgan";

const app = express();
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs"); // <== tells Express to use EJS
app.set("views", path.join(__dirname, "views")); // <== path to your views folder

// Set security HTTP headers
app.use((req, res, next) => {
  res.setHeader("X-XSS-Protection", "1; mode=block");
  next();
});

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // In production, allow any origin (since we'll have multiple Render deployments)
    if (process.env.NODE_ENV === 'production') {
      callback(null, true);
    } else {
      // For development, use allowed origins list
      const allowedOrigins = [
        'http://localhost:3000',
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'https://college-hub-frontend.vercel.app',
        'https://college-hub-rajas.vercel.app',
        // Add Render domains
        'https://college-hub.onrender.com',
        'https://*.onrender.com'
      ];
      
      // Allow requests with no origin (like mobile apps, curl requests)
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.log('CORS blocked origin:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token']
};

app.use(cors(corsOptions));

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// Cookie parser
app.use(cookieParser());

// Health check route for Railway
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Server is healthy",
        environment: process.env.NODE_ENV || "development",
        timestamp: new Date()
    });
});

// API health check route
app.get("/api/health", (req, res) => {
    res.status(200).json({
        status: "success",
        message: "API is healthy",
        environment: process.env.NODE_ENV || "development",
        timestamp: new Date()
    });
});

// View routes
app.get("/", (req, res) => {
    res.redirect("/StudentLogin");
});

app.get("/StudentLogin", (req, res) => {
    res.render("StudentLogin");
});

app.get("/StudentRegister", (req, res) => {
    res.render("StudentRegister");
});

// Dashboard route
app.get("/dashboard", verifyStudent, (req, res) => {
    res.render("dashboard", { student: req.student });
});

// API routes
app.use("/api/v1/students", studentRoutes);
app.use("/api/v1/faculty", facultyRoutes);   
app.use("/api/v1/notes", notesRoutes);
app.use("/api/v1/notices", noticesRoutes);
app.use("/api/v1/questionpaper", questionPaperRoutes);

// Handle undefined Routes
app.use("*", (req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

export default app;