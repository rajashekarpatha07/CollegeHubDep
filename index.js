import connectDb from "./src/db/connection.db.js";
import app from "./app.js";
import net from "net";
//comment
// Function to find an available port starting from the given port
const findAvailablePort = (startPort) => {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    
    server.listen(startPort, () => {
      const port = server.address().port;
      server.close(() => {
        resolve(port);
      });
    });
    
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        // Try the next port
        console.log(`Port ${startPort} is in use, trying ${startPort + 1}...`);
        findAvailablePort(startPort + 1)
          .then(resolve)
          .catch(reject);
      } else {
        reject(err);
      }
    });
  });
};

// Handling uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

// Connect to database and start server
async function startServer() {
  try {
    await connectDb();
    console.log("DATABASE CONNECTED SUCCESSFULLY");

    // Always use the PORT environment variable, default to 10000
    // This is critical for cloud platforms like Render
    const port = process.env.PORT || 10000;
    
    // In production, use 0.0.0.0 to bind to all network interfaces
    const isProduction = process.env.NODE_ENV === 'production';
    if (isProduction) {
      app.listen(port, '0.0.0.0', () => {
        console.log(`🚀 Server running on Render on port ${port}`);
        console.log('Environment:', process.env.NODE_ENV);
        console.log('CORS_ORIGIN:', process.env.CORS_ORIGIN);
      });
      return;
    }
    
    // For local development, find an available port
    try {
      const availablePort = await findAvailablePort(port);
      app.listen(availablePort, () => {
        console.log(`🚀 Server running locally on port ${availablePort}`);
      });
    } catch (error) {
      console.log("❌ Failed to find an available port:", error);
      process.exit(1);
    }
  } catch (error) {
    console.log("❌ Database connection failed:", error);
    process.exit(1);
  }
}

startServer();

// Handling unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

