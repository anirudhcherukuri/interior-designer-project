# 🏠 Interior Designer Portfolio

A full-stack interior design portfolio website with a React frontend and Node.js/Express backend connected to MongoDB Atlas.

## 🗂️ Project Structure

```
Interior_designer_project/
├── frontend/   → React app (deploy to Netlify or Vercel)
└── backend/    → Express API (deploy to Render)
```

---

## 🚀 Deployment Guide

### Step 1: Deploy Backend to Render

1. Go to [render.com](https://render.com) → **New Web Service**
2. Connect your GitHub repo
3. Set the **Root Directory** to `backend`
4. Set the **Build Command** to: `npm install`
5. Set the **Start Command** to: `npm start`
6. Add these **Environment Variables** in Render's dashboard:
   - `MONGO_URI` → your MongoDB Atlas connection string
   - `FRONTEND_URL` → your Netlify/Vercel URL (add after frontend deploy)
   - `PORT` → `5000` (Render sets this automatically)
7. Click **Deploy** — note your Render URL (e.g. `https://your-app.onrender.com`)

---

### Step 2: Deploy Frontend to Netlify

1. Go to [netlify.com](https://netlify.com) → **Add new site → Import from Git**
2. Connect your GitHub repo
3. Set **Base directory** to `frontend`
4. Set **Build command** to: `npm run build`
5. Set **Publish directory** to: `frontend/build`
6. Add this **Environment Variable** in Netlify's dashboard:
   - `REACT_APP_API_URL` → your Render backend URL (e.g. `https://your-app.onrender.com`)
7. Click **Deploy site**

---

### Step 2 (Alternative): Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import your GitHub repo
3. Set **Root Directory** to `frontend`
4. Add **Environment Variable**:
   - `REACT_APP_API_URL` → your Render backend URL
5. Click **Deploy**

---

### Step 3: Update CORS on Backend

After deploying the frontend, go back to Render and update:
- `FRONTEND_URL` → your actual Netlify/Vercel URL

This allows the backend to accept requests from your frontend domain.

---

## 🔧 Local Development

### Backend
```bash
cd backend
npm install
# Create .env file (see .env.example)
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm start
```

---

## 🌐 Tech Stack

- **Frontend**: React 19, React Router, Axios, Framer Motion, TailwindCSS
- **Backend**: Node.js, Express, Mongoose, Multer, CORS
- **Database**: MongoDB Atlas
- **Deployment**: Netlify/Vercel (frontend) + Render (backend)
