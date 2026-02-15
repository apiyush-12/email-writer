🚀 Email Writer Assistant

An AI-powered Email Reply Generator with Gmail Chrome Extension integration.

This project allows users to generate professional email replies using Google Gemini AI — accessible via both a web interface and directly inside Gmail.

🌍 Live Demo

🔗 Frontend (Vercel):

https://your-frontend-url.vercel.app


🔗 Backend API (Render):

https://your-backend-url.onrender.com

🧠 Features

✨ AI-generated email replies

🎯 Tone selection (Formal, Friendly, Professional, etc.)

🌐 Live deployed full-stack application

🧩 Gmail Chrome Extension integration

🔐 Secure API key using environment variables

🐳 Dockerized Spring Boot backend

☁️ Cloud deployment (Render + Vercel)

🏗 Architecture
React Frontend (Vercel)
        ↓
Spring Boot Backend (Render - Dockerized)
        ↓
Google Gemini API
        ↓
AI Response
        ↓
Chrome Extension (Gmail Integration)

🛠 Tech Stack
Frontend

React.js

Material UI

Axios

Vercel Deployment

Backend

Spring Boot 4

Maven

Docker

REST API

Render Deployment

Extension

Chrome Extension (Manifest V3)

DOM Injection

MutationObserver

AI

Google Gemini API

🔐 Environment Variables

Backend requires:

GEMINI_API_KEY=your_gemini_api_key


Configured securely in Render environment settings.

📦 Installation (Local Setup)
1️⃣ Clone Repository
git clone https://github.com/your-username/email-writer.git
cd email-writer

2️⃣ Backend Setup
cd email-writer-sb
mvn clean install
mvn spring-boot:run


Set environment variable:

export GEMINI_API_KEY=your_key   # Mac/Linux
setx GEMINI_API_KEY "your_key"  # Windows

3️⃣ Frontend Setup
cd email-writer-react
npm install
npm start

4️⃣ Chrome Extension Setup

Go to chrome://extensions

Enable Developer Mode

Click Load Unpacked

Select email-writer-ext folder

📌 Key Learnings

Production deployment with Docker

Environment variable security

Java version compatibility management

CORS configuration

Chrome extension DOM manipulation

Full-stack cloud architecture

📈 Future Improvements

User authentication

AI tone customization popup in Gmail

Signature auto-detection

Rate limiting

Analytics dashboard

Chrome Web Store publishing

👨‍💻 Developer

Piyush Kumar
Full-Stack Developer | AI & Cloud Enthusiast
