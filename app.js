import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import session from "express-session";
import methodOverride from "method-override";
import studentRoutes from "./src/routes/student.route.js";
import facultyRoutes from "./src/routes/faculty.route.js";
import notesRoutes from "./src/routes/notes.route.js";
import noticesRoutes from "./src/routes/notices.route.js";
import questionPaperRoutes from "./src/routes/questionpaper.route.js";
import { verifyStudent, verifyFaculty } from "./src/middlewares/auth.js";
import { errorMiddleware } from "./src/middlewares/error.middleware.js";
import { cleanupOnError } from "./src/middlewares/multer.middleware.js";
import morgan from "morgan";
import rateLimit from 'express-rate-limit';

// Set UploadThing API key - make sure to use the raw key, not the encoded version
process.env.UPLOADTHING_TOKEN = 'sk_live_78ff44f7c2f2d20e1fc13b7d4271e3dc4252d325812ee020bdd9c8c603fe44ef';

const app = express();
import path from "path";
import { fileURLToPath } from "url";

// Rate limiting for sensitive routes
const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 login attempts per window
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    status: 'fail',
    message: 'Too many login attempts, please try again after 15 minutes',
  }
});

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'fail',
    message: 'Too many requests from this IP, please try again after 10 minutes',
  }
});

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

// Set security HTTP headers
app.use((req, res, next) => {
  // Protect against XSS attacks
  res.setHeader("X-XSS-Protection", "1; mode=block");
  
  // Prevent clickjacking
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  
  // Disable MIME type sniffing
  res.setHeader("X-Content-Type-Options", "nosniff");
  
  // Strict Transport Security (in production)
  if (process.env.NODE_ENV === 'production') {
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }
  
  // Referrer policy
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

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

// Method override middleware
app.use(methodOverride('_method'));

// Cookie parser
app.use(cookieParser());

// Apply general API rate limiter to all API routes
app.use("/api/v1", apiLimiter);

// Apply login/register specific rate limiter to sensitive routes
app.use("/api/v1/students/login", loginRateLimiter);
app.use("/api/v1/students/register", loginRateLimiter);
app.use("/api/v1/faculty/login", loginRateLimiter);
app.use("/api/v1/faculty/register", loginRateLimiter);

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
    res.render("home");
});

app.get("/StudentLogin", (req, res) => {
    res.render("StudentLogin");
});

app.get("/StudentRegister", (req, res) => {
    res.render("StudentRegister");
});

// Faculty login route
app.get("/FacultyLogin", (req, res) => {
    res.render("FacultyLogin");
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

// Faculty Dashboard route
app.get("/faculty-dashboard", verifyFaculty, (req, res) => {
    res.render("faculty-dashboard", { faculty: req.faculty });
});

// Upload Notes route
app.get("/upload-notes", verifyFaculty, (req, res) => {
    res.render("upload-notes", { 
        faculty: req.faculty,
        success: req.query.success || null,
        error: req.query.error || null
    });
});

// Manage Notes route
app.get("/manage-notes", verifyFaculty, (req, res) => {
    res.redirect("/api/v1/notes/manage");
});

// Upload Question Papers route
app.get("/upload-question-papers", verifyFaculty, (req, res) => {
    res.render("upload-question-papers", { 
        faculty: req.faculty,
        success: req.query.success || null,
        error: req.query.error || null
    });
});

// Manage Question Papers route
app.get("/manage-question-papers", verifyFaculty, (req, res) => {
    res.redirect("/api/v1/questionpaper/manage");
});

// Upload Notices route
app.get("/upload-notices", verifyFaculty, (req, res) => {
    res.render("upload-notices", { 
        faculty: req.faculty,
        success: req.query.success || null,
        error: req.query.error || null
    });
});

// Manage Notices route
app.get("/manage-notices", verifyFaculty, (req, res) => {
    res.redirect("/api/v1/notices/manage");
});

// PDF test page route (development only)
app.get("/test-pdf", (req, res) => {
    res.render("test-pdf");
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

// Add cleanup middleware before the global error handler
app.use(cleanupOnError);

// Global error handler
app.use(errorMiddleware);

// Set up static file serving for uploads
app.use('/tmp/uploads', express.static(path.join(__dirname, 'tmp', 'uploads')));

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