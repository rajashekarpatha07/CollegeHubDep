import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import session from "express-session";
import studentRoutes from "./src/routes/student.route.js";
import facultyRoutes from "./src/routes/faculty.route.js";
import notesRoutes from "./src/routes/notes.route.js";
import noticesRoutes from "./src/routes/notices.route.js";
import questionPaperRoutes from "./src/routes/questionpaper.route.js";
import { verifyStudent } from "./src/middlewares/auth.js";
import { errorMiddleware } from "./src/middlewares/error.middleware.js";
import morgan from "morgan";

const app = express();
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs"); // <== tells Express to use EJS
app.set("views", path.join(__dirname, "views")); // <== path to your views folder

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'collegehub-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Flash message middleware
app.use((req, res, next) => {
  res.locals.error = req.query.error || null;
  next();
});

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

// Health check route for Render
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

// Notes page route
app.get("/notes", verifyStudent, (req, res) => {
    res.render("notes", { student: req.student });
});

// Notices page route
app.get("/notices", verifyStudent, (req, res) => {
    res.render("notices", { student: req.student });
});

// Question Papers page route
app.get("/questionpapers", verifyStudent, (req, res) => {
    res.render("questionpapers", { student: req.student });
});

// API routes
app.use("/api/v1/students", studentRoutes);
app.use("/api/v1/faculty", facultyRoutes);   
app.use("/api/v1/notes", notesRoutes);
app.use("/api/v1/notices", noticesRoutes);
app.use("/api/v1/questionpaper", questionPaperRoutes);

// Handle undefined Routes
app.use("*", (req, res, next) => {
  // Check if this is a direct API endpoint access that should be redirected to UI
  const originalUrl = req.originalUrl;
  
  // Redirect direct API accesses to appropriate UI pages
  if (originalUrl.includes('/api/v1/students/getquestionpapers')) {
    return res.redirect('/questionpapers');
  } else if (originalUrl.includes('/api/v1/students/getnotices')) {
    return res.redirect('/notices');
  } else if (originalUrl.includes('/api/v1/students/getnotes')) {
    return res.redirect('/notes');
  }
  
  // For browsers/UI clients wanting HTML
  if (req.accepts('html')) {
    return res.status(404).send(`
      <html>
        <head>
          <title>404 - Page Not Found</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
            h1 { color: #d63031; }
            .container { max-width: 600px; margin: 0 auto; }
            .links { margin-top: 30px; }
            a { color: #3498db; text-decoration: none; margin: 0 10px; }
            a:hover { text-decoration: underline; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>404 - Page Not Found</h1>
            <p>The page you're looking for doesn't exist or has been moved.</p>
            <div class="links">
              <a href="/dashboard">Dashboard</a>
              <a href="/questionpapers">Question Papers</a>
              <a href="/notes">Notes</a>
              <a href="/notices">Notices</a>
            </div>
          </div>
        </body>
      </html>
    `);
  }
  
  // For API clients
  res.status(404).json({
    status: "fail",
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

// Global error handler
app.use(errorMiddleware);

export default app;

// Handling uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

// Handling unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});