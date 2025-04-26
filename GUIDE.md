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

### Skill Post APIs

#### 1. Create Skill Post
- **URL**: `/api/skill-posts`
- **Method**: POST
- **Description**: Create a new skill post
- **Authentication**: JWT token in Authorization header
- **Request Body**:
```json
{
  "title": "Introduction to Spring Boot",
  "description": "Learn the basics of Spring Boot framework",
  "content": "Spring Boot makes it easy to create stand-alone, production-grade Spring based Applications...",
  "tags": ["Spring", "Java", "Backend"]
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Skill post created successfully",
  "data": {
    "id": "680c11b25609893d37e6eded",
    "title": "Introduction to Spring Boot",
    "description": "Learn the basics of Spring Boot framework",
    "content": "Spring Boot makes it easy to create stand-alone, production-grade Spring based Applications...",
    "userId": "your.email@example.com",
    "userName": "your.email@example.com",
    "tags": ["Spring", "Java", "Backend"],
    "createdAt": "2025-04-26T04:20:26.3281458",
    "updatedAt": "2025-04-26T04:20:26.3281458",
    "likes": 0,
    "comments": []
  },
  "timestamp": "2025-04-26T04:20:26.3281458"
}
```

#### 2. Get Skill Post by ID
- **URL**: `/api/skill-posts/{id}`
- **Method**: GET
- **Description**: Get a skill post by its ID
- **Authentication**: JWT token in Authorization header (optional)
- **Path Variables**: `id` (string)
- **Response**:
```json
{
  "success": true,
  "message": "Skill post retrieved successfully",
  "data": {
    "id": "680c11b25609893d37e6eded",
    "title": "Introduction to Spring Boot",
    "description": "Learn the basics of Spring Boot framework",
    "content": "Spring Boot makes it easy to create stand-alone, production-grade Spring based Applications...",
    "userId": "your.email@example.com",
    "userName": "your.email@example.com",
    "tags": ["Spring", "Java", "Backend"],
    "createdAt": "2025-04-26T04:20:26.3281458",
    "updatedAt": "2025-04-26T04:20:26.3281458",
    "likes": 0,
    "comments": []
  },
  "timestamp": "2025-04-26T04:20:26.3281458"
}
```

#### 3. Get All Skill Posts
- **URL**: `/api/skill-posts`
- **Method**: GET
- **Description**: Get all skill posts
- **Authentication**: JWT token in Authorization header (optional)
- **Response**:
```json
{
  "success": true,
  "message": "All skill posts retrieved successfully",
  "data": [
    {
      "id": "680c11b25609893d37e6eded",
      "title": "Introduction to Spring Boot",
      "description": "Learn the basics of Spring Boot framework",
      "content": "Spring Boot makes it easy to create stand-alone, production-grade Spring based Applications...",
      "userId": "your.email@example.com",
      "userName": "your.email@example.com",
      "tags": ["Spring", "Java", "Backend"],
      "createdAt": "2025-04-26T04:20:26.3281458",
      "updatedAt": "2025-04-26T04:20:26.3281458",
      "likes": 0,
      "comments": []
    }
    // Additional posts...
  ],
  "timestamp": "2025-04-26T04:20:26.3281458"
}
```

#### 4. Advanced View with Filters, Sorting, and Pagination
- **URL**: `/api/skill-posts/view`
- **Method**: GET
- **Description**: Get posts with advanced filtering, sorting, and pagination options
- **Authentication**: JWT token in Authorization header (optional)
- **Query Parameters**:
  - `page` (default 0): Page number
  - `size` (default 10): Items per page
  - `sortBy` (default "createdAt"): Field to sort by (title, likes, createdAt, updatedAt)
  - `sortDir` (default "desc"): Sort direction (asc, desc)
  - `keyword` (optional): Search term in title, description, or content
  - `tags` (optional): Filter by tags (can provide multiple)
  - `userId` (optional): Filter by creator
