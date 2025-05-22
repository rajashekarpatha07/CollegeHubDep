// src/middlewares/securityHeaders.js
export const securityHeaders = (req, res, next) => {
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("X-Content-Type-Options", "nosniff");

  if (process.env.NODE_ENV === "production") {
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }

  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
};
