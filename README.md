# PlanetPulse

**Hackathon ID:** AZIS-XMBPAQ
**Track:** A carbon footprint tracker - PlanetPulse
**Live App URL:** https://planet-pulse-olive.vercel.app/
**Demo Video:** https://drive.google.com/file/d/1HrqvkJyRM67Tf6GLC0tfa2J-JbVL-Vqo/view?usp=sharing

**API Status:** [Yes/No, I have implemented the standard API for this track]
**Test Credentials:** As per the hackathon rules, this project does not include authentication (login/signup). Anyone can access and test all features without creating an account.

PlanetPulse is split into a React/Vite frontend and a Node/Express/MongoDB backend.

## Project structure

planetpulse_project/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── DashboardView.jsx
│   │   │   ├── HistoryView.jsx
│   │   │   ├── LogActivityView.jsx
│   │   │   ├── SettingsView.jsx
│   │   │   └── ui.jsx
│   │   ├── hooks/
│   │   │   └── useAppStore.js
│   │   ├── utils/
│   │   │   ├── constants.js
│   │   │   └── emissions.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── ...
└── backend/
    ├── models/
    │   ├── Activity.js
    │   └── Setting.js
    ├── routes/
    │   ├── activities.js
    │   └── settings.js
    ├── server.js
    ├── package.json
    └── .env.example


## 1. Backend setup

cd backend
npm install

Copy `.env.example` to `.env` and set your MongoDB connection string.

Example:

PORT=5000
MONGODB_URI=mongodb+srv://shivamshakya4270_db_user:ePJuPAPt2EfqnKao@planetpulse.a5duidy.mongodb.net/?appName=planetpulse

Start backend:

npm run dev

Backend:
- https://planetpulse-1sx0.onrender.com
- Health: https://planetpulse-1sx0.onrender.com/api/activities

## 2. Frontend setup

Open another terminal:

cd frontend
npm install

Optional `.env`:

VITE_API_URL=https://planetpulse-1sx0.onrender.com

Start frontend:

npm run dev

Frontend:
- https://planet-pulse-olive.vercel.app/

## API endpoints

### Activities
- GET `/api/activities`
- POST `/api/activities`
- DELETE `/api/activities/:id`

### Settings
- GET `/api/settings`
- PUT `/api/settings`

### Clear
- POST `/api/clear`

The frontend calculates CO₂ and sends the resulting activity to the backend, matching the behavior of the supplied code.
