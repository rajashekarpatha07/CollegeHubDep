# Ellenki College Hub API Documentation

## Base URL

`http://localhost:3000/api/v1`

## Authentication

Most endpoints require authentication using JWT tokens for faculty.

### Authentication Flow:

1. Login as faculty to receive an access token and refresh token
2. The application automatically handles token management in the browser
3. Protected routes will redirect to login if authentication fails

## API Endpoints

### Faculty Authentication

- Base path: `/faculty`

| Endpoint    | Method | Auth Required | Description            | Request Body                     | Response                    |
| ----------- | ------ | ------------- | ---------------------- | -------------------------------- | --------------------------- |
| `/login`    | POST   | No            | Login as faculty       | `{ email, password }`            | `{ status, data, message }` |
| `/logout`   | POST   | Yes           | Logout faculty         | None                             | `{ status, message }`       |
| `/register` | POST   | Admin only    | Register a new faculty | `{ name, email, password, ... }` | `{ status, data, message }` |

### Notes Management

- Base path: `/notes`

| Endpoint           | Method | Auth Required | Description                  | Request Body/Params              | Response                                 |
| ------------------ | ------ | ------------- | ---------------------------- | -------------------------------- | ---------------------------------------- |
| `/uploadnotes`     | POST   | Yes           | Upload new notes             | Form data with file and metadata | `{ status, data, message }`              |
| `/manage`          | GET    | Yes           | Get all notes                | Query params for filters         | `{ status, data, message }` or HTML page |
| `/deletenotes/:id` | DELETE | Yes           | Delete notes by ID           | ID in URL params                 | `{ status, data, message }`              |
| `/deletenotes/:id` | POST   | Yes           | Alternative delete for forms | ID in URL params                 | Redirect with status                     |

### Question Papers Management

- Base path: `/questionpapers`

| Endpoint                    | Method | Auth Required | Description                  | Request Body/Params              | Response                                 |
| --------------------------- | ------ | ------------- | ---------------------------- | -------------------------------- | ---------------------------------------- |
| `/uploadquestionpapers`     | POST   | Yes           | Upload new question paper    | Form data with file and metadata | `{ status, data, message }`              |
| `/manage`                   | GET    | Yes           | Get all question papers      | Query params for filters         | `{ status, data, message }` or HTML page |
| `/deletequestionpapers/:id` | DELETE | Yes           | Delete question paper by ID  | ID in URL params                 | `{ status, data, message }`              |
| `/deletequestionpapers/:id` | POST   | Yes           | Alternative delete for forms | ID in URL params                 | Redirect with status                     |

### Notices System

- Base path: `/notices`

| Endpoint             | Method | Auth Required | Description                  | Request Body/Params                              | Response                                 |
| -------------------- | ------ | ------------- | ---------------------------- | ------------------------------------------------ | ---------------------------------------- |
| `/addnotices`        | POST   | Yes           | Create a new notice          | `{ title, description, branch, batchyear, sem }` | `{ status, data, message }` or redirect  |
| `/manage`            | GET    | Yes           | Get all notices              | Query params for filters                         | `{ status, data, message }` or HTML page |
| `/deletenotices/:id` | DELETE | Yes           | Delete notice by ID          | ID in URL params                                 | `{ status, data, message }`              |
| `/deletenotices/:id` | POST   | Yes           | Alternative delete for forms | ID in URL params                                 | Redirect with status                     |

## Web Routes

The application provides browser-based interfaces for all functionality.

| Route                     | Authentication | Description                                 |
| ------------------------- | -------------- | ------------------------------------------- |
| `/faculty-login`          | No             | Faculty login page                          |
| `/faculty-dashboard`      | Yes            | Main faculty dashboard                      |
| `/upload-notes`           | Yes            | Interface for uploading notes               |
| `/manage-notes`           | Yes            | Interface for managing notes                |
| `/upload-question-papers` | Yes            | Interface for uploading question papers     |
| `/manage-question-papers` | Yes            | Interface for managing question papers      |
| `/upload-notices`         | Yes            | Interface for posting notices/announcements |
| `/manage-notices`         | Yes            | Interface for managing notices              |

## Request & Response Formats

### API Response Format

All API endpoints return responses in a consistent format:

```json
{
  "statusCode": 200,
  "data": {
    // Response data object
  },
  "message": "Operation successful",
  "success": true
}
```

### Error Response Format

```json
{
  "statusCode": 400,
  "data": null,
  "message": "Error message describing what went wrong",
  "success": false
}
```

### Web Response Format

For browser requests, the application returns:

- HTML pages with EJS templates
- Redirects with query parameters for success/error messages

## Notices Schema

Notices in the system follow this structure:

```json
{
  "title": "String - Title of the notice",
  "description": "String - Full content of the notice",
  "branch": "String - Department/branch code (CSE, ECE, etc. or ALL)",
  "batchyear": "Number - Student batch year (e.g., 23 for 2023)",
  "sem": "Number, optional - Specific semester (1-8)",
  "postedBy": "String - Faculty name who posted the notice",
  "createdAt": "Date - When the notice was created",
  "expiresAt": "Date - When the notice expires"
}
```

## Authentication Headers

For programmatic API access, include the following header:

```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

## File Upload

All file uploads support:

- Progress tracking with XHR
- Multiple file formats
- Success/error handling
- Metadata association

## Status Codes

- 200: OK
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error
