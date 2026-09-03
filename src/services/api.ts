import { AdminUser, AppointmentRecord, AppointmentStatus, ClinicSettings } from "../types";

// Default Production Backend URL running on Google Cloud Run with persistent SQLite database
export const PRODUCTION_BACKEND_URL =
  "https://ais-pre-sgfj5sj3bq63fxa3xodyzr-623049401971.asia-southeast1.run.app";

/**
 * Determine API Base URL:
 * 1. Checks VITE_API_URL environment variable first (if configured in Netlify).
 * 2. If running on a Netlify domain (*.netlify.app) and VITE_API_URL was omitted, defaults to the production Cloud Run backend.
 * 3. On local/container dev server, uses empty string "" (relative path on same origin).
 */
const getApiBaseUrl = (): string => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/$/, "");
  }
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host.includes("netlify.app") || host.includes("netlify.live")) {
      return PRODUCTION_BACKEND_URL;
    }
  }
  return "";
};

const API_BASE = getApiBaseUrl();

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

export const clinicApi = {
  // 1. Submit appointment request (Public -> SQLite Database)
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

      if (isJson && json?.error) {
        return { success: false, error: json.error };
      }

      return {
        success: false,
        error: `Server responded with status ${res.status}. Please try again or call the clinic directly.`,
      };
    } catch (err: any) {
      console.error("Error submitting appointment to database:", err);
      return {
        success: false,
        error:
          "Unable to connect to the clinic database server. Please check your internet connection or verify VITE_API_URL in Netlify.",
      };
    }
  },

  // 2. Admin Login (Public -> Authenticated against SQLite PBKDF2 hashes)
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

      return { success: false, error: "Invalid username or password" };
    } catch (err: any) {
      console.error("Backend login error:", err);
      return {
        success: false,
        error:
          "Could not connect to authentication server. Please ensure the backend is reachable or check VITE_API_URL.",
      };
    }
  },

  // 3. Verify Admin Session / Me (Protected -> SQLite Sessions Table)
  async checkAuth(token: string): Promise<{ success: boolean; admin?: AdminUser }> {
    try {
      const res = await fetch(`${API_BASE}/api/admin/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { isJson, data: json } = await parseJsonResponse(res);
      if (res.ok && isJson && json?.success && json?.admin) {
        return { success: true, admin: json.admin };
      }
      return { success: false };
    } catch {
      return { success: false };
    }
  },

  // 4. Logout (Protected -> Invalidates Token in SQLite)
  async logout(token: string): Promise<void> {
    try {
      await fetch(`${API_BASE}/api/admin/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error("Logout error:", err);
    }
  },

  // 5. Get All Appointments from Persistent SQLite Database (Protected)
  async getAppointments(token: string): Promise<{ success: boolean; appointments: AppointmentRecord[]; error?: string }> {
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

      return {
        success: false,
        appointments: [],
        error: json?.error || `Failed to fetch appointments (status ${res.status}).`,
      };
    } catch (err: any) {
      console.error("Error fetching appointments from database:", err);
      return {
        success: false,
        appointments: [],
        error:
          "Unable to connect to the database server. Please ensure the backend is running and reachable.",
      };
    }
  },

  // 6. Update Appointment Status in SQLite Database (Protected)
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

      return { success: false, error: json?.error || "Failed to update appointment status" };
    } catch (err: any) {
      console.error("Error updating appointment status:", err);
      return { success: false, error: "Connection error while updating status" };
    }
  },

  // 7. Delete Appointment from SQLite Database (Protected)
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

      return { success: false, error: json?.error || "Failed to delete appointment" };
    } catch (err: any) {
      console.error("Error deleting appointment:", err);
      return { success: false, error: "Connection error while deleting appointment" };
    }
  },

  // 8. Get Clinic & Admin Settings from SQLite (Protected)
  async getSettings(token: string): Promise<{ success: boolean; settings?: ClinicSettings; error?: string }> {
    try {
      const res = await fetch(`${API_BASE}/api/admin/settings`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { isJson, data: json } = await parseJsonResponse(res);
      if (res.ok && isJson && json?.success) {
        return { success: true, settings: json.settings };
      }
      return { success: false, error: json?.error || "Failed to load settings" };
    } catch (err: any) {
      console.error("Error loading settings:", err);
      return { success: false, error: "Could not retrieve settings from server" };
    }
  },

  // 9. Change Credentials in SQLite Database (Protected)
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
      return { success: false, error: json?.error || "Failed to change credentials" };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || "Credential updates require the live backend database to be connected.",
      };
    }
  },

  // 10. Change Contact Settings in SQLite Database (Protected)
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
      return { success: false, error: json?.error || "Failed to update contact settings" };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to update contact settings" };
    }
  },
};
