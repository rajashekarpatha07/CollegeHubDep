// Parse Server configuration for Back4App
import express from 'express';
import { ParseServer } from 'parse-server';
import ParseDashboard from 'parse-dashboard';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
import 'dotenv/config';

// Create Express app
const app = express();

// Parse Server configuration
const parseServer = new ParseServer({
  databaseURI: process.env.MONGO_URI || 'mongodb://localhost:27017/collegeHub',
  cloud: './cloud/main.js',
  appId: process.env.APP_ID || 'myAppId',
  masterKey: process.env.MASTER_KEY || 'myMasterKey',
  serverURL: process.env.SERVER_URL || 'http://localhost:1337/parse',
  // Add other configurations as needed
});

// Parse Dashboard configuration (optional)
const dashboard = new ParseDashboard({
  apps: [
    {
      serverURL: process.env.SERVER_URL || 'http://localhost:1337/parse',
      appId: process.env.APP_ID || 'myAppId',
      masterKey: process.env.MASTER_KEY || 'myMasterKey',
      appName: 'College Hub',
    },
  ],
  users: [
    {
      user: process.env.DASHBOARD_USER || 'admin',
      pass: process.env.DASHBOARD_PASS || 'password',
    },
  ],
  useEncryptedPasswords: true,
});

// Middleware
app.use('/parse', parseServer.app);
app.use('/dashboard', dashboard);

// Serve the main app through Parse Server
import mainApp from './app.js';
app.use(mainApp);

// Start the server
const port = process.env.PORT || 1337;
app.listen(port, () => {
  console.log(`Parse Server running on port ${port}`);
});

export default app; 