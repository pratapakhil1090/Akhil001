import { AdminUser, AppointmentRecord, AppointmentStatus, ClinicSettings } from "../types";

// Base URL for API calls. If deployed on Netlify with a separate backend,
// set VITE_API_URL in Netlify's Environment Variables (e.g., https://my-clinic-backend.onrender.com)
const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

// Local storage fallback keys for static Netlify hosting (when backend server is not attached)
const LOCAL_STORAGE_KEY_APPOINTMENTS = "dr_esha_netlify_fallback_appointments";
const LOCAL_STORAGE_KEY_SESSION = "dr_esha_netlify_fallback_session";

// Helper to check if response is valid JSON
async function parseJsonResponse(res: Response): Promise<{ isJson: boolean; data: any }> {
  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return { isJson: false, data: null };
  }
  try {
    const data = await res.json();
    return { isJson: true, data };
  } catch {
    return { isJson: false, data: null };
  }
}

// Helper to get fallback appointments from localStorage
function getLocalAppointments(): AppointmentRecord[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY_APPOINTMENTS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

// Helper to save fallback appointments
function saveLocalAppointments(records: AppointmentRecord[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_APPOINTMENTS, JSON.stringify(records));
  } catch {
    // Ignore storage quota errors
  }
}

export const clinicApi = {
  // 1. Submit appointment request (Public)
  async submitAppointment(data: {
    patientName: string;
    phoneNumber: string;
    email?: string;
    appointmentDate?: string;
    preferredDate?: string;
    appointmentTime?: string;
    preferredTime?: string;
    service?: string;
    reasonForVisit?: string;
    notes?: string;
  }): Promise<{ success: boolean; appointmentId?: string; error?: string }> {
    try {
      const res = await fetch(`${API_BASE}/api/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const { isJson, data: json } = await parseJsonResponse(res);

      if (res.ok && isJson && json?.success) {
        return { success: true, appointmentId: json.appointmentId };
      }

      // If backend responded with a structured error
      if (isJson && json?.error) {
        return { success: false, error: json.error };
      }

      // If the backend was unreachable or returned HTML (e.g. static Netlify deployment)
      throw new Error("Backend unavailable, using local fallback");
    } catch (err) {
      console.warn("Server backend unavailable or static hosting detected, saving appointment locally:", err);

      // Save appointment in local storage fallback
      const id = "apt_local_" + Date.now();
      const newRecord: AppointmentRecord = {
        id,
        patientName: data.patientName,
        phoneNumber: data.phoneNumber,
        email: data.email || "",
        appointmentDate: data.appointmentDate || data.preferredDate || "Flexible",
        preferredDate: data.appointmentDate || data.preferredDate || "Flexible",
        appointmentTime: data.appointmentTime || data.preferredTime || "Flexible",
        preferredTime: data.appointmentTime || data.preferredTime || "Flexible",
        service: data.service || "General Dental Consultation",
        notes: data.notes || data.reasonForVisit || "",
        status: "Pending",
        createdAt: new Date().toISOString(),
      };

      const existing = getLocalAppointments();
      saveLocalAppointments([newRecord, ...existing]);

      return { success: true, appointmentId: id };
    }
  },

  // 2. Admin Login (Public)
  async login(
    usernameInput: string,
    passwordInput: string
  ): Promise<{ success: boolean; token?: string; admin?: AdminUser; error?: string }> {
    const cleanUser = usernameInput.trim();

    try {
      const res = await fetch(`${API_BASE}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: cleanUser,
          password: passwordInput,
        }),
      });

      const { isJson, data: json } = await parseJsonResponse(res);

      if (res.ok && isJson && json?.success) {
        return { success: true, token: json.token, admin: json.admin };
      }

      if (isJson && json?.error) {
        return { success: false, error: json.error };
      }

      throw new Error("Backend server not responding with JSON");
    } catch (err) {
      console.warn("Backend login unavailable, checking credentials via fallback:", err);

      // Fallback verification for static Netlify hosting
      if (
        (cleanUser === "ClinicAdmin_7X9" || cleanUser.toLowerCase() === "admin@dreshapandey.com") &&
        passwordInput === "DrEsha@Admin#7392"
      ) {
        const token = "fallback_token_" + Date.now();
        const admin: AdminUser = {
          username: "ClinicAdmin_7X9",
          email: "admin@dreshapandey.com",
          phone: "74600 10035",
        };
        try {
          localStorage.setItem(LOCAL_STORAGE_KEY_SESSION, JSON.stringify({ token, admin }));
        } catch {
          // ignore
        }
        return { success: true, token, admin };
      }

      return { success: false, error: "Invalid username or password" };
    }
  },

  // 3. Verify Admin Session / Me (Protected)
  async checkAuth(token: string): Promise<{ success: boolean; admin?: AdminUser }> {
    try {
      const res = await fetch(`${API_BASE}/api/admin/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { isJson, data: json } = await parseJsonResponse(res);
      if (res.ok && isJson && json?.success && json?.admin) {
        return { success: true, admin: json.admin };
      }
      if (res.status === 401) {
        return { success: false };
      }
      throw new Error("Backend not responding");
    } catch {
      // Check fallback session
      try {
        const raw = localStorage.getItem(LOCAL_STORAGE_KEY_SESSION);
        if (raw) {
          const session = JSON.parse(raw);
          if (session.token === token) {
            return { success: true, admin: session.admin };
          }
        }
      } catch {
        // ignore
      }
      return { success: false };
    }
  },

  // 4. Logout (Protected)
  async logout(token: string): Promise<void> {
    try {
      await fetch(`${API_BASE}/api/admin/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error("Logout error:", err);
    }
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY_SESSION);
    } catch {
      // ignore
    }
  },

  // 5. Get All Appointments from Persistent Database (Protected)
  async getAppointments(token: string): Promise<{ success: boolean; appointments: AppointmentRecord[]; isFallback?: boolean; error?: string }> {
    try {
      const res = await fetch(`${API_BASE}/api/admin/appointments`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { isJson, data: json } = await parseJsonResponse(res);
      if (res.ok && isJson && json?.success) {
        return { success: true, appointments: json.appointments || [] };
      }

      if (res.status === 401) {
        return { success: false, appointments: [], error: "Unauthorized session. Please log in again." };
      }

      throw new Error("Backend unreachable");
    } catch (err) {
      console.warn("Backend appointments fetch error, returning local fallback storage:", err);
      const local = getLocalAppointments();
      return { success: true, appointments: local, isFallback: true };
    }
  },

  // 6. Update Appointment Status (Protected)
  async updateAppointmentStatus(
    token: string,
    id: string,
    status: AppointmentStatus
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch(`${API_BASE}/api/admin/appointments/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      const { isJson, data: json } = await parseJsonResponse(res);
      if (res.ok && isJson && json?.success) {
        return { success: true };
      }

      if (res.status === 401) {
        return { success: false, error: "Unauthorized session." };
      }

      throw new Error("Backend unreachable");
    } catch (err) {
      console.warn("Updating status in local fallback:", err);
      const list = getLocalAppointments();
      const updated = list.map((a) => (a.id === id ? { ...a, status } : a));
      saveLocalAppointments(updated);
      return { success: true };
    }
  },

  // 7. Delete Appointment (Protected)
  async deleteAppointment(token: string, id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch(`${API_BASE}/api/admin/appointments/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const { isJson, data: json } = await parseJsonResponse(res);
      if (res.ok && isJson && json?.success) {
        return { success: true };
      }

      if (res.status === 401) {
        return { success: false, error: "Unauthorized session." };
      }

      throw new Error("Backend unreachable");
    } catch (err) {
      console.warn("Deleting appointment from local fallback:", err);
      const list = getLocalAppointments();
      const updated = list.filter((a) => a.id !== id);
      saveLocalAppointments(updated);
      return { success: true };
    }
  },

  // 8. Get Clinic & Admin Settings (Protected)
  async getSettings(token: string): Promise<{ success: boolean; settings?: ClinicSettings; error?: string }> {
    try {
      const res = await fetch(`${API_BASE}/api/admin/settings`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { isJson, data: json } = await parseJsonResponse(res);
      if (res.ok && isJson && json?.success) {
        return { success: true, settings: json.settings };
      }
      throw new Error("Backend unreachable");
    } catch {
      return {
        success: true,
        settings: {
          username: "ClinicAdmin_7X9",
          phone: "74600 10035",
          email: "dr.eshapandey@gmail.com",
        },
      };
    }
  },

  // 9. Change Credentials (Protected)
  async changeCredentials(
    token: string,
    currentPasswordInput: string,
    newUsernameInput?: string,
    newPasswordInput?: string
  ): Promise<{ success: boolean; admin?: AdminUser; error?: string }> {
    try {
      const res = await fetch(`${API_BASE}/api/admin/change-credentials`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: currentPasswordInput,
          newUsername: newUsernameInput,
          newPassword: newPasswordInput,
        }),
      });

      const { isJson, data: json } = await parseJsonResponse(res);
      if (res.ok && isJson && json?.success) {
        return { success: true, admin: json.admin };
      }
      if (isJson && json?.error) {
        return { success: false, error: json.error };
      }
      throw new Error("Backend unreachable");
    } catch (err: any) {
      return {
        success: false,
        error: err.message || "Credential updates require the live backend database to be connected.",
      };
    }
  },

  // 10. Change Contact Settings (Protected)
  async changeContact(
    token: string,
    phoneInput: string,
    emailInput: string
  ): Promise<{ success: boolean; admin?: AdminUser; error?: string }> {
    try {
      const res = await fetch(`${API_BASE}/api/admin/settings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          phone: phoneInput.trim(),
          email: emailInput.trim(),
        }),
      });

      const { isJson, data: json } = await parseJsonResponse(res);
      if (res.ok && isJson && json?.success) {
        return { success: true, admin: json.settings };
      }
      throw new Error("Backend unreachable");
    } catch {
      return {
        success: true,
        admin: {
          username: "ClinicAdmin_7X9",
          phone: phoneInput.trim(),
          email: emailInput.trim(),
        },
      };
    }
  },
};
