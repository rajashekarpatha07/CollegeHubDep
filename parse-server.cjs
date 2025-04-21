// CommonJS version of parse-server.js for Render deployment
console.log("Starting from parse-server.cjs - attempting to redirect to main application");

// Check for file existence
const fs = require('fs');
const path = require('path');

console.log("Current directory:", process.cwd());
console.log("Listing files in current directory:");
try {
  console.log(fs.readdirSync('.'));
} catch (err) {
  console.error("Error listing files:", err);
}

// Try running index.js via child process (most reliable)
console.log("Attempting to start application via child process...");
const { spawn } = require('child_process');

// Try all possible entry points
const possibleEntryPoints = [
  'index.js',
  'index.cjs',
  'server.js',
  'start.js',
  'app.js'
];

// Find the first available entry point
let entryPoint = null;
for (const file of possibleEntryPoints) {
  if (fs.existsSync(file)) {
    entryPoint = file;
    console.log(`Found entry point: ${file}`);
    break;
  }
}

if (!entryPoint) {
  console.error("No entry point found! Creating emergency Express server...");
  
  try {
    const express = require('express');
    const app = express();
    const port = process.env.PORT || 10000;
    
    app.get('/', (req, res) => {
      res.send("Emergency server running. No main application entry point was found.");
    });
    
    app.get('/health', (req, res) => {
      res.status(200).send("OK");
    });
    
    app.listen(port, () => {
      console.log(`Emergency server running on port ${port}`);
    });
  } catch (err) {
    console.error("Failed to create emergency server:", err);
    process.exit(1);
  }
} else {
  // Run the entry point
  console.log(`Starting ${entryPoint}...`);
  
  // Determine how to run the file
  let args = [];
  if (entryPoint.endsWith('.cjs')) {
    args = [entryPoint];
  } else {
    args = ['-r', 'dotenv/config', '--experimental-json-modules', entryPoint];
  }
  
  const child = spawn('node', args, { stdio: 'inherit' });
  
  child.on('error', (err) => {
    console.error(`Failed to start ${entryPoint}:`, err);
    process.exit(1);
  });
  
  child.on('close', (code) => {
    console.log(`${entryPoint} exited with code ${code}`);
    process.exit(code);
  });
} 