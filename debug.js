// Debug script to help identify deployment issues on Render

// Print environment info
console.log('=== ENVIRONMENT INFO ===');
console.log('Node version:', process.version);
console.log('Process cwd:', process.cwd());
console.log('Environment:', process.env.NODE_ENV);
console.log('Port:', process.env.PORT);

// List files in the current directory
console.log('\n=== FILES IN CURRENT DIRECTORY ===');
import * as fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { promisify } from 'util';

// Get current file directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

try {
  const files = fs.readdirSync('.');
  console.log(files);
} catch (err) {
  console.error('Error reading directory:', err);
}

// Check if main files exist
console.log('\n=== CHECKING MAIN FILES ===');
['index.js', 'server.js', 'start.js', 'app.js', 'package.json'].forEach(file => {
  try {
    const exists = fs.existsSync(file);
    console.log(`${file}: ${exists ? 'exists' : 'not found'}`);
    if (exists) {
      const stats = fs.statSync(file);
      console.log(`  - size: ${stats.size} bytes`);
    }
  } catch (err) {
    console.error(`Error checking ${file}:`, err);
  }
});

// Try to run the real server if index.js exists
console.log('\n=== ATTEMPTING TO START SERVER ===');
if (fs.existsSync('index.js')) {
  console.log('index.js found, importing...');
  import('./index.js').catch(err => {
    console.error('Failed to import index.js:', err);
  });
} else {
  console.error('index.js not found, cannot start server');
} 