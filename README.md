# Task Manager – Frontend Developer Internship Task

A full-stack task management app built for the internship assignment.  
Users can register, log in, manage their tasks, and see only their own data using JWT-based authentication.

---

## 🚀 Features

- **User Authentication**
  - Register new users
  - Login with email and password
  - JWT-based authentication
  - Protected dashboard (only logged-in users can access)
  - Logout (clears token and redirects to login)

- **User Profile**
  - `/api/users/me` endpoint returns the logged-in user
  - Dashboard shows a personalised greeting: `Welcome, <name>`

- **Tasks (CRUD)**
  - Create a task (title + description)
  - View all tasks for the logged-in user
  - Delete tasks
  - Backend also supports updating tasks via `PUT /api/tasks/:id`

- **Security**
  - Passwords stored hashed in MongoDB (via bcrypt)
  - JWT auth middleware protects `/api/tasks` and `/api/users/me`
  - Each user can access **only their own tasks**

- **Tech Stack**
  - **Frontend:** React (Vite), React Router, Axios, Tailwind CSS
  - **Backend:** Node.js, Express.js
  - **Database:** MongoDB & Mongoose
  - **Auth:** JSON Web Tokens (JWT)

---

## 📁 Project Structure

```text
root/
  backend/
    server.js
    routes/
      user.js
      task.js
    models/
      User.js
      Task.js
    middleware/
      auth.js
    .env.example
  frontend/
    src/
      App.jsx
      main.jsx
      api/
        axios.js
      pages/
        Login.jsx
        Register.jsx
        Dashboard.jsx
    index.html
    vite.config.js
  README.md
