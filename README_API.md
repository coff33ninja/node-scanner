# API Documentation

## Base URL
The base URL for the API is `http://localhost:3000/api`.

## Endpoints

### 1. Authentication

#### POST /auth/login
- **Description**: Logs in a user.
- **Request Body**:
  - `email`: string (required)
  - `password`: string (required)
- **Response**:
  - 200 OK: Returns user data and token.
  - 401 Unauthorized: Invalid credentials.

#### POST /auth/register
- **Description**: Registers a new user.
- **Request Body**:
  - `email`: string (required)
  - `password`: string (required)
- **Response**:
  - 201 Created: Returns user data.
  - 400 Bad Request: Validation errors.

### 2. Users

#### GET /users
- **Description**: Retrieves a list of users.
- **Response**:
  - 200 OK: Returns an array of user objects.

### 3. Devices

#### GET /devices
- **Description**: Retrieves a list of devices.
- **Response**:
  - 200 OK: Returns an array of device objects.

## Error Handling
All error responses will include a message field with a description of the error.

## Notes
- Ensure to include the Authorization header with the token for protected routes.
