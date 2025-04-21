// Simple Express server as a last resort for Render deployment
const express = require('express');
const app = express();
const port = process.env.PORT || 10000;

console.log("Running simple Express server as a fallback");
console.log("This is a temporary server to keep the deployment alive");
console.log("Check the logs for errors in starting the main application");

// Simple health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Root endpoint with explanation
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>College Hub - Fallback Server</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
          h1 { color: #c00; }
          pre { background: #f4f4f4; padding: 10px; border-radius: 5px; }
        </style>
      </head>
      <body>
        <h1>⚠️ College Hub - Fallback Server Running</h1>
        <p>The main application could not be started. This is a fallback server to keep the deployment alive.</p>
        <p>Check the Render logs for more details about what went wrong.</p>
        <p>Common issues:</p>
        <ul>
          <li>Entry point file not found (parse-server.js, index.js, etc.)</li>
          <li>ESM/CommonJS compatibility issues</li>
          <li>Missing environment variables</li>
          <li>Database connection issues</li>
        </ul>
      </body>
    </html>
  `);
});

// Start the server
app.listen(port, () => {
  console.log(`Fallback server listening on port ${port}`);
}); 