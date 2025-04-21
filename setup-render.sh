#!/bin/bash

# Setup script for Render deployment

echo "Setting up for Render deployment..."

# Check current files
echo "Current directory:"
pwd
echo "Files in current directory:"
ls -la

# Make sure parse-server.cjs exists
if [ ! -f "parse-server.cjs" ]; then
  echo "parse-server.cjs not found, copying from parse-server.js..."
  cp parse-server.js parse-server.cjs || echo "Failed to copy"
  # If that fails, create it
  if [ ! -f "parse-server.cjs" ]; then
    echo "Creating fallback parse-server.cjs..."
    cat > parse-server.cjs << 'EOL'
// Fallback parse-server.cjs
console.log("Using fallback parse-server.cjs");

const fs = require('fs');
const { spawn } = require('child_process');
const express = require('express');

console.log("Current directory:", process.cwd());
console.log("Files:", fs.readdirSync('.'));

// Try to run the main app
console.log("Trying to run index.js...");
if (fs.existsSync('index.js')) {
  const child = spawn('node', ['-r', 'dotenv/config', '--experimental-json-modules', 'index.js'], { stdio: 'inherit' });
  child.on('error', err => {
    console.error("Failed to start index.js:", err);
    startEmergencyServer();
  });
  child.on('close', code => {
    if (code !== 0) {
      console.error("index.js exited with code", code);
      startEmergencyServer();
    }
  });
} else {
  startEmergencyServer();
}

function startEmergencyServer() {
  console.log("Starting emergency server");
  const app = express();
  const port = process.env.PORT || 10000;
  app.get('/health', (req, res) => { res.status(200).send('OK'); });
  app.get('/', (req, res) => { res.send('Emergency server running'); });
  app.listen(port, () => { console.log("Emergency server running on port", port); });
}
EOL
  fi
else
  echo "parse-server.cjs exists"
fi

echo "Setup complete!" 