# EduFeedback - Student Feedback Review System (ASS_7)

A full-stack web application designed for students to share feedback about their courses and faculty, and for administrators to monitor and analyze the reviews. Built with the MERN stack (MongoDB, Express, React, Node.js).

## 🚀 Features

- **Role-based Access**: Users can register and log in as either a `Student` or an `Admin`.
- **Student Dashboard**: Submit reviews (with an anonymous option), provide a 5-star rating, and view previous feedback.
- **Admin Panel**: Monitor organization-wide feedback with analytical stats (average rating, total feedback by category). Admins can also delete inappropriate feedback.
- **Modern UI**: Designed with a sleek, dark-themed interface with interactive components using React.
- **Secure Authentication**: Passwords encrypted via bcrypt and protected routing setup via JWT (JSON Web Tokens).
- **Responsive Layout**: Works beautifully on mobile screens or desktops.

## 🛠️ Technology Stack

- **Frontend**: React.js (built with Vite), React Router DOM, Axios, standard CSS for dynamic styling.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Local Instance / Atlas compatible).
- **Authentication**: JWT, bcryptjs.

## 📦 Setting Up and Running Locally

Ensure you have Node.js and MongoDB installed on your local machine.

### 1. Database Setup
The backend is set to run with a local MongoDB instance by default. Ensure your MongoDB server is running:
- Default DB URL: `mongodb://127.0.0.1:27017/feedbackDB`

### 2. Run the Backend Server
```bash
cd backend
npm install
# Ensure you provide a secure secret for the JWT_SECRET in `backend/.env`
npm run dev
```

### 3. Run the Frontend Server
```bash
cd frontend
npm install
npm run dev
```
Navigate to `http://localhost:5175/` (or the port specified by Vite in your terminal) to experience the app.

---
_Developed as part of Assignment 7._
