# Netlify Deployment Guide

This project is fully configured for deployment on **Netlify** with Vite, Tailwind CSS, and client-side single-page application (SPA) routing.

---

## 1. Quick Deploy to Netlify (Frontend)

### Option A: Via GitHub (Recommended)
1. Push this project to your GitHub repository.
2. Log into your [Netlify Dashboard](https://app.netlify.com/).
3. Click **"Add new site"** > **"Import an existing project"** > **GitHub**.
4. Select your repository.
5. Netlify will automatically detect settings from `netlify.toml`:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Node version:** `20`
6. Click **"Deploy site"**. Your website will be live in seconds!

### Option B: Netlify CLI
Run the following commands in your terminal:
```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```

---

## 2. Understanding Full-Stack vs. Netlify Static Hosting

### Frontend Features on Netlify
- All public pages (Hero, About Dr. Esha Pandey, Treatments, RCT Specialization, Clinic Trust, Contact).
- Interactive Booking Form with phone & WhatsApp integration.
- Instant client-side routing (`/#admin`, `/#book`, etc.).
- Fast CDN delivery with optimized caching headers.

### Admin Portal & Shared Appointments
- **In Local / Full-Stack Mode (or Cloud Run / Render):**
  The Express backend (`server.ts`) runs with a persistent SQLite database (`dental_clinic.db`). All admins see synchronized appointments across different devices.
- **In Pure Netlify Static Mode (No Backend Attached):**
  Netlify serves the compiled static files from `dist`. The frontend contains a built-in fallback engine that allows appointments and admin logins (`ClinicAdmin_7X9` / `DrEsha@Admin#7392`) to function on that browser without crashing.

---

## 3. Connecting a Persistent Shared Database to Netlify (Optional)

If you want administrators on different computers/phones to access the same synchronized SQLite database while hosting the frontend on Netlify:

1. **Deploy the backend (`server.ts`)** to a Node hosting service that supports persistent servers:
   - [Render](https://render.com/) (Web Service with persistent disk)
   - [Railway](https://railway.app/)
   - [Google Cloud Run](https://cloud.google.com/run)
   - [Fly.io](https://fly.io/)

2. **Connect it to Netlify:**
   - Go to your Netlify site dashboard: **Site configuration** > **Environment variables**.
   - Add variable:
     - **Key:** `VITE_API_URL`
     - **Value:** `https://your-backend-url.onrender.com` (your backend's live URL)
   - Trigger a redeploy on Netlify.

---

## 4. Admin Credentials

- **Username:** `ClinicAdmin_7X9`
- **Password:** `DrEsha@Admin#7392`
- **Admin Portal URL:** `https://your-site.netlify.app/#admin`
