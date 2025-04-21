# Deploying College Hub to Back4App

This guide will help you deploy the College Hub application to Back4App.

## Prerequisites

1. Create a Back4App account at [back4app.com](https://www.back4app.com/)
2. Install Back4App CLI (if you plan to deploy via CLI)
   ```
   npm install -g back4app-cli
   ```

## Deployment Steps

### Option 1: Deploy Using Back4App Dashboard

1. Log in to your Back4App account
2. Create a new Parse Server app from the dashboard
3. Note your Application ID and Master Key from the app settings
4. Set up your environment variables in the Back4App dashboard:
   - APP_ID
   - MASTER_KEY
   - SERVER_URL
   - MONGO_URI (if using external MongoDB)
   - All other environment variables from your `.env` file
5. Connect your GitHub repository or upload your code:
   - Go to "App Settings" > "Hosting" > "Git Hosting"
   - Connect your GitHub repository
   - Configure automatic deployments

### Option 2: Deploy Using Back4App CLI

1. Log in to Back4App CLI:
   ```
   b4a login
   ```

2. Initialize your project:
   ```
   b4a new
   ```

3. Follow the prompts to configure your app

4. Deploy your application:
   ```
   b4a deploy
   ```

## Configuration

1. Update your `.env` file with your Back4App credentials:
   ```
   APP_ID=your_back4app_app_id
   MASTER_KEY=your_back4app_master_key
   SERVER_URL=https://yourapp.back4app.io/parse
   ```

2. Make sure your `parse-server.js` file is properly configured

## Database Migration

If you need to migrate your data from your previous database to Back4App:

1. Export your data from your current MongoDB instance
2. Import the data to Back4App using the MongoDB connection string provided in your Back4App dashboard

## Testing Your Deployment

1. Visit your Back4App app URL: `https://yourapp.back4app.io`
2. Access the Parse Dashboard: `https://yourapp.back4app.io/dashboard`
3. Test your API endpoints using Postman or another API testing tool

## Troubleshooting

- If you encounter issues, check the Back4App logs in the dashboard
- Make sure all environment variables are properly set
- Verify that your Parse Server configuration matches your Back4App settings 