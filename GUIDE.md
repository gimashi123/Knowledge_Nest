# Knowledge Nest API Guide

This guide provides details on all available APIs in the Knowledge Nest backend and how to test them using Postman.

## Setup

1. **Base URL**: `http://localhost:8081`
2. **Port**: 8081 (specified in application.properties)
3. **Authentication**: JWT token-based authentication (required for most endpoints)

## API Endpoints

### Authentication APIs

#### 1. Register User
- **URL**: `/api/auth/register`
- **Method**: POST
- **Description**: Register a new user
- **Request Body**:
```json
{
    "name": "User Name",
    "email": "user@example.com",
    "password": "password123",
    "role": "USER"
}
```
- **Response**:
```json
{
    "success": true,
    "message": "User registered successfully",
    "data": "User created successfully"
}
```

#### 2. Login User
- **URL**: `/api/auth/login`
- **Method**: POST
- **Description**: Authenticate user and get JWT token
- **Request Body**:
```json
{
    "email": "user@example.com",
    "password": "password123"
}
```
- **Response**:
```json
{
    "success": true,
    "message": "Login successful",
    "data": {
        "token": "eyJhbGciOiJIUzI1NiJ9..."
    }
}
```

#### 3. Get Current User
- **URL**: `/api/auth/me`
- **Method**: GET
- **Description**: Get current authenticated user details
- **Authentication**: JWT token in Authorization header
- **Response**: User details object

### User Management APIs

#### 1. Update User Name
- **URL**: `/api/user/update-name`
- **Method**: PUT
- **Description**: Update the authenticated user's name
- **Authentication**: JWT token in Authorization header
- **Query Parameters**: `name` (string)
- **Response**: Success message

#### 2. Upload Profile Picture
- **URL**: `/api/user/upload-photo`
- **Method**: POST
- **Description**: Upload a profile picture for the authenticated user
- **Authentication**: JWT token in Authorization header
- **Request Body**: Form data with key "file" containing image file
- **Response**: Success message

#### 3. Delete Profile Picture
- **URL**: `/api/user/delete-photo`
- **Method**: DELETE
- **Description**: Remove the authenticated user's profile picture
- **Authentication**: JWT token in Authorization header
- **Response**: Success message

### Challenges APIs

#### 1. Create Challenge
- **URL**: `/api/challenges`
- **Method**: POST
- **Description**: Create a new challenge
- **Authentication**: JWT token in Authorization header
- **Request Body**:
```json
{
    "title": "JavaScript Basics",
    "creatorId": "user_id_here",
    "skillCategory": "coding",
    "difficultyLevel": "beginner",
    "tasks": [
        "What is a variable?",
        "Explain functions in JavaScript",
        "What is DOM?",
        "How do you handle errors in JavaScript?",
        "What are promises?"
    ],
    "timeLimit": 30,
    "isActive": true
}
```
- **Response**: Created challenge object

#### 2. Get All Challenges
- **URL**: `/api/challenges`
- **Method**: GET
- **Description**: Get all challenges
- **Authentication**: JWT token in Authorization header
- **Response**: Array of challenge objects

#### 3. Get Challenge by ID
- **URL**: `/api/challenges/{id}`
- **Method**: GET
- **Description**: Get challenge details by ID
- **Authentication**: JWT token in Authorization header
- **Path Variables**: `id` (string)
- **Response**: Challenge object

#### 4. Get Challenges by Category
- **URL**: `/api/challenges/category/{category}`
- **Method**: GET
- **Description**: Get challenges filtered by skill category
- **Authentication**: JWT token in Authorization header
- **Path Variables**: `category` (string)
- **Response**: Array of challenge objects

#### 5. Get Challenges by Creator
- **URL**: `/api/challenges/creator/{creatorId}`
- **Method**: GET
- **Description**: Get challenges created by a specific user
- **Authentication**: JWT token in Authorization header
- **Path Variables**: `creatorId` (string)
- **Response**: Array of challenge objects

#### 6. Update Challenge
- **URL**: `/api/challenges/{id}`
- **Method**: PUT
- **Description**: Update an existing challenge
- **Authentication**: JWT token in Authorization header
- **Path Variables**: `id` (string)
- **Request Body**: Updated challenge object
- **Response**: Updated challenge object

