# Deploying College Hub to Render

This guide will help you deploy the College Hub application to Render.

## Prerequisites

1. Create a Render account at [render.com](https://render.com/)
2. Make sure your code is in a Git repository (GitHub, GitLab, or Bitbucket)

## Deployment Steps

### Option 1: Deploy Using Render Dashboard

1. Log in to your Render account
2. Click on "New +"
3. Select "Web Service"
4. Connect your GitHub/GitLab/Bitbucket account and select your repository
5. Configure your web service:
   - Name: `college-hub` (or your preferred name)
   - Runtime: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
6. Set up your environment variables in the Render dashboard:
   - MONGO_URI: Your MongoDB connection string
   - ACCESS_TOKEN_SECRET: Secret for JWT tokens
   - REFRESH_TOKEN_SECRET: Secret for refresh tokens
   - CLOUDINARY_CLOUD_NAME: Your Cloudinary cloud name
   - CLOUDINARY_API_KEY: Your Cloudinary API key
   - CLOUDINARY_API_SECRET: Your Cloudinary API secret
   - EMAIL_USER: Email user for sending emails
   - EMAIL_PASS: Email password
   - SENDINBLUE_API_KEY: Your Sendinblue API key
7. Click "Create Web Service"

### Option 2: Deploy Using render.yaml

1. Make sure you have a `render.yaml` file in your repository root (already created)
2. Log in to your Render account
3. Go to "Blueprints" in your dashboard
4. Click "New Blueprint Instance"
5. Connect to your repository
6. Follow the prompts to set up the services defined in `render.yaml`
7. Make sure to set up all the environment variables marked as `sync: false` in the blueprint

## Database Setup

Render offers a managed PostgreSQL service, but since this application uses MongoDB:

1. Use MongoDB Atlas or another MongoDB hosting provider
2. Set the `MONGO_URI` environment variable in your Render service to connect to your MongoDB database

## Testing Your Deployment

1. After deployment completes, Render will provide a URL for your service (e.g., `https://college-hub.onrender.com`)
2. Test your API endpoints using Postman or another API testing tool

## Monitoring and Logs

- You can monitor your service and view logs from the Render dashboard
- Set up alerts for critical events if needed

## Scaling

- Render allows you to scale your service as needed in the dashboard settings
- You can adjust the number of instances and the instance type 