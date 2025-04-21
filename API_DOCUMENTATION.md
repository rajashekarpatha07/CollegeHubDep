# Ellenki College Hub API Documentation

## Base URL
`http://localhost:3000/api/v1`

## Authentication
Most endpoints require authentication using JWT tokens.

### Authentication Flow:
1. Register or login to receive an access token and refresh token
2. Include the access token in the Authorization header for protected routes
3. If the access token expires, use the refresh token to get a new one

## API Endpoints

### Student Routes
- Base path: `/students`

| Endpoint | Method | Auth Required | Description | Request Body | Response |
|----------|--------|--------------|-------------|--------------|----------|
| `/register` | POST | No | Register a new student | `{ name, email, password, ... }` | `{ success, student, token }` |
| `/login` | POST | No | Login as student | `{ email, password }` | `{ success, student, accessToken, refreshToken }` |
| `/logout` | POST | Yes | Logout student | None | `{ success, message }` |
| `/getnotes` | GET | Yes | Get all notes | None | `{ success, notes }` |
| `/getquestionpapers` | GET | Yes | Get all question papers | None | `{ success, questionPapers }` |
| `/getnotices` | GET | Yes | Get all notices | None | `{ success, notices }` |

### Faculty Routes
- Base path: `/faculty`

| Endpoint | Method | Auth Required | Description | Request Body | Response |
|----------|--------|--------------|-------------|--------------|----------|
| `/register` | POST | No | Register a new faculty | `{ name, email, password, ... }` | `{ success, faculty, token }` |
| `/login` | POST | No | Login as faculty | `{ email, password }` | `{ success, faculty, accessToken, refreshToken }` |
| `/logout` | POST | Yes | Logout faculty | None | `{ success, message }` |

### Notes Routes
- Base path: `/notes`

| Endpoint | Method | Auth Required | Description | Request Body | Response |
|----------|--------|--------------|-------------|--------------|----------|
| `/upload` | POST | Yes | Upload new notes | Form data with file and metadata | `{ success, note }` |
| `/get` | GET | Yes | Get all notes | None | `{ success, notes }` |

### Notices Routes
- Base path: `/notices`

| Endpoint | Method | Auth Required | Description | Request Body | Response |
|----------|--------|--------------|-------------|--------------|----------|
| `/upload` | POST | Yes | Upload new notice | Form data with file and metadata | `{ success, notice }` |
| `/get` | GET | Yes | Get all notices | None | `{ success, notices }` |

### Question Paper Routes
- Base path: `/questionpaper`

| Endpoint | Method | Auth Required | Description | Request Body | Response |
|----------|--------|--------------|-------------|--------------|----------|
| `/upload` | POST | Yes | Upload new question paper | Form data with file and metadata | `{ success, questionPaper }` |
| `/get` | GET | Yes | Get all question papers | None | `{ success, questionPapers }` |

## Authentication Headers
For protected routes, include the following header:
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

## Error Responses
Error responses will have the following format:
```json
{
  "success": false,
  "message": "Error message describing what went wrong"
}
```

Common HTTP status codes:
- 200: Success
- 201: Resource created
- 400: Bad request
- 401: Unauthorized
- 403: Forbidden
- 404: Not found
- 500: Server error 