import React, { useState, useEffect } from "react";
import { User, Lock, Phone, Mail, CheckCircle2, AlertCircle, ShieldCheck, KeyRound, Save } from "lucide-react";
import { AdminUser, ClinicSettings } from "../../types";
import { clinicApi } from "../../services/api";

interface AdminSettingsProps {
  token: string;
  adminUser: AdminUser;
  onAdminUpdated: (updatedAdmin: AdminUser) => void;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({
  token,
  adminUser,
  onAdminUpdated,
}) => {
  // Credentials state
  const [currentUsername, setCurrentUsername] = useState(adminUser.username);
  const [newUsername, setNewUsername] = useState(adminUser.username);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [credentialLoading, setCredentialLoading] = useState(false);
  const [credentialSuccess, setCredentialSuccess] = useState<string | null>(null);
  const [credentialError, setCredentialError] = useState<string | null>(null);

  // Clinic contact state
  const [clinicPhone, setClinicPhone] = useState(adminUser.phone || "74600 10035");
  const [clinicEmail, setClinicEmail] = useState(adminUser.email || "admin@dreshapandey.com");
  const [contactLoading, setContactLoading] = useState(false);
  const [contactSuccess, setContactSuccess] = useState<string | null>(null);
  const [contactError, setContactError] = useState<string | null>(null);

  // Fetch settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await clinicApi.getSettings(token);
        if (res.success && res.settings) {
          setClinicPhone(res.settings.phone || "74600 10035");
          setClinicEmail(res.settings.email || "admin@dreshapandey.com");
          setCurrentUsername(res.settings.username || adminUser.username);
          setNewUsername(res.settings.username || adminUser.username);
        }
      } catch (err) {
        console.error("Failed to fetch settings", err);
      }
    };
    fetchSettings();
  }, [token, adminUser.username]);

  // Handle Credentials Update
  const handleUpdateCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setCredentialError(null);
    setCredentialSuccess(null);

    if (!currentPassword) {
      setCredentialError("Please provide your current password to authorize changes.");
      return;
    }

    if (newPassword && newPassword.length < 6) {
      setCredentialError("New password must be at least 6 characters long.");
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      setCredentialError("New password and confirm password do not match.");
      return;
    }

    setCredentialLoading(true);

    try {
      const res = await clinicApi.changeCredentials(
        token,
        currentPassword,
        newUsername.trim() || undefined,
        newPassword ? newPassword : undefined
      );

      if (!res.success || !res.admin) {
        setCredentialError(res.error || "Failed to update credentials. Please check your current password.");
        setCredentialLoading(false);
        return;
      }

      setCredentialSuccess("Admin credentials updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setCurrentUsername(res.admin.username);
      setNewUsername(res.admin.username);
      onAdminUpdated(res.admin);
    } catch (err) {
      console.error("Credentials update error:", err);
      setCredentialError("Network error. Please try again.");
    } finally {
      setCredentialLoading(false);
    }
  };

  // Handle Clinic Contact Info Update
  const handleUpdateClinicContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactError(null);
    setContactSuccess(null);

    if (!clinicPhone.trim()) {
      setContactError("Clinic phone number cannot be empty.");
      return;
    }

    setContactLoading(true);

    try {
      const res = await clinicApi.changeContact(
        token,
        clinicPhone.trim(),
        clinicEmail.trim()
      );

      if (!res.success || !res.admin) {
        setContactError(res.error || "Failed to update clinic contact settings.");
        setContactLoading(false);
        return;
      }

      setContactSuccess("Clinic contact settings saved successfully!");
      onAdminUpdated({
        ...adminUser,
        phone: clinicPhone.trim(),
        email: clinicEmail.trim(),
      });
    } catch (err) {
      console.error("Clinic contact update error:", err);
      setContactError("Network error. Please try again.");
    } finally {
      setContactLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Settings Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Admin & Clinic Settings
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Manage your administrative credentials and public clinic contact information.
        </p>
      </div>

      {/* Security Credentials Section */}
      <div className="bg-white rounded-[28px] p-6 sm:p-8 border border-slate-200/80 shadow-md shadow-blue-50/50 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Change Admin Credentials</h3>
            <p className="text-xs text-slate-500">
              Update your private administrator username and password.
            </p>
          </div>
        </div>

        {credentialSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="font-semibold">{credentialSuccess}</span>
          </div>
        )}

        {credentialError && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span className="font-semibold">{credentialError}</span>
          </div>
        )}

        <form onSubmit={handleUpdateCredentials} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Username */}
            <div>
              <label
                htmlFor="settings-new-username"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2"
              >
                Admin Username
              </label>
              <div className="relative">
                <User className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  id="settings-new-username"
                  type="text"
                  required
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="e.g. dr_esha_admin"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              <p className="mt-1 text-[11px] text-slate-400">Current: {currentUsername}</p>
            </div>

            {/* Current Password (Mandatory for security verification) */}
            <div>
              <label
                htmlFor="settings-current-password"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2"
              >
                Current Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  id="settings-current-password"
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              <p className="mt-1 text-[11px] text-slate-400">Required to verify authorized admin</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2 border-t border-slate-100">
            {/* New Password */}
            <div>
              <label
                htmlFor="settings-new-password"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2"
              >
                New Password (Optional)
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  id="settings-new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Leave empty to keep current password"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              <p className="mt-1 text-[11px] text-slate-400">Min 6 characters</p>
            </div>

            {/* Confirm New Password */}
            <div>
              <label
                htmlFor="settings-confirm-password"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2"
              >
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  id="settings-confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  disabled={!newPassword}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-slate-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              id="settings-save-credentials-button"
              type="submit"
              disabled={credentialLoading}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm shadow-md shadow-blue-200 transition-all cursor-pointer disabled:opacity-60"
            >
              {credentialLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Save New Credentials</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Clinic Contact & Notification Settings */}
      <div className="bg-white rounded-[28px] p-6 sm:p-8 border border-slate-200/80 shadow-md shadow-blue-50/50 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Clinic Contact Information</h3>
            <p className="text-xs text-slate-500">
              Update the clinic phone number and admin contact email displayed across the website.
            </p>
          </div>
        </div>

        {contactSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="font-semibold">{contactSuccess}</span>
          </div>
        )}

        {contactError && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span className="font-semibold">{contactError}</span>
          </div>
        )}

        <form onSubmit={handleUpdateClinicContact} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Clinic Phone */}
            <div>
              <label
                htmlFor="settings-clinic-phone"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2"
              >
                Clinic Phone Number
              </label>
              <div className="relative">
                <Phone className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  id="settings-clinic-phone"
                  type="text"
                  required
                  value={clinicPhone}
                  onChange={(e) => setClinicPhone(e.target.value)}
                  placeholder="e.g. 74600 10035"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              <p className="mt-1 text-[11px] text-slate-400">Used for patient direct calls & WhatsApp</p>
            </div>

            {/* Admin Email */}
            <div>
              <label
                htmlFor="settings-clinic-email"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2"
              >
                Admin / Contact Email
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  id="settings-clinic-email"
                  type="email"
                  value={clinicEmail}
                  onChange={(e) => setClinicEmail(e.target.value)}
                  placeholder="e.g. admin@dreshapandey.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              <p className="mt-1 text-[11px] text-slate-400">Clinic administrative contact email</p>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              id="settings-save-contact-button"
              type="submit"
              disabled={contactLoading}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm shadow-md shadow-blue-200 transition-all cursor-pointer disabled:opacity-60"
            >
              {contactLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Clinic Contact</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
