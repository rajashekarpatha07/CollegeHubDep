// Core modules
import path from "path";
import { fileURLToPath } from "url";

// External packages
import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import methodOverride from "method-override";
import rateLimit from "express-rate-limit";

// Routes
import studentRoutes from "./src/routes/student.route.js";
import facultyRoutes from "./src/routes/faculty.route.js";
import notesRoutes from "./src/routes/notes.route.js";
import noticesRoutes from "./src/routes/notices.route.js";
import questionPaperRoutes from "./src/routes/questionpaper.route.js";

//view routes
import viewRoutes from "./src/routes/view.route.js";

// Middleware
// import { verifyStudent, verifyFaculty } from "./src/middlewares/auth.js";
import { errorMiddleware } from "./src/middlewares/error.middleware.js";
import { cleanupOnError } from "./src/middlewares/multer.middleware.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

process.env.UPLOADTHING_TOKEN = process.env.UPLOADTHING_TOKEN || 'sk_live_...';

// Rate Limiters
const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: 'fail', message: 'Too many login attempts. Try after 15 mins.' }
});

const apiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: 'fail', message: 'Too many requests. Try after 10 mins.' }
});

// Set view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware Setup
app.use(session({
  secret: process.env.SESSION_SECRET || 'collegehub-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV === 'production', maxAge: 86400000 }
}));

app.use((req, res, next) => {
  res.locals.error = req.query.error || null;
  next();
});

app.use((req, res, next) => {
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("X-Content-Type-Options", "nosniff");
  if (process.env.NODE_ENV === 'production') res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});

app.use(cors({
  origin: (origin, cb) => {
    const allowedOrigins = [
      'http://localhost:3000', 'http://localhost:30001', 'http://127.0.0.1:5173',
      'https://college-hub-frontend.vercel.app', 'https://college-hub-rajas.vercel.app',
      'https://college-hub.onrender.com'
    ];
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV === 'production') cb(null, true);
    else cb(new Error('Blocked by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token']
}));

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(methodOverride('_method'));
app.use(cookieParser());

// Rate limiters
app.use("/api/v1", apiLimiter);
["/api/v1/students/login", "/api/v1/students/register", "/api/v1/faculty/login", "/api/v1/faculty/register"]
  .forEach(route => app.use(route, loginRateLimiter));

// Health routes
app.get(["/health", "/api/health"], (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Healthy",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date()
  });
});

// Static view routes
app.use("/", viewRoutes);

// API routes
app.use("/api/v1/students", studentRoutes);
app.use("/api/v1/faculty", facultyRoutes);
app.use("/api/v1/notes", notesRoutes);
app.use("/api/v1/notices", noticesRoutes);
app.use("/api/v1/questionpaper", questionPaperRoutes);

// Fallback 404 handler
app.use("*", (req, res) => {
  const redirects = {
    '/api/v1/students/getquestionpapers': '/questionpapers',
    '/api/v1/students/getnotices': '/notices',
    '/api/v1/students/getnotes': '/notes',
  };

  const redirectTo = redirects[req.originalUrl];
  if (redirectTo) return res.redirect(redirectTo);

  if (req.accepts('html')) {
    return res.status(404).send(`<!DOCTYPE html><html><head><title>404</title><style>body{font-family:sans-serif;text-align:center;padding:50px}</style></head><body><h1>404 - Page Not Found</h1><p>Page not found.</p></body></html>`);
  }

  res.status(404).json({ status: "fail", message: `Can't find ${req.originalUrl}` });
});

app.use(cleanupOnError);
app.use(errorMiddleware);

app.use('/tmp/uploads', express.static(path.join(__dirname, 'tmp', 'uploads')));

process.on('uncaughtException', err => {
  console.error('UNCAUGHT EXCEPTION!', err);
  process.exit(1);
});

process.on('unhandledRejection', err => {
  console.error('UNHANDLED REJECTION!', err);
  process.exit(1);
});

export default app;
