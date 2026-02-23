🎓 Skill Sharing Platform
A web-based skill-sharing platform was developed as part of a university assignment. The application allows users to share and learn various skills through articles, videos, and interactive challenges. It also features user authentication, profile management, and a quiz-based learning system to enhance engagement and knowledge retention.

🚀 Features
🧑‍🏫 Skill Sharing: Users can upload and explore articles or videos categorized by skill (e.g., coding, cooking, DIY).

🧹 Interactive Challenges: Create and attempt skill-based challenges with difficulty levels (Beginner, Intermediate, Pro).

🔐 Authentication & Authorization:

OAuth2 login with Google/Facebook/Instagram
JWT-based secure access control
Role-based access for Admins and Users
👤 User Management:

User registration and login
Profile update and password change
Secure handling of user data
📊 Progress Tracking: Quizzes and challenges help users track their learning.

🛠️ Admin Panel: Manage users, content, and challenges.

🛠 Tech Stack
Layer	Technology
Frontend	React, TypeScript, ShadCN UI, Tailwind CSS
Backend	Java Spring Boot
Database	MongoDB
Authentication	OAuth 2.0, JWT
Styling	Tailwind CSS
📁 Project Structure
/client       → Frontend (React + TS + ShadCN)
/server       → Backend (Java Spring Boot)
/docs         → Documentation and assets
⚙️ Setup Instructions
Backend (Spring Boot)
Clone the repository:

git clone https://github.com/your-username/skill-sharing-platform.git
Navigate to the backend directory:

cd backend
Configure your .env or application.properties for database and OAuth settings.

Run the backend:

./mvnw spring-boot:run
Frontend (React)
Navigate to the frontend directory:
cd frontend

Install dependencies:
npm install

Start the development server:
npm run dev