- **Response**:
```json
{
  "success": true,
  "message": "Skill posts retrieved successfully",
  "data": {
    "posts": [
      {
        "id": "680c11b25609893d37e6eded",
        "title": "Introduction to Spring Boot",
        "description": "Learn the basics of Spring Boot framework",
        "content": "Spring Boot makes it easy to create stand-alone, production-grade Spring based Applications...",
        "userId": "your.email@example.com",
        "userName": "your.email@example.com",
        "tags": ["Spring", "Java", "Backend"],
        "createdAt": "2025-04-26T04:20:26.3281458",
        "updatedAt": "2025-04-26T04:20:26.3281458",
        "likes": 0,
        "comments": []
      }
      // Additional posts...
    ],
    "currentPage": 0,
    "totalItems": 25,
    "totalPages": 3,
    "pageSize": 10,
    "sortBy": "createdAt",
    "sortDirection": "desc"
  },
  "timestamp": "2025-04-26T04:20:26.3281458"
}
```

#### 5. Get Posts by User
- **URL**: `/api/skill-posts/user/{userId}`
- **Method**: GET
- **Description**: Get all posts by a specific user
- **Authentication**: JWT token in Authorization header (optional)
- **Path Variables**: `userId` (string)
- **Response**:
```json
{
  "success": true,
  "message": "User skill posts retrieved successfully",
  "data": [
    {
      "id": "680c11b25609893d37e6eded",
      "title": "Introduction to Spring Boot",
      "description": "Learn the basics of Spring Boot framework",
      "content": "Spring Boot makes it easy to create stand-alone, production-grade Spring based Applications...",
      "userId": "your.email@example.com",
      "userName": "your.email@example.com",
      "tags": ["Spring", "Java", "Backend"],
      "createdAt": "2025-04-26T04:20:26.3281458",
      "updatedAt": "2025-04-26T04:20:26.3281458",
      "likes": 0,
      "comments": []
    }
    // Additional posts by the user...
  ],
  "timestamp": "2025-04-26T04:20:26.3281458"
}
```

#### 6. Get Posts by Tag
- **URL**: `/api/skill-posts/tag/{tag}`
- **Method**: GET
- **Description**: Get all posts with a specific tag
- **Authentication**: JWT token in Authorization header (optional)
- **Path Variables**: `tag` (string)
- **Response**:
```json
{
  "success": true,
  "message": "Tagged skill posts retrieved successfully",
  "data": [
    {
      "id": "680c11b25609893d37e6eded",
      "title": "Introduction to Spring Boot",
      "description": "Learn the basics of Spring Boot framework",
      "content": "Spring Boot makes it easy to create stand-alone, production-grade Spring based Applications...",
      "userId": "your.email@example.com",
      "userName": "your.email@example.com",
      "tags": ["Spring", "Java", "Backend"],
      "createdAt": "2025-04-26T04:20:26.3281458",
      "updatedAt": "2025-04-26T04:20:26.3281458",
      "likes": 0,
      "comments": []
    }
    // Additional posts with the tag...
  ],
  "timestamp": "2025-04-26T04:20:26.3281458"
}
```

#### 7. Get Posts by Multiple Tags
- **URL**: `/api/skill-posts/by-tags`
- **Method**: GET
- **Description**: Get posts that contain any of the specified tags
- **Authentication**: JWT token in Authorization header (optional)
- **Query Parameters**: `tags` (multiple allowed, e.g., tags=Spring&tags=Java)
- **Response**:
```json
{
  "success": true,
  "message": "Tagged skill posts retrieved successfully",
  "data": [
    {
      "id": "680c11b25609893d37e6eded",
      "title": "Introduction to Spring Boot",
      "description": "Learn the basics of Spring Boot framework",
      "content": "Spring Boot makes it easy to create stand-alone, production-grade Spring based Applications...",
      "userId": "your.email@example.com",
      "userName": "your.email@example.com",
      "tags": ["Spring", "Java", "Backend"],
      "createdAt": "2025-04-26T04:20:26.3281458",
      "updatedAt": "2025-04-26T04:20:26.3281458",
      "likes": 0,
      "comments": []
    }
    // Additional posts with any of the tags...
  ],
  "timestamp": "2025-04-26T04:20:26.3281458"
}
```

