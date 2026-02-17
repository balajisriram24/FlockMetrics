# Smart Livestock / Poultry Farm Management System

A full-stack farm management application with React frontend and Flask backend.

## Tech Stack
- **Frontend:** React (Vite)
- **Backend:** Python Flask (REST API)
- **Database:** MongoDB (pymongo)
- **Auth:** Username/password (admin / 1234)

## Prerequisites
- Node.js 18+
- Python 3.8+
- MongoDB (see options below)

## How to Run

### 1. Database – choose one option

**Option A – MongoDB Atlas (cloud, no install)**  
1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas) and create a free account.  
2. Create a free cluster.  
3. Database Access → Add User (username/password).  
4. Network Access → Add IP Address → Allow from anywhere (`0.0.0.0/0`).  
5. Database → Connect → Drivers → copy connection string.  
6. **Edit `backend/.env`** – replace `YOUR_PASSWORD` with your actual password, or paste your full connection string as `MONGODB_URI=...`

**Option B – Local MongoDB**  
1. Install [MongoDB Community](https://www.mongodb.com/try/download/community).  
2. Start MongoDB: `mongod` (or start the Windows service).

### 2. Start Backend
```bash
cd backend
pip install -r requirements.txt
python app.py
```
Backend runs at **http://localhost:5000**

### 3. Start Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at **http://localhost:3000**

### 4. Use the App
- Open http://localhost:3000
- Login with **admin** / **1234**
- Navigate through Dashboard, Farm, Sales, etc.

## API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/login | Login |
| GET | /api/dashboard | Dashboard stats |
| GET | /api/animals | List animals |
| POST | /api/animals | Add animal |
| PUT | /api/animals/<id> | Update animal |
| GET | /api/animals/tag/<tag_id> | Get animal by tag |
| GET | /api/sales | List sales |
| POST | /api/sales | Add sale |
| GET | /api/profit | Profit summary |
| GET | /api/reports | Reports data |

## Project Structure
```
livestock_project/
  backend/
    app.py           # Flask API
    requirements.txt
  frontend/
    src/
      main.jsx
      App.jsx
      pages/         # Login, Home, Dashboard, etc.
      components/    # Navbar
      api.js         # API client
```
