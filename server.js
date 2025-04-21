// This is a simple entry point that redirects to index.js
// This file is specifically for Render deployment

console.log("Starting from server.js - redirecting to index.js");
import("./index.js").catch(err => {
  console.error("Failed to import index.js:", err);
  process.exit(1);
}); 