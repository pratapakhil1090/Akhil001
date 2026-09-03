export type AppointmentStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled";

export interface AppointmentFormData {
  patientName: string;
  phoneNumber: string;
  email?: string;
  appointmentDate: string;
  preferredDate?: string;
  appointmentTime: string;
  preferredTime?: string;
  service: string;
  reasonForVisit?: string;
  notes?: string;
}

export interface AppointmentRecord {
  id: string;
  patientName: string;
  phoneNumber: string;
  email: string;
  appointmentDate: string;
  preferredDate?: string;
  appointmentTime: string;
  preferredTime?: string;
  service: string;
  reasonForVisit?: string;
  notes: string;
  status: AppointmentStatus;
  createdAt: string;
}

export interface AdminUser {
  username: string;
  email: string;
  phone: string;
}

export interface ClinicSettings {
  username: string;
  phone: string;
  email: string;
}

export interface NavItem {
  label: string;
  href: string;
}


