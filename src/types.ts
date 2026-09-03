export interface AppointmentFormData {
  patientName: string;
  phoneNumber: string;
  appointmentDate: string;
  preferredTime: string;
  service: string;
  notes?: string;
}

export interface NavItem {
  label: string;
  href: string;
}