#### 8. Search Skill Posts
- **URL**: `/api/skill-posts/search`
- **Method**: GET
- **Description**: Search posts by keyword in title, description, and content
- **Authentication**: JWT token in Authorization header (optional)
- **Query Parameters**: `keyword` (string)
- **Response**:
```json
{
  "success": true,
  "message": "Search results retrieved successfully",
  "data": [
    {
      "id": "680c11b25609893d37e6eded",
      "title": "Introduction to Spring Boot",
      "description": "Learn the basics of Spring Boot framework",
      "content": "Spring Boot makes it easy to create stand-alone, production-grade Spring based Applications...",
      "userId": "your.email@example.com",
      "userName": "your.email@example.com",
      "tags": ["Spring", "Java", "Backend"],
      "createdAt": "2025-04-26T04:20:26.3281458",
      "updatedAt": "2025-04-26T04:20:26.3281458",
      "likes": 0,
      "comments": []
    }
    // Additional matching posts...
  ],
  "timestamp": "2025-04-26T04:20:26.3281458"
}
```

#### 9. Get Trending Skill Posts
- **URL**: `/api/skill-posts/trending`
- **Method**: GET
- **Description**: Get trending posts sorted by popularity (likes, comments, recency)
- **Authentication**: JWT token in Authorization header (optional)
- **Query Parameters**: `limit` (default 10): Maximum number of posts to return
- **Response**:
```json
{
  "success": true,
  "message": "Trending skill posts retrieved successfully",
  "data": [
    {
      "id": "680c11b25609893d37e6eded",
      "title": "Introduction to Spring Boot",
      "description": "Learn the basics of Spring Boot framework",
      "content": "Spring Boot makes it easy to create stand-alone, production-grade Spring based Applications...",
      "userId": "your.email@example.com",
      "userName": "your.email@example.com",
      "tags": ["Spring", "Java", "Backend"],
      "createdAt": "2025-04-26T04:20:26.3281458",
      "updatedAt": "2025-04-26T04:20:26.3281458",
      "likes": 10,
      "comments": []
    }
    // Additional trending posts...
  ],
  "timestamp": "2025-04-26T04:20:26.3281458"
}
```

#### 10. Dashboard Summary
- **URL**: `/api/skill-posts/dashboard-summary`
- **Method**: GET
- **Description**: Get an aggregated summary of posts for dashboard display
- **Authentication**: JWT token in Authorization header (optional)
- **Response**:
```json
{
  "success": true,
  "message": "Dashboard summary retrieved successfully",
  "data": {
    "totalPosts": 25,
    "totalLikes": 150,
    "totalComments": 87,
    "totalTags": 15,
    "trendingPosts": [
      {
        "id": "680c11b25609893d37e6eded",
        "title": "Introduction to Spring Boot",
        "description": "Learn the basics of Spring Boot framework",
        "content": "Spring Boot makes it easy to create stand-alone...",
        "userId": "your.email@example.com",
        "userName": "your.email@example.com",
        "tags": ["Spring", "Java", "Backend"],
        "createdAt": "2025-04-26T04:20:26.3281458",
        "updatedAt": "2025-04-26T04:20:26.3281458",
        "likes": 10,
        "comments": []
      }
      // Additional trending posts...
    ],
    "recentPosts": [
      // Most recent posts...
    ],
    "topTags": [
      {"Spring": 12},
      {"Java": 10},
      {"Backend": 8},
      {"JavaScript": 7},
      {"React": 6}
    ]
  },
  "timestamp": "2025-04-26T04:20:26.3281458"
}
```

#### 11. Update Skill Post
- **URL**: `/api/skill-posts/{id}`
- **Method**: PUT
- **Description**: Update an existing skill post (only by creator)
- **Authentication**: JWT token in Authorization header
- **Path Variables**: `id` (string)
- **Request Body**:
```json
{
  "title": "Updated: Introduction to Spring Boot",
  "description": "Updated description about Spring Boot basics",
  "content": "Updated content about Spring Boot...",
  "tags": ["Spring", "Java", "Backend", "Web Development"]
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Skill post updated successfully",
  "data": {
    "id": "680c11b25609893d37e6eded",
    "title": "Updated: Introduction to Spring Boot",
    "description": "Updated description about Spring Boot basics",
    "content": "Updated content about Spring Boot...",
    "userId": "your.email@example.com",
    "userName": "your.email@example.com",
    "tags": ["Spring", "Java", "Backend", "Web Development"],
    "createdAt": "2025-04-26T04:20:26.3281458",
    "updatedAt": "2025-04-26T04:21:35.9753124",
    "likes": 0,
    "comments": []
  },
  "timestamp": "2025-04-26T04:21:35.9753124"
}
```

