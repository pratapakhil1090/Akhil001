import express, { Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { DatabaseSync } from "node:sqlite";
import { createServer as createViteServer } from "vite";

// ----------------------------------------------------
// DATABASE INITIALIZATION (SQLite)
// ----------------------------------------------------

const DATA_DIR = path.join(process.cwd(), "data");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, "dental_clinic.db");
const db = new DatabaseSync(DB_PATH);

// Enable WAL mode for optimal concurrent performance and durability
db.exec("PRAGMA journal_mode = WAL;");
db.exec("PRAGMA foreign_keys = ON;");

// Create schema
db.exec(`
  CREATE TABLE IF NOT EXISTS admin_users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    salt TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS appointments (
    id TEXT PRIMARY KEY,
    patient_name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    email TEXT NOT NULL DEFAULT '',
    appointment_date TEXT NOT NULL,
    appointment_time TEXT NOT NULL,
    service TEXT NOT NULL,
    notes TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'Pending',
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS admin_sessions (
    token TEXT PRIMARY KEY,
    username TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    expires_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS clinic_settings (
    setting_key TEXT PRIMARY KEY,
    setting_value TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
`);

// ----------------------------------------------------
// CRYPTOGRAPHY & CREDENTIALS
// ----------------------------------------------------

function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
}

function generateSalt(): string {
  return crypto.randomBytes(16).toString("hex");
}

function verifyPassword(password: string, salt: string, expectedHash: string): boolean {
  try {
    const checkHash = hashPassword(password, salt);
    return crypto.timingSafeEqual(Buffer.from(checkHash, "hex"), Buffer.from(expectedHash, "hex"));
  } catch {
    return false;
  }
}

// Ensure the new secure admin credentials exist in database
// Username: ClinicAdmin_7X9
// Password: DrEsha@Admin#7392
function initializeDatabaseDefaults() {
  // Purge any old demo accounts (such as legacy 'admin')
  db.prepare("DELETE FROM admin_users WHERE LOWER(username) = 'admin'").run();

  // Check if primary admin account exists
  const existingAdmin = db
    .prepare("SELECT * FROM admin_users WHERE LOWER(username) = LOWER(?)")
    .get("ClinicAdmin_7X9") as any;

  if (!existingAdmin) {
    const salt = generateSalt();
    const passwordHash = hashPassword("DrEsha@Admin#7392", salt);
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO admin_users (id, username, password_hash, salt, email, phone, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      "admin_primary",
      "ClinicAdmin_7X9",
      passwordHash,
      salt,
      "admin@dreshapandey.com",
      "74600 10035",
      now,
      now
    );
  }

  // Initialize clinic settings if absent
  const phoneSetting = db.prepare("SELECT * FROM clinic_settings WHERE setting_key = 'phone'").get() as any;
  if (!phoneSetting) {
    const now = new Date().toISOString();
    db.prepare("INSERT INTO clinic_settings (setting_key, setting_value, updated_at) VALUES (?, ?, ?)")
      .run("phone", "74600 10035", now);
    db.prepare("INSERT INTO clinic_settings (setting_key, setting_value, updated_at) VALUES (?, ?, ?)")
      .run("email", "dr.eshapandey@gmail.com", now);
  }

  // Clean up legacy JSON files if they exist to prevent confusion
  const legacyFiles = ["admin-config.json", "appointments.json", "settings.json", "sessions.json"];
  for (const file of legacyFiles) {
    const p = path.join(DATA_DIR, file);
    if (fs.existsSync(p)) {
      try {
        fs.unlinkSync(p);
      } catch {
        // ignore
      }
    }
  }
}

initializeDatabaseDefaults();

// ----------------------------------------------------
// AUTHENTICATION MIDDLEWARE
// ----------------------------------------------------

interface AdminUserRecord {
  username: string;
  email: string;
  phone: string;
}

interface AuthenticatedRequest extends Request {
  adminUser?: AdminUserRecord;
  sessionToken?: string;
}

function requireAdminAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized. Admin credentials required." });
    return;
  }

  const token = authHeader.substring(7).trim();
  if (!token) {
    res.status(401).json({ error: "Unauthorized. Missing authentication token." });
    return;
  }

  const session = db
    .prepare("SELECT * FROM admin_sessions WHERE token = ?")
    .get(token) as any;

  if (!session) {
    res.status(401).json({ error: "Invalid session or logged out. Please log in again." });
    return;
  }

  if (session.expires_at < Date.now()) {
    db.prepare("DELETE FROM admin_sessions WHERE token = ?").run(token);
    res.status(401).json({ error: "Session expired. Please log in again." });
    return;
  }

  const user = db
    .prepare("SELECT username, email, phone FROM admin_users WHERE username = ?")
    .get(session.username) as any;

  if (!user) {
    db.prepare("DELETE FROM admin_sessions WHERE token = ?").run(token);
    res.status(401).json({ error: "User account no longer exists." });
    return;
  }

  req.adminUser = user;
  req.sessionToken = token;
  next();
}

// ----------------------------------------------------
// SERVER APPLICATION
// ----------------------------------------------------

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // CORS Middleware: Allow cross-origin requests from Netlify and any client
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, PATCH, DELETE, OPTIONS"
    );
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
      res.sendStatus(204);
      return;
    }
    next();
  });

  // Health check endpoint for monitoring & Netlify connectivity tests
  app.get("/api/health", (_req: Request, res: Response) => {
    res.json({
      status: "ok",
      service: "Dr. Esha Pandey Dental Clinic Backend",
      database: "SQLite (WAL mode)",
      timestamp: new Date().toISOString(),
    });
  });

  // ----------------------------------------------------
  // PUBLIC API ENDPOINTS
  // ----------------------------------------------------

  // Public: Submit appointment request (Saved to SQLite database)
  app.post("/api/appointments", (req: Request, res: Response) => {
    try {
      const {
        patientName,
        phoneNumber,
        email,
        appointmentDate,
        preferredDate,
        appointmentTime,
        preferredTime,
        service,
        reasonForVisit,
        notes,
      } = req.body;

      if (!patientName || typeof patientName !== "string" || !patientName.trim()) {
        res.status(400).json({ error: "Patient name is required" });
        return;
      }

      if (!phoneNumber || typeof phoneNumber !== "string" || !phoneNumber.trim()) {
        res.status(400).json({ error: "Phone number is required" });
        return;
      }

      const id = "apt_" + Date.now() + "_" + crypto.randomBytes(3).toString("hex");
      const createdAt = new Date().toISOString();

      const finalDate = (appointmentDate || preferredDate || "Flexible").trim();
      const finalTime = (appointmentTime || preferredTime || "Flexible").trim();
      const finalService = (service || "General Dental Consultation").trim();
      const finalNotes = (notes || reasonForVisit || "").trim();
      const finalEmail = (email || "").trim();

      db.prepare(`
        INSERT INTO appointments (
          id, patient_name, phone_number, email,
          appointment_date, appointment_time, service,
          notes, status, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        id,
        patientName.trim(),
        phoneNumber.trim(),
        finalEmail,
        finalDate,
        finalTime,
        finalService,
        finalNotes,
        "Pending",
        createdAt
      );

      res.status(201).json({
        success: true,
        message: "Appointment request submitted successfully",
        appointmentId: id,
      });
    } catch (error) {
      console.error("Error saving appointment request:", error);
      res.status(500).json({ error: "Failed to record appointment in database" });
    }
  });

  // Public: Dynamic Clinic info
  app.get("/api/clinic-info", (_req: Request, res: Response) => {
    try {
      const phoneRow = db.prepare("SELECT setting_value FROM clinic_settings WHERE setting_key = 'phone'").get() as any;
      const emailRow = db.prepare("SELECT setting_value FROM clinic_settings WHERE setting_key = 'email'").get() as any;

      res.json({
        success: true,
        phone: phoneRow?.setting_value || "74600 10035",
        email: emailRow?.setting_value || "dr.eshapandey@gmail.com",
      });
    } catch (error) {
      console.error("Error fetching clinic info:", error);
      res.status(500).json({ error: "Failed to fetch clinic information" });
    }
  });

  // Public: Secure Admin Login
  app.post("/api/admin/login", (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;

      if (!username || !password || typeof username !== "string" || typeof password !== "string") {
        res.status(400).json({ error: "Username and password are required" });
        return;
      }

      const cleanUsername = username.trim();
      const user = db
        .prepare("SELECT * FROM admin_users WHERE LOWER(username) = LOWER(?) OR LOWER(email) = LOWER(?)")
        .get(cleanUsername, cleanUsername) as any;

      if (!user) {
        res.status(401).json({ error: "Invalid username or password" });
        return;
      }

      const isValidPassword = verifyPassword(password, user.salt, user.password_hash);
      if (!isValidPassword) {
        res.status(401).json({ error: "Invalid username or password" });
        return;
      }

      // Generate cryptographically secure 32-byte session token
      const token = crypto.randomBytes(32).toString("hex");
      const createdAt = Date.now();
      const expiresAt = createdAt + 24 * 60 * 60 * 1000; // 24-hour validity

      db.prepare(`
        INSERT INTO admin_sessions (token, username, created_at, expires_at)
        VALUES (?, ?, ?, ?)
      `).run(token, user.username, createdAt, expiresAt);

      // Return session token and admin details without sensitive secrets
      res.json({
        success: true,
        token,
        admin: {
          username: user.username,
          email: user.email,
          phone: user.phone,
        },
      });
    } catch (error) {
      console.error("Admin login error:", error);
      res.status(500).json({ error: "Login failed due to an internal server error" });
    }
  });

  // ----------------------------------------------------
  // SECURE PROTECTED ADMIN ENDPOINTS
  // ----------------------------------------------------

  // Check current admin session
  app.get("/api/admin/me", requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
    res.json({
      success: true,
      admin: req.adminUser,
    });
  });

  // Admin Logout
  app.post("/api/admin/logout", requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
    if (req.sessionToken) {
      db.prepare("DELETE FROM admin_sessions WHERE token = ?").run(req.sessionToken);
    }
    res.json({ success: true, message: "Logged out successfully" });
  });

  // Get all appointments (Protected: reads all shared records from SQLite)
  app.get("/api/admin/appointments", requireAdminAuth, (_req: AuthenticatedRequest, res: Response) => {
    try {
      const rows = db
        .prepare("SELECT * FROM appointments ORDER BY created_at DESC")
        .all() as any[];

      const appointments = rows.map((r) => ({
        id: r.id,
        patientName: r.patient_name,
        phoneNumber: r.phone_number,
        email: r.email || "",
        appointmentDate: r.appointment_date,
        preferredDate: r.appointment_date,
        appointmentTime: r.appointment_time,
        preferredTime: r.appointment_time,
        service: r.service,
        reasonForVisit: r.notes || r.service,
        notes: r.notes,
        status: r.status,
        createdAt: r.created_at,
      }));

      res.json({
        success: true,
        count: appointments.length,
        appointments,
      });
    } catch (error) {
      console.error("Error fetching appointments from database:", error);
      res.status(500).json({ error: "Failed to fetch appointments from database" });
    }
  });

  // Update appointment status: Pending | Confirmed | Completed | Cancelled
  app.patch("/api/admin/appointments/:id", requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const allowedStatuses = ["Pending", "Confirmed", "Completed", "Cancelled"];
      if (!allowedStatuses.includes(status)) {
        res.status(400).json({
          error: "Invalid status. Allowed values are: Pending, Confirmed, Completed, Cancelled.",
        });
        return;
      }

      const result = db.prepare("UPDATE appointments SET status = ? WHERE id = ?").run(status, id);

      if (result.changes === 0) {
        res.status(404).json({ error: "Appointment request not found" });
        return;
      }

      res.json({ success: true, message: "Status updated successfully" });
    } catch (error) {
      console.error("Error updating appointment status:", error);
      res.status(500).json({ error: "Failed to update appointment status" });
    }
  });

  // Delete appointment request (with confirmation)
  app.delete("/api/admin/appointments/:id", requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const result = db.prepare("DELETE FROM appointments WHERE id = ?").run(id);

      if (result.changes === 0) {
        res.status(404).json({ error: "Appointment request not found" });
        return;
      }

      res.json({ success: true, message: "Appointment request deleted successfully" });
    } catch (error) {
      console.error("Error deleting appointment:", error);
      res.status(500).json({ error: "Failed to delete appointment" });
    }
  });

  // Update Admin Credentials (username and/or password)
  app.post("/api/admin/change-credentials", requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      const { currentPassword, newUsername, newPassword } = req.body;

      if (!currentPassword) {
        res.status(400).json({ error: "Current password is required to change credentials" });
        return;
      }

      const currentAdmin = req.adminUser!;
      const user = db
        .prepare("SELECT * FROM admin_users WHERE username = ?")
        .get(currentAdmin.username) as any;

      if (!user || !verifyPassword(currentPassword, user.salt, user.password_hash)) {
        res.status(401).json({ error: "Current password is incorrect" });
        return;
      }

      let updatedUsername = user.username;
      let updatedSalt = user.salt;
      let updatedHash = user.password_hash;
      const now = new Date().toISOString();

      if (newUsername && typeof newUsername === "string" && newUsername.trim()) {
        const cleanUser = newUsername.trim();
        if (cleanUser.length < 3) {
          res.status(400).json({ error: "Username must be at least 3 characters long" });
          return;
        }

        // Verify if username already taken by another account
        const existing = db
          .prepare("SELECT * FROM admin_users WHERE LOWER(username) = LOWER(?) AND id != ?")
          .get(cleanUser, user.id) as any;

        if (existing) {
          res.status(400).json({ error: "Username is already in use by another administrator." });
          return;
        }
        updatedUsername = cleanUser;
      }

      if (newPassword && typeof newPassword === "string" && newPassword.trim()) {
        if (newPassword.length < 6) {
          res.status(400).json({ error: "New password must be at least 6 characters long" });
          return;
        }
        updatedSalt = generateSalt();
        updatedHash = hashPassword(newPassword, updatedSalt);
      }

      db.prepare(`
        UPDATE admin_users
        SET username = ?, salt = ?, password_hash = ?, updated_at = ?
        WHERE id = ?
      `).run(updatedUsername, updatedSalt, updatedHash, now, user.id);

      // Update session record
      if (req.sessionToken) {
        db.prepare("UPDATE admin_sessions SET username = ? WHERE token = ?")
          .run(updatedUsername, req.sessionToken);
      }

      res.json({
        success: true,
        message: "Admin credentials updated successfully",
        admin: {
          username: updatedUsername,
          email: user.email,
          phone: user.phone,
        },
      });
    } catch (error) {
      console.error("Error changing credentials:", error);
      res.status(500).json({ error: "Failed to update admin credentials" });
    }
  });

  // Get Admin / Clinic Settings
  app.get("/api/admin/settings", requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      const phoneRow = db.prepare("SELECT setting_value FROM clinic_settings WHERE setting_key = 'phone'").get() as any;
      const emailRow = db.prepare("SELECT setting_value FROM clinic_settings WHERE setting_key = 'email'").get() as any;

      res.json({
        success: true,
        settings: {
          username: req.adminUser?.username,
          phone: phoneRow?.setting_value || req.adminUser?.phone || "74600 10035",
          email: emailRow?.setting_value || req.adminUser?.email || "dr.eshapandey@gmail.com",
        },
      });
    } catch (error) {
      console.error("Error reading settings:", error);
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  // Update Clinic Settings (phone, email)
  app.post("/api/admin/settings", requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      const { phone, email } = req.body;
      const now = new Date().toISOString();

      if (phone && typeof phone === "string") {
        db.prepare(`
          INSERT INTO clinic_settings (setting_key, setting_value, updated_at)
          VALUES ('phone', ?, ?)
          ON CONFLICT(setting_key) DO UPDATE SET setting_value = excluded.setting_value, updated_at = excluded.updated_at
        `).run(phone.trim(), now);

        db.prepare("UPDATE admin_users SET phone = ?, updated_at = ? WHERE username = ?")
          .run(phone.trim(), now, req.adminUser!.username);
      }

      if (email && typeof email === "string") {
        db.prepare(`
          INSERT INTO clinic_settings (setting_key, setting_value, updated_at)
          VALUES ('email', ?, ?)
          ON CONFLICT(setting_key) DO UPDATE SET setting_value = excluded.setting_value, updated_at = excluded.updated_at
        `).run(email.trim(), now);

        db.prepare("UPDATE admin_users SET email = ?, updated_at = ? WHERE username = ?")
          .run(email.trim(), now, req.adminUser!.username);
      }

      res.json({
        success: true,
        message: "Clinic settings updated successfully",
        settings: {
          username: req.adminUser!.username,
          phone: phone ? phone.trim() : req.adminUser!.phone,
          email: email ? email.trim() : req.adminUser!.email,
        },
      });
    } catch (error) {
      console.error("Error updating settings:", error);
      res.status(500).json({ error: "Failed to update settings" });
    }
  });

  // ----------------------------------------------------
  // VITE SPA MIDDLEWARE / STATIC ASSETS
  // ----------------------------------------------------
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Dental Clinic SQLite Server running on port ${PORT}`);
  });
}

startServer();
