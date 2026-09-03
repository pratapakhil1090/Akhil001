# Netlify Deployment Guide – Dr. Esha Pandey Dental Clinic

This website is a modern, high-performance static web application designed for seamless 1-click deployment on **Netlify**.

## Zero Configuration Needed
- **No backend server required**: Appointments are delivered straight to the clinic's official WhatsApp (`+91 74600 10035`).
- **No database required**: Zero storage maintenance, zero costs, and total patient privacy.
- **No environment variables required**: Deploy straight out of the box with default settings.

---

## 🚀 How to Deploy on Netlify

### Option A: Import from Git (Recommended)
1. Push this repository to your **GitHub**, **GitLab**, or **Bitbucket** account.
2. Log in to [Netlify](https://app.netlify.com/).
3. Click **Add new site** &rarr; **Import an existing project**.
4. Select your repository.
5. The build settings will automatically be detected from `netlify.toml`:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
6. Click **Deploy site**.
7. Your website is live within 60 seconds with a free SSL certificate!

### Option B: Netlify Drop (Manual ZIP Upload)
1. Run `npm run build` locally to generate the `dist` folder.
2. Drag and drop the `dist` folder directly onto [Netlify Drop](https://app.netlify.com/drop).
3. The website is immediately live!

---

## 📱 Features Included
- **WhatsApp Appointment System**: Pre-fills patient name, phone number, requested service, date, time, and symptoms directly into WhatsApp.
- **Direct Phone Calls**: One-tap phone calling button for instant telephone consultations.
- **Interactive Google Maps**: Direct link to the clinic's location in Rashmi Khand, Sharda Nagar, Lucknow.
- **Mobile Sticky Bar**: Quick call, WhatsApp, and booking access on all smartphones and tablets.
- **100% Static & Secure**: No admin logins, no credentials, and no external attack surface.
