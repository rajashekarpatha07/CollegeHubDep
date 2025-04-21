// Simple CommonJS starter script for Render
// This file is written in CommonJS so there's no confusion about module systems

console.log('Starting Render deployment with start-render.js');

// Check what files are available
const fs = require('fs');
const path = require('path');

console.log('Current directory:', process.cwd());
console.log('Node version:', process.version);
console.log('Listing directory contents:');
try {
  console.log(fs.readdirSync('.'));
} catch (err) {
  console.error('Error listing directory:', err);
}

// Try to start the application directly
console.log('Attempting to start the application...');

try {
  // For direct ESM import, we need to use dynamic import
  console.log('Attempting to import index.js with dynamic import...');
  
  // First check if index.js exists
  if (fs.existsSync('./index.js')) {
    console.log('index.js found, starting with child process...');
    
    // Use child process as the most reliable method
    const { spawn } = require('child_process');
    const child = spawn('node', [
      '-r', 
      'dotenv/config', 
      '--experimental-json-modules', 
      'index.js'
    ], { 
      stdio: 'inherit',
      env: process.env
    });
    
    child.on('error', (err) => {
      console.error('Failed to start child process:', err);
      startFallbackServer();
    });
    
    child.on('close', (code) => {
      console.log(`Child process exited with code ${code}`);
      if (code !== 0) {
        startFallbackServer();
      }
    });
  } else {
    console.error('index.js not found!');
    startFallbackServer();
  }
} catch (err) {
  console.error('Error starting application:', err);
  startFallbackServer();
}

// Fallback server function
function startFallbackServer() {
  console.log('Starting fallback Express server...');
  
  try {
    const express = require('express');
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