# Ellenki College Hub Backend ⚙️

🚧 **Project Status: Under Development** 🚧  
The **Ellenki College Hub Backend** is currently under active development. I will be committing **daily updates** to track progress and improvements.

## 📝 Overview
This backend handles the core functionality of the application, managing notices, records, and assignments. It is built using:

- **Node.js** 🚀 – For server-side logic.
- **Express** 🛠️ – For building RESTful APIs.
- **MongoDB** 🗂️ – For secure data storage.

## 📚 Features (Planned & In Progress)
- CRUD operations for managing records.
- User authentication and authorization.***(Currently we are in this stage)***
- Secure file upload and management.
- Notifications and assignment tracking.

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation
1. Clone the repository
```bash
git clone https://github.com/rajashekarpatha07/Collage-Hub.git
cd ellenki-college-hub-backend
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
   - Copy the `.env.example` file to `.env`
   - Update the values in `.env` with your configuration

4. Start the development server
```bash
npm run dev
```

## 🔌 API Documentation
Detailed API documentation is available in the `API_DOCUMENTATION.md` file.

## 💻 For Frontend Developers
If you're developing the frontend for this application:
1. See `FRONTEND.env.example` for necessary environment variables
2. Refer to `API_DOCUMENTATION.md` for API endpoints, request/response formats
3. The API follows RESTful conventions with JWT authentication
4. Base URL for all API requests: `http://localhost:3000/api/v1` (development)

## 📅 Daily Updates
Check the ***commit history*** to stay informed about ongoing enhancements and progress.  
Stay tuned for exciting new features! 🎉

## Vercel Deployment Guide

### Prerequisites

1. Create a [Vercel](https://vercel.com/) account
2. Install [Vercel CLI](https://vercel.com/docs/cli) (optional for local deployment)

### Steps to Deploy

1. **Login to Vercel**
   ```bash
   vercel login
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Set Environment Variables**
   - Go to Vercel Dashboard > Your Project > Settings > Environment Variables
   - Add all the variables from your `.env` file

4. **Serverless Functions**
   This project is configured as a serverless application for Vercel through the `vercel.json` configuration file.

### Database Setup

For MongoDB, you have a few options:

1. Use MongoDB Atlas:
   - Create a database at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Use the provided connection string in your environment variables

2. Alternative options:
   - Use a managed MongoDB service
   - Deploy your own MongoDB instance

## Local Development

1. Clone the repository
   ```bash
   git clone <repository-url>
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`

4. Run the development server
   ```bash
   npm run dev
   ```

## Environment Variables

Make sure to set the following environment variables in Vercel:

- `MONGO_URI` - MongoDB connection string
- `PORT` - Application port (Vercel sets this automatically)
- `ACCESS_TOKEN_SECRET` - Secret for JWT access tokens
- `REFRESH_TOKEN_SECRET` - Secret for JWT refresh tokens
- `ACCESS_TOKEN_LIFE` - Expiry time for access tokens
- `REFRESH_TOKEN_LIFE` - Expiry time for refresh tokens
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret
- `EMAIL_USER` - Email for notifications
- `EMAIL_PASS` - Email password
- `SENDINBLUE_API_KEY` - SendInBlue API key (if using)

## File Storage

The College Hub application uses ImageKit.io as the primary file storage solution for notes, question papers, and other documents. If ImageKit is unavailable, the application will automatically fall back to local storage in the `public/uploads/` directory.

### Configuration

Make sure to configure ImageKit credentials in your `.env` file:

```
IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_PRIVATE_KEY=your_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_account
```

See `IMAGEKIT_MIGRATION.md` for more information about the file storage implementation.

## License

ISC
