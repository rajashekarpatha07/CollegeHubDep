// ES Module entry point for Render
// This file is specifically required because Render looks for parse-server.js

console.log("=== Starting parse-server.js ===");
console.log("Node version:", process.version);

// Basic dependencies 
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { spawn } from 'child_process';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Display environment info
console.log("Current directory:", process.cwd());
console.log("Environment:", process.env.NODE_ENV);
console.log("PORT:", process.env.PORT);

// List all files to help debug
console.log("\nListing directory contents:");
try {
  const files = fs.readdirSync('.');
  console.log(files);
} catch (err) {
  console.error("Error listing directory:", err);
}

// Try to start the main app
console.log("\nAttempting to run the main application...");

// Define the possible entry points in order of preference
const entryPoints = [
  {file: 'index.js', args: ['-r', 'dotenv/config', '--experimental-json-modules', 'index.js']},
  {file: 'server.js', args: ['-r', 'dotenv/config', '--experimental-json-modules', 'server.js']},
  {file: 'start.js', args: ['-r', 'dotenv/config', '--experimental-json-modules', 'start.js']},
  {file: 'parse-server.cjs', args: ['parse-server.cjs']},
  {file: 'index.cjs', args: ['index.cjs']},
  {file: 'start-render.js', args: ['start-render.js']},
  {file: 'simple-server.js', args: ['simple-server.js']}
];

// Find the first available entry point
let entryPoint = null;
for (const point of entryPoints) {
  if (fs.existsSync(point.file)) {
    entryPoint = point;
    console.log(`Found entry point: ${point.file}`);
    break;
  }
}

if (entryPoint) {
  console.log(`Starting with ${entryPoint.file}...`);
  try {
    // Run with child process to handle modules correctly
    const child = spawn('node', entryPoint.args, { 
      stdio: 'inherit',
      env: process.env
    });
    
    child.on('error', (err) => {
      console.error(`Failed to start ${entryPoint.file}:`, err);
      startEmergencyServer();
    });
    
    child.on('close', (code) => {
      console.log(`${entryPoint.file} process exited with code ${code}`);
      if (code !== 0) {
        startEmergencyServer();
      }
    });
  } catch (err) {
    console.error(`Error launching ${entryPoint.file}:`, err);
    startEmergencyServer();
  }
} else {
  console.error("No entry point found!");
  startEmergencyServer();
}

// Emergency server as last resort
async function startEmergencyServer() {
  console.log("\n=== STARTING EMERGENCY SERVER ===");
  
  try {
    // Import express dynamically
    const expressModule = await import('express');
    const express = expressModule.default;
    const app = express();
    const port = process.env.PORT || 10000;
    
    // Health check endpoint required by Render
    app.get('/health', (req, res) => {
      res.status(200).send('OK');
    });
    
    // Root endpoint with error information
    app.get('/', (req, res) => {
      res.send(`
        <html>
          <head>
            <title>College Hub - Emergency Server</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
              h1 { color: #c00; }
              pre { background: #f4f4f4; padding: 10px; border-radius: 5px; }
            </style>
          </head>
          <body>
            <h1>⚠️ College Hub - Emergency Server Running</h1>
            <p>The main application could not be started. This is an emergency server to keep the deployment alive.</p>
            <p>Please check the Render logs for details on what went wrong.</p>
          </body>
        </html>
      `);
    });
    
    app.listen(port, () => {
      console.log(`Emergency server running on port ${port}`);
    });
  } catch (err) {
    console.error('Failed to start emergency server:', err);
    process.exit(1);
  }
} 