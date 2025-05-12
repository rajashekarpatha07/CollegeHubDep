# Ellenki College Hub Backend ⚙️

🎓 **College Hub: A Complete Faculty Portal** 🎓  
The **Ellenki College Hub** is a comprehensive web application built to facilitate faculty-student interaction in an educational institution.

## 📝 Overview

This application provides a robust platform for faculty members to manage educational resources, including:

- **Course Notes** 📚 - Upload and manage study materials
- **Question Papers** 📝 - Share previous and sample exam papers
- **Notices & Announcements** 📢 - Post important information for students
- **Faculty Dashboard** 🖥️ - Centralized control for all resources

## 🛠️ Technology Stack

- **Node.js & Express** - Server-side framework
- **MongoDB** - Database for storing metadata and resources
- **EJS** - Server-side templating
- **Tailwind CSS** - Responsive UI design
- **Cloudinary/ImageKit** - Cloud storage for files
- **JWT** - Secure authentication

## 🚀 Key Features

### 📚 Notes Management

- Upload course notes with metadata (title, description, subject, etc.)
- Progress tracking for file uploads
- Filter and manage existing notes
- Secure delete functionality

### 📝 Question Papers Repository

- Upload question papers with categorization by subject, year, and exam type
- Visual upload progress indicators
- Comprehensive management interface
- Search and filter capabilities

### 📢 Notices System

- Post important announcements to specific student groups
- Target notices by branch, batch year, and semester
- View, filter, and manage all posted notices
- Modal view for reading full notice content

### 🔒 Authentication & Security

- Secure faculty login system
- Protected routes with JWT verification
- Role-based access control

### 💻 User Experience

- Responsive design for all device sizes
- Intuitive navigation and user interface
- Real-time feedback for user actions
- Error handling with user-friendly messages

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone https://github.com/rajashekarpatha07/Collage-Hub.git
cd ellenki-college-hub
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

### Authentication Endpoints

- `POST /api/v1/faculty/login` - Faculty login
- `POST /api/v1/faculty/logout` - Faculty logout
- `POST /api/v1/faculty/register` - Register new faculty (admin only)

### Notes Endpoints

- `POST /api/v1/notes/uploadnotes` - Upload new notes
- `GET /api/v1/notes/manage` - Retrieve all notes
- `DELETE /api/v1/notes/deletenotes/:id` - Delete specific notes
- `POST /api/v1/notes/deletenotes/:id` - Alternative delete method for form submissions

### Question Papers Endpoints

- `POST /api/v1/questionpapers/uploadquestionpapers` - Upload new question papers
- `GET /api/v1/questionpapers/manage` - Retrieve all question papers
- `DELETE /api/v1/questionpapers/deletequestionpapers/:id` - Delete specific question paper
- `POST /api/v1/questionpapers/deletequestionpapers/:id` - Alternative delete method for form submissions

### Notices Endpoints

- `POST /api/v1/notices/addnotices` - Post a new notice/announcement
- `GET /api/v1/notices/manage` - Retrieve all notices
- `DELETE /api/v1/notices/deletenotices/:id` - Delete specific notice
- `POST /api/v1/notices/deletenotices/:id` - Alternative delete method for form submissions

### Web Routes

- `/faculty-dashboard` - Main faculty dashboard
- `/upload-notes` - Page for uploading notes
- `/manage-notes` - Page for managing notes
- `/upload-question-papers` - Page for uploading question papers
- `/manage-question-papers` - Page for managing question papers
- `/upload-notices` - Page for posting notices
- `/manage-notices` - Page for managing notices

## 📱 User Interface

The application features a clean, intuitive interface with:

- Sidebar navigation for desktop view
- Hamburger menu for mobile responsiveness
- Color-coded sections for different resource types
- Consistent styling throughout the application
- Modal dialogs for confirmations and detailed views
- Progress indicators for file uploads

## 🔄 Progress Tracking

All file upload operations include:

- Visual progress bars
- Success/error notifications
- Redirect with status messages
- Client-side validation

## 🔐 File Storage

The application supports multiple file storage options:

- Cloudinary cloud storage (primary)
- ImageKit integration (alternative)
- Local file system (fallback)

Configure your preferred storage option in the `.env` file:

```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## 🧩 Future Enhancements

Planned features for future releases:

- Student portal with authentication
- Real-time notifications via WebSockets
- Calendar integration for important dates
- Mobile application
- Analytics dashboard for resource usage

## 🛡️ Environment Variables

Required environment variables:

- `MONGO_URI` - MongoDB connection string
- `PORT` - Application port
- `ACCESS_TOKEN_SECRET` - Secret for JWT access tokens
- `REFRESH_TOKEN_SECRET` - Secret for JWT refresh tokens
- `ACCESS_TOKEN_LIFE` - Expiry time for access tokens
- `REFRESH_TOKEN_LIFE` - Expiry time for refresh tokens

Optional environment variables:

- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret
- `IMAGEKIT_PUBLIC_KEY` - ImageKit public key
- `IMAGEKIT_PRIVATE_KEY` - ImageKit private key
- `IMAGEKIT_URL_ENDPOINT` - ImageKit URL endpoint

## Contributors

- [@rajashekarpatha07](https://github.com/rajashekarpatha07) - Backend Developer
- [@Deeksha-Mane](https://github.com/Deeksha-Mane) - Frontend Developer
