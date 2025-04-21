// CommonJS entry point for compatibility
console.log("Starting from index.cjs - attempting to run index.js with ESM...");

// Check for file existence
const fs = require('fs');
if (!fs.existsSync('./index.js')) {
  console.error("ERROR: index.js file not found!");
  console.log("Listing directory contents:");
  console.log(fs.readdirSync('.'));
  process.exit(1);
}

// Try to run via child process
const { spawn } = require('child_process');
const child = spawn('node', [
  '-r', 'dotenv/config',
  '--experimental-json-modules',
  'index.js'
], { stdio: 'inherit' });

child.on('error', (err) => {
  console.error('Failed to start child process:', err);
  process.exit(1);
});

child.on('close', (code) => {
  console.log(`Child process exited with code ${code}`);
  process.exit(code);
}); 