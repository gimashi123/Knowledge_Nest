# 🎓 Knowledge Nest

A full-stack web application that enables users to **share, learn, and
practice skills** through articles, videos, quizzes, and interactive
challenges.\
Built as a university project with secure authentication, role-based
access control, and progress tracking features.

------------------------------------------------------------------------

## 📌 Overview

The Skill Sharing Platform allows users to:

-   Publish and explore skill-based content
-   Participate in interactive challenges
-   Track learning progress through quizzes
-   Manage profiles securely
-   Access role-based features (Admin / User)

------------------------------------------------------------------------

## 🚀 Key Features

### 🧑‍🏫 Skill Content Management

-   Upload and browse articles or videos
-   Categorized by skill areas (e.g., Coding, Cooking, DIY)
-   Organized and searchable content structure

### 🧩 Interactive Challenges

-   Create and attempt skill-based challenges
-   Difficulty levels: Beginner, Intermediate, Pro
-   Quiz-based learning for engagement and retention

### 🔐 Authentication & Security

-   OAuth 2.0 login (Google, Facebook, Instagram)
-   JWT-based secure authentication
-   Role-based authorization (Admin / User)
-   Secure password management

### 👤 User Management

-   User registration and login
-   Profile update and password change
-   Secure handling of user data

### 📊 Progress Tracking

-   Quiz scoring system
-   Challenge completion tracking
-   Learning progress monitoring

### 🛠 Admin Panel

-   Manage users
-   Manage skill content
-   Manage challenges and quizzes

------------------------------------------------------------------------

## 🛠 Tech Stack

  Layer            Technology
  ---------------- -------------------------
  Frontend         React, TypeScript
  UI Framework     ShadCN UI, Tailwind CSS
  Backend          Java Spring Boot
  Database         MongoDB
  Authentication   OAuth 2.0, JWT
  Styling          Tailwind CSS

------------------------------------------------------------------------

## 📁 Project Structure

/client → Frontend (React + TypeScript + ShadCN)
/server → Backend (Spring Boot)
/docs → Documentation and assets

------------------------------------------------------------------------

## ⚙️ Installation & Setup

### 🔹 Backend (Spring Boot)

1.  Clone the repository
    git clone
    https://github.com/gimashi123/Knowledge_Nest

2.  Navigate to backend directory
    cd server

3.  Configure database and OAuth settings in application.properties

4.  Run the backend
    ./mvnw spring-boot:run

------------------------------------------------------------------------

### 🔹 Frontend (React)

1.  Navigate to frontend directory
    cd client

2.  Install dependencies
    npm install

3.  Start development server
    npm run dev

------------------------------------------------------------------------

## 🔒 Security Highlights

-   JWT-based authentication
-   OAuth 2.0 integration
-   Password encryption
-   Role-based access control