#### 7. Delete Challenge
- **URL**: `/api/challenges/{id}`
- **Method**: DELETE
- **Description**: Delete a challenge
- **Authentication**: JWT token in Authorization header
- **Path Variables**: `id` (string)
- **Response**: No content

#### 8. Block Challenge
- **URL**: `/api/challenges/{id}/block`
- **Method**: PUT
- **Description**: Block a challenge
- **Authentication**: JWT token in Authorization header
- **Path Variables**: `id` (string)
- **Response**: Success status

#### 9. Toggle Challenge Status
- **URL**: `/api/challenges/{id}/toggle`
- **Method**: PATCH
- **Description**: Toggle challenge active status
- **Authentication**: JWT token in Authorization header
- **Path Variables**: `id` (string)
- **Response**: Updated challenge object

### Challenge Attempts APIs

#### 1. Submit Challenge Attempt
- **URL**: `/api/challenge-attempts/submit`
- **Method**: POST
- **Description**: Submit a challenge attempt
- **Authentication**: JWT token in Authorization header
- **Request Body**:
```json
{
    "challengeId": "challenge_id_here",
    "userId": "user_id_here",
    "answers": [
        "Answer 1",
        "Answer 2",
        "Answer 3",
        "Answer 4",
        "Answer 5"
    ],
    "startedAt": "2023-04-25T10:30:00"
}
```
- **Response**: Challenge attempt object with score

#### 2. Get User's Challenge Attempts
- **URL**: `/api/challenge-attempts/user/{userId}`
- **Method**: GET
- **Description**: Get all attempts made by a specific user
- **Authentication**: JWT token in Authorization header
- **Path Variables**: `userId` (string)
- **Response**: Array of challenge attempt objects

#### 3. Get Challenge Attempts by Challenge
- **URL**: `/api/challenge-attempts/challenge/{challengeId}`
- **Method**: GET
- **Description**: Get all attempts for a specific challenge
- **Authentication**: JWT token in Authorization header
- **Path Variables**: `challengeId` (string)
- **Response**: Array of challenge attempt objects

#### 4. Get User Challenge Result
- **URL**: `/api/challenge-attempts/result`
- **Method**: GET
- **Description**: Get a specific user's result for a challenge
- **Authentication**: JWT token in Authorization header
- **Query Parameters**: `userId` (string), `challengeId` (string)
- **Response**: Challenge attempt object

#### 5. Get Challenge Statistics Report
- **URL**: `/api/challenge-attempts/report/{challengeId}`
- **Method**: GET
- **Description**: Get statistics report for a challenge
- **Authentication**: JWT token in Authorization header
- **Path Variables**: `challengeId` (string)
- **Response**: Statistics data object

## Testing with Postman

### Setting Up Authentication in Postman

1. **Register a User**:
   - Create a new POST request to `/api/auth/register`
   - Set the body to raw JSON with user details
   - Send the request to create a user

2. **Login to Get Token**:
   - Create a new POST request to `/api/auth/login`
   - Set the body to raw JSON with email and password
   - Send the request to get a JWT token

3. **Setup Authorization**:
   - For authenticated requests, add an Authorization header
   - Format: `Authorization: Bearer [your_jwt_token]`
   - You can use Postman's environment variables to store the token

### Test Flow Example

1. Register a user
2. Login with user credentials to get JWT token
3. Create a new challenge
4. Get all challenges to confirm creation
5. Submit a challenge attempt
6. View challenge results

### Tips for Testing

- Keep the JWT token handy (it expires after 24 hours as per configuration)
- For file uploads, use form-data and select file type for the "file" field
- Test edge cases like invalid data, missing fields, etc.
- Make sure MongoDB is running and accessible (the application uses MongoDB Atlas)

## Troubleshooting

- **401 Unauthorized**: Check that your JWT token is valid and correctly formatted in the Authorization header
- **400 Bad Request**: Verify your request body format matches the expected structure
- **404 Not Found**: Ensure the resource ID exists in the database
- **500 Server Error**: Check server logs for more details on the error
