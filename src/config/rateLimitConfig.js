// src/config/rateLimitConfig.js
import rateLimit from "express-rate-limit";

export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: "fail", message: "Too many login attempts. Try after 15 mins." },
});

export const apiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: "fail", message: "Too many requests. Try after 10 mins." },
});

export default function setupRateLimits(app) {
  app.use("/api/v1", apiLimiter);

  const authRoutes = [
    "/api/v1/students/login",
    "/api/v1/students/register",
    "/api/v1/faculty/login",
    "/api/v1/faculty/register",
  ];

  authRoutes.forEach(route => app.use(route, loginRateLimiter));
}
