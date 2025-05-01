# Progress Tracking Feature

This directory contains components for the Progress Tracking feature in the Knowledge Nest application.

## Components

### ProgressList.tsx
The main container component that:
- Fetches all progress items from the backend
- Manages the list of progress items
- Handles creating, updating, and deleting progress items
- Renders the ProgressForm and ProgressItem components

### ProgressItem.tsx
Displays a single progress item with:
- Title
- Progress bar
- Topics list
- Last update time
- Edit and delete buttons

### ProgressForm.tsx
A form for adding new progress items or editing existing ones:
- Title input
- Topics input with add/remove functionality
- Progress percentage slider (for editing only)
- Submit and cancel buttons

## API Integration

This feature integrates with the backend API using the following endpoints:
- `GET /api/progress/all` - Fetch all progress items
- `GET /api/progress/{id}` - Fetch a specific progress item
- `POST /api/progress/add` - Create a new progress item
- `PUT /api/progress/{id}` - Update an existing progress item
- `DELETE /api/progress/{id}` - Delete a progress item

## Styling

Styling is provided in `Progress.css` and follows a clean, modern design with:
- Card-based layout for progress items
- Visual progress bars
- Tag-style representation of topics
- Responsive design for different screen sizes 