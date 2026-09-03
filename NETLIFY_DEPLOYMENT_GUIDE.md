# Netlify & Production Backend Configuration

This project is configured with a dedicated **Node.js/Express backend** and a **persistent SQLite database** (`dental_clinic.db` in WAL mode).

---

## 1. The Production Backend URL for Netlify

In your **Netlify Dashboard**, set the following Environment Variable:

- **Key:** `VITE_API_URL`
- **Value:** `https://ais-pre-sgfj5sj3bq63fxa3xodyzr-623049401971.asia-southeast1.run.app`

### How to set it in Netlify:
1. Open your site on [Netlify](https://app.netlify.com/).
2. Go to **Site configuration** &rarr; **Environment variables**.
3. Click **Add a variable** &rarr; **Add a single variable**.
4. Set **Key** to `VITE_API_URL`.
5. Set **Value** to:
   ```text
   https://ais-pre-sgfj5sj3bq63fxa3xodyzr-623049401971.asia-southeast1.run.app
   ```
6. Click **Create variable**.
7. Go to **Deploys** &rarr; click **Trigger deploy** &rarr; **Clear cache and deploy site**.

> **Note:** Even before setting `VITE_API_URL`, the site includes automatic CORS fallback resolution and Netlify redirect proxying configured in `netlify.toml` and `public/_redirects` pointing directly to this backend!

---

## 2. Verified Backend Capabilities & Endpoints

The backend is running with Express and a real SQLite database. It provides:

| Endpoint | Method | Access | Description |
| :--- | :--- | :--- | :--- |
| `/api/health` | `GET` | Public | Backend status check & SQLite health verification |
| `/api/appointments` | `POST` | Public | Submits appointment directly into SQLite `appointments` table |
| `/api/clinic-info` | `GET` | Public | Returns dynamic phone and email from `clinic_settings` |
| `/api/admin/login` | `POST` | Public | Authenticates credentials with PBKDF2 cryptographic hashing |
| `/api/admin/me` | `GET` | Admin | Validates active session token from `admin_sessions` table |
| `/api/admin/appointments` | `GET` | Admin | Fetches all appointments ordered by creation date |
| `/api/admin/appointments/:id` | `PATCH` | Admin | Updates appointment status (`Pending`, `Confirmed`, `Completed`, `Cancelled`) |
| `/api/admin/appointments/:id` | `DELETE` | Admin | Deletes appointment from the SQLite database |
| `/api/admin/change-credentials` | `POST` | Admin | Changes admin username and password with PBKDF2 hashing |
| `/api/admin/settings` | `GET` / `POST` | Admin | Reads and updates clinic contact details in `clinic_settings` |
| `/api/admin/logout` | `POST` | Admin | Terminates and deletes session token from database |

---

## 3. Administrator Credentials

- **Username:** `ClinicAdmin_7X9`
- **Password:** `DrEsha@Admin#7392`
- **Admin Portal URL:** `https://your-site.netlify.app/#admin`

---

## 4. How to Deploy Your Own Standalone Backend (Optional)

If you ever want to run your own separate Node.js server outside AI Studio (e.g. on Render, Railway, or VPS):

### Option A: Deploy on Render.com (Free / Easy)
1. Push this repository to GitHub.
2. Sign up on [Render.com](https://render.com/).
3. Click **New +** &rarr; **Web Service**.
4. Connect your GitHub repository.
5. Set:
   - **Runtime:** `Node`
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`
   - **Environment Variables:** `PORT=3000`, `NODE_ENV=production`
6. (Optional for persistent storage across restarts): Under **Disks**, add a disk mounted at `/data`.
7. Once deployed, Render will provide a URL like `https://dr-esha-backend.onrender.com`.
8. Put that URL into Netlify as `VITE_API_URL`.

### Option B: Deploy on Railway.app
1. Go to [Railway.app](https://railway.app/).
2. Create **New Project** &rarr; **Deploy from GitHub repo**.
3. Railway automatically detects `package.json` scripts (`build` and `start`).
4. Generate a domain under **Settings** &rarr; **Networking**.
5. Put the Railway URL into Netlify as `VITE_API_URL`.