#### 12. Delete Skill Post
- **URL**: `/api/skill-posts/{id}`
- **Method**: DELETE
- **Description**: Delete a skill post (only by creator)
- **Authentication**: JWT token in Authorization header
- **Path Variables**: `id` (string)
- **Response**:
```json
{
  "success": true,
  "message": "Skill post deleted successfully",
  "data": {
    "postId": "680c11b25609893d37e6eded",
    "title": "Updated: Introduction to Spring Boot",
    "deletedAt": "2025-04-26T04:22:15.7493421",
    "deletedBy": "your.email@example.com",
    "createdAt": "2025-04-26T04:20:26.3281458"
  },
  "timestamp": "2025-04-26T04:22:15.7493421"
}
```

#### 13. Batch Delete Skill Posts
- **URL**: `/api/skill-posts/batch`
- **Method**: DELETE
- **Description**: Delete multiple skill posts (only by creator)
- **Authentication**: JWT token in Authorization header
- **Request Body**:
```json
["680c11b25609893d37e6eded", "680c11b25609893d37e6edee", "680c11b25609893d37e6edef"]
```
- **Response**: No content with HTTP status 204

#### 14. Add Comment to Skill Post
- **URL**: `/api/skill-posts/{postId}/comments`
- **Method**: POST
- **Description**: Add a comment to a skill post
- **Authentication**: JWT token in Authorization header
- **Path Variables**: `postId` (string)
- **Request Body**:
```json
{
  "content": "This is a great post, very informative!"
}
```
- **Response**:
```json
{
  "id": "680c11b25609893d37e6eded",
  "title": "Introduction to Spring Boot",
  "description": "Learn the basics of Spring Boot framework",
  "content": "Spring Boot makes it easy to create stand-alone, production-grade Spring based Applications...",
  "userId": "your.email@example.com",
  "userName": "your.email@example.com",
  "tags": ["Spring", "Java", "Backend"],
  "createdAt": "2025-04-26T04:20:26.3281458",
  "updatedAt": "2025-04-26T04:23:45.1287654",
  "likes": 0,
  "comments": [
    {
      "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "userId": "commenter.email@example.com",
      "userName": "commenter.email@example.com",
      "content": "This is a great post, very informative!",
      "createdAt": "2025-04-26T04:23:45.1287654"
    }
  ]
}
```

#### 15. Update Comment
- **URL**: `/api/skill-posts/{postId}/comments/{commentId}`
- **Method**: PUT
- **Description**: Update a comment (only by comment creator)
- **Authentication**: JWT token in Authorization header
- **Path Variables**: 
  - `postId` (string): ID of the post
  - `commentId` (string): ID of the comment to update
- **Request Body**:
```json
{
  "content": "Updated comment content"
}
```
- **Response**: Returns the updated post with the edited comment

#### 16. Delete Comment
- **URL**: `/api/skill-posts/{postId}/comments/{commentId}`
- **Method**: DELETE
- **Description**: Delete a comment (by comment creator or post owner)
- **Authentication**: JWT token in Authorization header
- **Path Variables**: 
  - `postId` (string): ID of the post
  - `commentId` (string): ID of the comment to delete
- **Response**: Returns the updated post without the deleted comment

#### 17. Like/Unlike Skill Post
- **URL**: `/api/skill-posts/{postId}/like`
- **Method**: POST
- **Description**: Like or unlike a skill post (toggles the like status)
- **Authentication**: JWT token in Authorization header
- **Path Variables**: `postId` (string)
- **Response**:
```json
{
  "id": "680c11b25609893d37e6eded",
  "title": "Introduction to Spring Boot",
  "description": "Learn the basics of Spring Boot framework",
  "content": "Spring Boot makes it easy to create stand-alone, production-grade Spring based Applications...",
  "userId": "your.email@example.com",
  "userName": "your.email@example.com",
  "tags": ["Spring", "Java", "Backend"],
  "createdAt": "2025-04-26T04:20:26.3281458",
  "updatedAt": "2025-04-26T04:25:12.9876543",
  "likes": 1,
  "comments": []
}
```

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
