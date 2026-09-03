import React, { useState, useEffect, useMemo } from "react";
import {
  Calendar,
  Phone,
  Clock,
  User,
  FileText,
  Search,
  CheckCircle2,
  Clock3,
  AlertCircle,
  Trash2,
  ExternalLink,
  LogOut,
  RefreshCw,
  MessageCircle,
  Mail,
  Shield,
  Settings,
  ArrowUpDown,
  Stethoscope,
  XCircle,
} from "lucide-react";
import { AppointmentRecord, AppointmentStatus, AdminUser } from "../../types";
import { AdminSettings } from "./AdminSettings";
import { clinicApi } from "../../services/api";

interface AdminDashboardProps {
  token: string;
  adminUser: AdminUser;
  onLogout: () => void;
  onViewWebsite: () => void;
}

const ALL_STATUSES: AppointmentStatus[] = ["Pending", "Confirmed", "Completed", "Cancelled"];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  token,
  adminUser,
  onLogout,
  onViewWebsite,
}) => {
  const [activeTab, setActiveTab] = useState<"appointments" | "settings">("appointments");
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter and search state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | AppointmentStatus>("All");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  // Deletion modal state
  const [deletingAppointment, setDeletingAppointment] = useState<AppointmentRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Current admin details
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser>(adminUser);
  const [isFallbackMode, setIsFallbackMode] = useState(false);

  // Fetch appointments from persistent database
  const fetchAppointments = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    setError(null);
    try {
      const res = await clinicApi.getAppointments(token);
      if (res.success) {
        setAppointments(res.appointments || []);
        setIsFallbackMode(Boolean(res.isFallback));
      } else {
        setError(res.error || "Failed to retrieve appointment records from database.");
      }
    } catch (err) {
      console.error("Fetch appointments error:", err);
      setError("Unable to load appointment requests. Please verify server connection.");
    } finally {
      setLoading(false);
      if (isManualRefresh) setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [token]);

  // Update Status in database
  const handleUpdateStatus = async (id: string, newStatus: AppointmentStatus) => {
    try {
      const res = await clinicApi.updateAppointmentStatus(token, id, newStatus);
      if (res.success) {
        setAppointments((prev) =>
          prev.map((apt) => (apt.id === id ? { ...apt, status: newStatus } : apt))
        );
      } else {
        alert(res.error || "Failed to update appointment status.");
      }
    } catch (err) {
      console.error("Update status error:", err);
      alert("Network error updating appointment status.");
    }
  };

  // Confirm and delete appointment from database
  const handleDeleteAppointment = async () => {
    if (!deletingAppointment) return;
    setIsDeleting(true);
    try {
      const res = await clinicApi.deleteAppointment(token, deletingAppointment.id);
      if (res.success) {
        setAppointments((prev) => prev.filter((a) => a.id !== deletingAppointment.id));
        setDeletingAppointment(null);
      } else {
        alert(res.error || "Failed to delete appointment request.");
      }
    } catch (err) {
      console.error("Delete appointment error:", err);
      alert("Network error deleting appointment request.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Pre-filled WhatsApp response link for admin to text patient
  const getWhatsAppPatientUrl = (patientName: string, phone: string, date?: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const msg = `Hello ${patientName}, this is Dr. Esha Pandey's dental clinic in Lucknow regarding your appointment request for ${
      date || "dental consultation"
    }. We are contacting you to confirm your appointment schedule.`;
    return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(msg)}`;
  };

  // Status Counts
  const totalCount = appointments.length;
  const pendingCount = appointments.filter((a) => a.status === "Pending").length;
  const confirmedCount = appointments.filter((a) => a.status === "Confirmed").length;
  const completedCount = appointments.filter((a) => a.status === "Completed").length;
  const cancelledCount = appointments.filter((a) => a.status === "Cancelled").length;

  // Filtered & Sorted appointments
  const filteredAppointments = useMemo(() => {
    let list = [...appointments];

    // Status filter
    if (statusFilter !== "All") {
      list = list.filter((a) => a.status === statusFilter);
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (a) =>
          a.patientName.toLowerCase().includes(q) ||
          a.phoneNumber.toLowerCase().includes(q) ||
          (a.email && a.email.toLowerCase().includes(q)) ||
          (a.service && a.service.toLowerCase().includes(q)) ||
          (a.notes && a.notes.toLowerCase().includes(q)) ||
          (a.appointmentDate && a.appointmentDate.toLowerCase().includes(q))
      );
    }

    // Sort
    list.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    return list;
  }, [appointments, statusFilter, searchQuery, sortOrder]);

  // Format date helper
  const formatSubmittedDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  };

  const getStatusBadgeClass = (status: AppointmentStatus) => {
    switch (status) {
      case "Pending":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Confirmed":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Cancelled":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Admin Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18">
            
            {/* Brand / Title */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-blue-200">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                    Dr. Esha Pandey Dental Clinic
                  </h1>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100 hidden sm:inline-block">
                    Admin Portal
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Logged in as <strong className="text-slate-700">{currentAdmin.username}</strong>
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                id="admin-view-public-website"
                type="button"
                onClick={onViewWebsite}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                title="View Public Dental Clinic Site"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">View Public Website</span>
              </button>

              <button
                id="admin-logout-button"
                type="button"
                onClick={onLogout}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200/80 rounded-xl transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-t border-slate-100 gap-6">
            <button
              id="admin-tab-appointments"
              type="button"
              onClick={() => setActiveTab("appointments")}
              className={`py-3.5 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
                activeTab === "appointments"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>All Appointments</span>
              {totalCount > 0 && (
                <span className="ml-1 px-2 py-0.5 text-[11px] rounded-full bg-slate-100 text-slate-700 font-semibold">
                  {totalCount}
                </span>
              )}
              {pendingCount > 0 && (
                <span className="px-2 py-0.5 text-[11px] rounded-full bg-blue-600 text-white font-bold animate-pulse">
                  {pendingCount} Pending
                </span>
              )}
            </button>

            <button
              id="admin-tab-settings"
              type="button"
              onClick={() => setActiveTab("settings")}
              className={`py-3.5 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
                activeTab === "settings"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Clinic & Account Settings</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "settings" ? (
          <AdminSettings
            token={token}
            adminUser={currentAdmin}
            onAdminUpdated={(updated) => setCurrentAdmin(updated)}
          />
        ) : (
          <div className="space-y-6">
            {isFallbackMode && (
              <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-900 text-xs sm:text-sm flex items-start gap-3 shadow-xs">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-amber-950">Netlify Static Mode (Local Browser Storage)</p>
                  <p className="text-amber-800 leading-relaxed">
                    The frontend is running in standalone static mode. Appointments submitted from this device will be displayed here. To enable live multi-device shared sync between different computers or administrators, host the Node.js backend or set <code className="bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-mono text-xs font-semibold">VITE_API_URL</code> in your Netlify environment variables.
                  </p>
                </div>
              </div>
            )}

            {/* Top Metrics Row */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Total</p>
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">{totalCount}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Database records</p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-blue-200 bg-blue-50/20 shadow-xs">
                <p className="text-xs font-bold uppercase tracking-wider text-blue-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping inline-block" />
                  Pending
                </p>
                <p className="text-2xl sm:text-3xl font-extrabold text-blue-700 mt-1">{pendingCount}</p>
                <p className="text-[11px] text-blue-500 mt-0.5">Awaiting review</p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-amber-200 bg-amber-50/20 shadow-xs">
                <p className="text-xs font-bold uppercase tracking-wider text-amber-700">Confirmed</p>
                <p className="text-2xl sm:text-3xl font-extrabold text-amber-700 mt-1">{confirmedCount}</p>
                <p className="text-[11px] text-amber-600 mt-0.5">Schedule booked</p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-emerald-200 bg-emerald-50/20 shadow-xs">
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">Completed</p>
                <p className="text-2xl sm:text-3xl font-extrabold text-emerald-700 mt-1">{completedCount}</p>
                <p className="text-[11px] text-emerald-600 mt-0.5">Treated / Closed</p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-rose-200 bg-rose-50/20 shadow-xs">
                <p className="text-xs font-bold uppercase tracking-wider text-rose-700">Cancelled</p>
                <p className="text-2xl sm:text-3xl font-extrabold text-rose-700 mt-1">{cancelledCount}</p>
                <p className="text-[11px] text-rose-600 mt-0.5">Cancelled requests</p>
              </div>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  <span>{error}</span>
                </div>
                <button
                  type="button"
                  onClick={() => fetchAppointments(true)}
                  className="font-bold underline cursor-pointer text-xs"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Toolbar: Search, Status Tabs, Sort, Refresh */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  id="admin-appointments-search"
                  type="text"
                  placeholder="Search by patient name, phone, email, service..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-colors"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
                <button
                  id="filter-status-all"
                  type="button"
                  onClick={() => setStatusFilter("All")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                    statusFilter === "All"
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  All ({totalCount})
                </button>
                {ALL_STATUSES.map((st) => {
                  const count =
                    st === "Pending"
                      ? pendingCount
                      : st === "Confirmed"
                      ? confirmedCount
                      : st === "Completed"
                      ? completedCount
                      : cancelledCount;

                  return (
                    <button
                      key={st}
                      id={`filter-status-${st.toLowerCase()}`}
                      type="button"
                      onClick={() => setStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                        statusFilter === st
                          ? "bg-slate-900 text-white shadow-xs"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {st} ({count})
                    </button>
                  );
                })}
              </div>

              {/* Sort Order & Refresh Button */}
              <div className="flex items-center gap-2 shrink-0">
                <div className="flex items-center gap-1 text-xs border border-slate-200 rounded-xl px-2.5 py-1.5 bg-slate-50">
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                  <select
                    id="admin-sort-select"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as "newest" | "oldest")}
                    className="bg-transparent text-slate-700 font-semibold focus:outline-hidden cursor-pointer"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                  </select>
                </div>

                <button
                  id="admin-refresh-button"
                  type="button"
                  onClick={() => fetchAppointments(true)}
                  disabled={refreshing}
                  className="p-2 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
                  title="Refresh Appointments from Database"
                >
                  <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin text-blue-600" : ""}`} />
                </button>
              </div>
            </div>

            {/* Content List */}
            {loading ? (
              <div className="bg-white rounded-3xl p-16 text-center border border-slate-200/80 shadow-xs">
                <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm font-semibold text-slate-600">Loading appointments from database...</p>
              </div>
            ) : filteredAppointments.length === 0 ? (
              <div className="bg-white rounded-3xl p-16 text-center border border-slate-200/80 shadow-xs space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                  <Calendar className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {searchQuery || statusFilter !== "All"
                      ? "No appointment requests match your filter"
                      : "No appointment requests in database yet"}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1">
                    {searchQuery || statusFilter !== "All"
                      ? "Try changing your search keywords or switching the status filter tab."
                      : "When patients submit appointment requests on the clinic website, they are recorded in the shared database and will appear here."}
                  </p>
                </div>

                {searchQuery || statusFilter !== "All" ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setStatusFilter("All");
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
                  >
                    Reset Filters
                  </button>
                ) : null}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAppointments.map((apt) => {
                  const isPending = apt.status === "Pending";
                  const appointmentDate = apt.appointmentDate || apt.preferredDate || "Flexible";
                  const appointmentTime = apt.appointmentTime || apt.preferredTime || "Flexible";
                  const service = apt.service || "General Consultation / RCT";
                  const notes = apt.notes || apt.reasonForVisit || "";

                  return (
                    <div
                      key={apt.id}
                      id={`appointment-card-${apt.id}`}
                      className={`p-6 rounded-[28px] bg-white border transition-all duration-200 shadow-sm ${
                        isPending
                          ? "border-blue-300 ring-2 ring-blue-500/10"
                          : "border-slate-200/80 hover:border-slate-300"
                      }`}
                    >
                      {/* Card Header: Patient info + Status Badge + Actions */}
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                        {/* Patient info */}
                        <div className="flex items-start sm:items-center gap-3">
                          <div
                            className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold shrink-0 ${
                              isPending
                                ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                                : apt.status === "Confirmed"
                                ? "bg-amber-100 text-amber-800"
                                : apt.status === "Completed"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-rose-100 text-rose-800"
                            }`}
                          >
                            <User className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2.5 flex-wrap">
                              <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                                {apt.patientName}
                              </h3>
                              {/* Status Badge */}
                              <span
                                className={`text-xs font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1.5 border ${getStatusBadgeClass(
                                  apt.status
                                )}`}
                              >
                                {isPending && <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />}
                                {apt.status}
                              </span>
                            </div>

                            <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                              <Clock3 className="w-3 h-3" />
                              <span>Created on {formatSubmittedDate(apt.createdAt)}</span>
                            </p>
                          </div>
                        </div>

                        {/* Status Change Selector & Delete */}
                        <div className="flex items-center gap-2 shrink-0 flex-wrap">
                          <span className="text-xs font-bold text-slate-400 hidden sm:inline">Set Status:</span>
                          <div className="inline-flex rounded-xl p-1 bg-slate-100 border border-slate-200/80">
                            {ALL_STATUSES.map((st) => (
                              <button
                                key={st}
                                type="button"
                                onClick={() => handleUpdateStatus(apt.id, st)}
                                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                                  apt.status === st
                                    ? st === "Pending"
                                      ? "bg-blue-600 text-white shadow-xs"
                                      : st === "Confirmed"
                                      ? "bg-amber-500 text-white shadow-xs"
                                      : st === "Completed"
                                      ? "bg-emerald-600 text-white shadow-xs"
                                      : "bg-rose-600 text-white shadow-xs"
                                    : "text-slate-600 hover:text-slate-900"
                                }`}
                              >
                                {st}
                              </button>
                            ))}
                          </div>

                          <button
                            type="button"
                            onClick={() => setDeletingAppointment(apt)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                            title="Delete Request"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Request Details Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-4 text-xs sm:text-sm">
                        {/* Phone Number */}
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            Phone Number
                          </span>
                          <div>
                            <a
                              href={`tel:${apt.phoneNumber}`}
                              className="font-bold text-blue-600 hover:text-blue-800 text-sm sm:text-base flex items-center gap-1.5"
                            >
                              <Phone className="w-3.5 h-3.5" />
                              <span>{apt.phoneNumber}</span>
                            </a>
                          </div>
                        </div>

                        {/* Email (if provided) */}
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            Email Address
                          </span>
                          <div>
                            {apt.email && apt.email.trim() ? (
                              <a
                                href={`mailto:${apt.email}`}
                                className="font-semibold text-slate-800 hover:text-blue-600 flex items-center gap-1.5 truncate"
                              >
                                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span className="truncate">{apt.email}</span>
                              </a>
                            ) : (
                              <span className="text-slate-400 italic">Not provided</span>
                            )}
                          </div>
                        </div>

                        {/* Appointment Date & Time */}
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            Date & Time
                          </span>
                          <div className="font-semibold text-slate-800 flex items-center gap-2">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              {appointmentDate}
                            </span>
                            <span className="text-slate-300">•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              {appointmentTime}
                            </span>
                          </div>
                        </div>

                        {/* Quick Contact Actions */}
                        <div className="p-2 rounded-xl bg-blue-50/40 border border-blue-100 flex items-center gap-2">
                          <a
                            id={`call-patient-${apt.id}`}
                            href={`tel:${apt.phoneNumber}`}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-xs"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>Call</span>
                          </a>

                          <a
                            id={`whatsapp-patient-${apt.id}`}
                            href={getWhatsAppPatientUrl(apt.patientName, apt.phoneNumber, appointmentDate)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-xs"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </a>
                        </div>
                      </div>

                      {/* Service & Notes Row */}
                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs sm:text-sm">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                            Selected Treatment / Service
                          </span>
                          <p className="text-slate-800 font-semibold flex items-center gap-1.5">
                            <Stethoscope className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            <span>{service}</span>
                          </p>
                        </div>

                        <div className="sm:col-span-2 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs sm:text-sm">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                            Patient Notes / Message
                          </span>
                          <p className="text-slate-700 font-medium italic">
                            {notes ? `“${notes}”` : <span className="text-slate-400 not-italic">No additional notes provided</span>}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {deletingAppointment && (
        <div
          id="delete-confirmation-modal"
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-[28px] max-w-md w-full p-6 sm:p-8 space-y-5 border border-slate-200 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto font-bold">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-slate-900">Delete Appointment Record?</h3>
              <p className="text-xs sm:text-sm text-slate-500">
                Are you sure you want to permanently delete the appointment request for{" "}
                <strong className="text-slate-800">{deletingAppointment.patientName}</strong> from the database?
                This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                id="cancel-delete-btn"
                type="button"
                onClick={() => setDeletingAppointment(null)}
                disabled={isDeleting}
                className="flex-1 py-3 px-4 rounded-xl border border-slate-200 font-bold text-sm text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                id="confirm-delete-btn"
                type="button"
                onClick={handleDeleteAppointment}
                disabled={isDeleting}
                className="flex-1 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 font-bold text-sm text-white shadow-md shadow-rose-200 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
