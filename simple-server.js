// Minimal standalone Express server for Render
// This is the absolute last resort if nothing else works

// Include the Express module
const express = require('express');
const app = express();

// Get the port from environment or use a default
const port = process.env.PORT || 3000;

console.log('Starting minimal standalone Express server...');
console.log('This server is a last resort fallback');
console.log('Environment variables:');
console.log('- PORT:', port);
console.log('- NODE_ENV:', process.env.NODE_ENV);

// Health check endpoint (required by Render for zero-downtime deploys)
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Simple welcome page
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>College Hub - Simple Server</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
          h1 { color: #333; }
          .warning { color: #c00; padding: 10px; background: #fee; border-radius: 5px; }
        </style>
      </head>
      <body>
        <h1>College Hub</h1>
        <div class="warning">
          <p>⚠️ This is a minimal server running in fallback mode.</p>
          <p>The main application could not be started.</p>
          <p>Please check the Render logs for more information.</p>
        </div>
      </body>
    </html>
  `);
});

// Start the server
app.listen(port, () => {
  console.log(`Simple server running on port ${port}`);
}); 