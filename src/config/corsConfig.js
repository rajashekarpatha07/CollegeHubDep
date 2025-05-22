// src/config/corsConfig.js
export const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:30001',
      'http://127.0.0.1:5173',
      'https://college-hub-frontend.vercel.app',
      'https://college-hub-rajas.vercel.app',
      'https://college-hub.onrender.com',
    ];

    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV === 'production') {
      callback(null, true);
    } else {
      callback(new Error('Blocked by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'],
};
