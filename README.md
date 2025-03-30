---

# 📄 WarrantyMe Letters App

A full-stack web application where users can **Sign in with Google**, **write letters**, **save drafts locally**, and **save the final letter to their Google Drive**.

---
## 🎬 Demo

[📽️ [Watch Full Demo on Loom](https://www.loom.com/share/7f38c9520c1647ef9330544854352807?sid=c74911b3-6697-488f-abd4-5682661d459a)
](https://www.loom.com/share/41a10b83b5f54c5389e95ba1a1a52369?sid=8e7eef0c-30ca-430a-b52f-f2c8586db1eb)
## 🚀 Features

✅ Google OAuth Login  
✅ Draft & Edit letters  
✅ Save letters to Google Drive  
✅ View previously saved letters  
✅ Clean, distraction-free UI with WarrantyMe branding

---

## 🏗️ Tech Stack

**Frontend:** React + Vite  
**Backend:** Node.js, Express.js  
**Database:** MongoDB (Atlas)  
**Authentication:** Google OAuth 2.0  
**Drive Integration:** Google Drive API  
**Deployment:** Vercel (Frontend) + Render/AWS/Heroku (Backend)

---

## 🌐 Project Structure

```
letter-app/
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── utils/
│   ├── .env.example
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── pages/
│   │   └── App.jsx
│   ├── .env.example
│   └── vite.config.js
└── README.md
```

---

## ⚙️ Environment Variables

Create `.env` files in both `backend/` & `frontend/` and fill:

### Backend `.env`
```
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
DRIVE_REDIRECT_URI=http://localhost:5000/api/auth/callback
```

### Frontend `.env`
```
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

---

## 📝 How it works

### 1. **Authentication**
- User logs in using Google OAuth.
- On successful login → a **JWT token** is stored in localStorage.
- User is redirected to Drive OAuth consent screen.
- After consent, user is redirected to **Dashboard**.

### 2. **Letter Writing**
- User can:
  - Write a letter.
  - Save it as a **Draft (localStorage)**.
  - Save it to **Google Drive** (stored in their account).

### 3. **View Saved Letters**
- On dashboard load → Fetch and display existing saved letters from Google Drive.

---

## 🖥️ Run Locally

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend → http://localhost:5173  
Backend → http://localhost:5000

---

## 🌍 Deployment

**Frontend** → Vercel / Netlify  
**Backend** → Render / Railway / Heroku  
You can deploy from the same repo, but both will be deployed **separately**.

---

## 🎯 Improvements

✅ Draft saving  
✅ Drive letter list  
✅ Polished UI  
✅ Session management  
✅ Token handling  
✅ Error handling

