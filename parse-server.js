// Redirection file for Render deployment
// This file exists only because Render is trying to run parse-server.js

console.log("Starting from parse-server.js - redirecting to index.js");
console.log("This file exists only to handle Render's attempt to run parse-server.js");

// Try to import the main app
import("./index.js").catch(err => {
  console.error("Failed to import index.js from parse-server.js:", err);
  
  // Fall back to CommonJS if ESM fails
  try {
    console.log("Attempting to use CommonJS fallback...");
    require("./index.cjs");
  } catch (cjsErr) {
    console.error("CommonJS fallback also failed:", cjsErr);
    
    // Last resort: try to run a simple express server
    try {
      console.log("Attempting to start a minimal Express server...");
      const express = require("express");
      const app = express();
      const port = process.env.PORT || 10000;
      
      app.get("/", (req, res) => {
        res.send("Emergency server running. The main application could not be started.");
      });
      
      app.get("/health", (req, res) => {
        res.status(200).send("OK");
      });
      
      app.listen(port, () => {
        console.log(`Emergency server running on port ${port}`);
      });
    } catch (expressErr) {
      console.error("Failed to start emergency Express server:", expressErr);
      process.exit(1);
    }
  }
}); 