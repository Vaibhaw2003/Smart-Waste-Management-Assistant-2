# ♻️ Smart Waste Management Assistant

An AI-powered **Smart Waste Management Assistant** designed with a modular architecture consisting of an AI service, backend, frontend, and MongoDB database.

## 🚀 Project Overview

The project contains three main application components:

* 🤖 **AI Service** — Python-based service for waste-related processing
* ⚙️ **Backend** — Node.js backend
* 💻 **Frontend** — User-facing web application
* 🗄️ **MongoDB** — Database required by the backend

The AI service currently uses **keyword-based rules** and can later be upgraded by replacing `predict.py` with a trained machine-learning model.

---

## 🏗️ Project Architecture

```text
Smart Waste Management Assistant
│
├── AI Service
│   ├── Python
│   ├── FastAPI / Uvicorn
│   └── predict.py
│
├── Backend
│   ├── Node.js
│   ├── npm
│   └── MongoDB
│
└── Frontend
    ├── Web Application
    └── npm
```

### System Flow

```text
        User
          │
          ▼
      Frontend
          │
          ▼
       Backend
          │
     ┌────┴────┐
     ▼         ▼
 MongoDB    AI Service
              │
              ▼
          predict.py
```

---

## 🤖 AI Service

The AI service runs on **port 8000**.

Currently, the service uses keyword rules out of the box.

The AI implementation can later be upgraded by replacing:

```text
predict.py
```

with a trained machine-learning model.

---

## ⚙️ Backend

The backend is a **Node.js** application and requires MongoDB to be running.

Install the dependencies:

```bash
cd backend
npm install
```

Start the backend:

```bash
npm run dev
```

Before starting the backend, configure your environment variables by copying:

```text
.env.example
```

to:

```text
.env
```

---

## 💻 Frontend

Install frontend dependencies:

```bash
cd frontend
npm install
```

Start the frontend:

```bash
npm run dev
```

The frontend can then be accessed through the development URL provided by Vite.

---

## 🤖 AI Service Setup

Create and activate a Python virtual environment:

```bash
cd ml-model

python -m venv venv
```

### Windows

```bash
venv\Scripts\activate
```

Install the required Python packages:

```bash
pip install -r requirements.txt
```

Start the AI service:

```bash
uvicorn app:app --reload --port 8000
```

---

## 🔐 Admin Dashboard

The project includes an admin dashboard.

To access the admin dashboard, register using the email configured as:

```env
ADMIN_EMAIL
```

inside the `.env` file.

---

## 🚀 Quick Start

### 1. Start AI Service

```bash
cd ml-model
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app:app --reload --port 8000
```

### 2. Start Backend

Make sure MongoDB is running.

```bash
cd backend
npm install
npm run dev
```

### 3. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 📁 Project Structure

```text
smart-waste-management-assistant/
│
├── ml-model/
│   ├── app.py
│   ├── predict.py
│   ├── requirements.txt
│   └── venv/
│
├── backend/
│   ├── package.json
│   ├── .env
│   └── ...
│
├── frontend/
│   ├── package.json
│   └── ...
│
└── README.md
```

---

## 🔮 Future Development

The current project uses keyword-based AI rules.

A future version can replace the existing `predict.py` implementation with a **trained machine-learning model** for more advanced waste classification and assistance.

---

## 🛠️ Technologies

| Component  | Technology             |
| ---------- | ---------------------- |
| AI Service | Python                 |
| AI Server  | Uvicorn                |
| Backend    | Node.js                |
| Database   | MongoDB                |
| Frontend   | Web Application        |
| AI Logic   | Keyword Rules          |
| Future AI  | Machine Learning Model |

---

## 📌 Project Status

**Current Status:** Development / Prototype

The application provides a modular foundation with separate AI, backend, frontend, and database components and can be extended with a trained ML model.
