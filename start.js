// This is a simple entry point to redirect to index.js
// Useful for deployment environments that might try to run the wrong file

console.log("Starting from start.js - redirecting to index.js");
import("./index.js").catch(err => {
  console.error("Failed to import index.js:", err);
  process.exit(1);
}); 