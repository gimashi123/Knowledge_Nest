# Skill Posts Feature

This directory contains the frontend implementation for the Skill Posts feature of the Knowledge Nest application.

## Features

- View all skill posts with pagination
- View trending skill posts
- Search for skill posts
- Create new skill posts
- Edit existing skill posts (for owners)
- Delete skill posts (for owners)
- Add comments to skill posts
- Like/unlike skill posts

## Pages

1. **SkillPostsPage** (`SkillPostsPage.tsx`):
   - Main listing page that displays all skill posts
   - Includes search functionality
   - Shows trending posts in a separate tab
   - Includes pagination for browsing through posts

2. **SkillPostFormPage** (`SkillPostFormPage.tsx`):
   - Form for creating new skill posts
   - Form for editing existing skill posts
   - Includes validation using Zod
   - Tag management with ability to add/remove tags

3. **SkillPostDetailPage** (`SkillPostDetailPage.tsx`):
   - Displays detailed view of a single skill post
   - Shows comments
   - Allows adding new comments
   - Provides edit/delete options for owners

## Components

- `SkillPostCard`: Reusable card component for displaying skill posts in both list and detail views

## API Integration

The feature uses the backend API endpoints as documented in the Knowledge Nest API Guide:

- GET `/api/skill-posts/view` - Get all skill posts with filtering and pagination
- GET `/api/skill-posts/{id}` - Get a specific skill post by ID
- POST `/api/skill-posts` - Create a new skill post
- PUT `/api/skill-posts/{id}` - Update an existing skill post
- DELETE `/api/skill-posts/{id}` - Delete a skill post
- POST `/api/skill-posts/{postId}/comments` - Add a comment to a skill post
- POST `/api/skill-posts/{postId}/like` - Like or unlike a skill post

## Routes

The following routes are added in `App.tsx`:

- `/skills` - List of all skill posts
- `/skills/create` - Create a new skill post
- `/skills/:id` - View a specific skill post
- `/skills/edit/:id` - Edit a specific skill post

All routes are protected and require authentication.

## Usage

1. Navigate to `/skills` to view all skill posts
2. Click on "New Post" to create a new skill post
3. Click on a post card to view its details
4. If you're the owner, you can edit or delete the post from the detail view
5. You can add comments to any post from the detail view 