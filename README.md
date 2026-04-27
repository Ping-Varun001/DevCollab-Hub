# Developer Collaboration Hub

A full-stack MERN application designed to help developers, students, and founders connect, form teams, and build projects together. It features an intelligent matching system and real-time project chat.

## 🚀 Technologies Used

- **Frontend:** React, Vite, Tailwind CSS v4, Socket.io-client, Axios, React Router
- **Backend:** Node.js, Express.js, MongoDB (Mongoose), Socket.io, JWT, bcrypt
- **UI/UX:** Glassmorphism design, Dark Royal Blue & Gold theme

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed on your machine:
1. **Node.js**: [Download here](https://nodejs.org/) (Version 18+ recommended)
2. **MongoDB**: You can either install it locally ([Download here](https://www.mongodb.com/try/download/community)) or use a cloud database like MongoDB Atlas.

## ⚙️ Setup Instructions

### 1. Database Configuration
By default, the backend connects to a local MongoDB database named `devcollab`. 
If you are using a local MongoDB installation, make sure the MongoDB service is running. 

If you prefer to use MongoDB Atlas (Cloud), open `backend/.env` and replace the `MONGO_URI` value with your Atlas connection string.

### 2. Backend Setup
The backend runs the API, authentication, matching service, and WebSocket server.

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install the necessary dependencies:
   ```bash
   npm install
   ```
3. Start the backend server:
   ```bash
   npm start
   ```
   *The server will start running on http://localhost:5000*

### 3. Frontend Setup
The frontend is the React application built with Vite.

1. Open a **new terminal window/tab** and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the necessary dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   *The React app will open automatically or be accessible at http://localhost:5173*

## 💡 How to Test the Matching System
To see the intelligent matchmaking in action:
1. Register **Account A** with skills like `React`, `Node.js`.
2. Register **Account B** with skills like `Python`, `Django`.
3. From Account A, create a new project that requires the skill `Python`.
4. Log into Account B and check the Dashboard. You will see Account A's project recommended to you with a high Match Percentage!

## 💬 Real-Time Chat
Once you apply to a project and the creator accepts your application, you will see a "Go to Project Chat" button on the project details page. This allows real-time communication using Socket.io.
