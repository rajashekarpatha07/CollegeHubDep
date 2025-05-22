import session from "express-session";

export const sessionConfig = session({
  secret: process.env.SESSION_SECRET || "collegehub-secret-key",
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    maxAge: 86400000, // 1 day
  },
});