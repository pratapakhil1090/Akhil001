import React, { useState } from "react";
import {
  Calendar,
  Phone,
  Clock,
  User,
  FileText,
  MessageCircle,
  AlertCircle,
  CheckCircle2,
  Stethoscope,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { CLINIC_INFO } from "../constants";

const DENTAL_SERVICES = [
  "Root Canal Treatment (RCT)",
  "Single-Sitting RCT",
  "Dental Implants & Replacement",
  "Teeth Cleaning & Scaling",
  "Tooth Extraction",
  "Crown & Bridge Restoration",
  "Orthodontic / Braces Consultation",
  "Pediatric Dental Care",
  "General Dental Checkup / Consultation",
];

const TIME_SLOTS = [
  "Morning (10:00 AM - 1:00 PM)",
  "Afternoon (1:00 PM - 4:00 PM)",
  "Evening (5:00 PM - 8:30 PM)",
];

export const AppointmentSection: React.FC = () => {
  const [patientName, setPatientName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [service, setService] = useState(DENTAL_SERVICES[0]);
  const [notes, setNotes] = useState("");

  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSent, setIsSent] = useState(false);
  const [lastWhatsAppUrl, setLastWhatsAppUrl] = useState<string>("");
  const [lastSubmittedDetails, setLastSubmittedDetails] = useState<{
    name: string;
    phone: string;
    date: string;
    time: string;
    service: string;
    notes: string;
  } | null>(null);

  // Today's date in YYYY-MM-DD for min date picker restriction
  const todayString = new Date().toISOString().split("T")[0];

  const validateForm = (): string | null => {
    if (!patientName.trim()) {
      return "Please enter your Full Name.";
    }

    const cleanPhone = phoneNumber.trim();
    if (!cleanPhone) {
      return "Please enter your Phone Number.";
    }

    const digitsOnly = cleanPhone.replace(/\D/g, "");
    if (digitsOnly.length < 10) {
      return "Please enter a valid 10-digit phone number.";
    }

    if (!appointmentDate.trim()) {
      return "Please select your preferred Appointment Date.";
    }

    if (!preferredTime.trim()) {
      return "Please select your preferred Time.";
    }

    if (!service.trim()) {
      return "Please select a Treatment / Service.";
    }

    return null;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const errorMsg = validateForm();
    if (errorMsg) {
      setValidationError(errorMsg);
      return;
    }

    setValidationError(null);

    const trimmedName = patientName.trim();
    const trimmedPhone = phoneNumber.trim();
    const trimmedDate = appointmentDate.trim();
    const trimmedTime = preferredTime.trim();
    const trimmedService = service.trim();
    const trimmedNotes = notes.trim() || "None";

    // Format WhatsApp message
    const message = `New Appointment Request

Patient Name: ${trimmedName}
Phone: ${trimmedPhone}
Appointment Date: ${trimmedDate}
Preferred Time: ${trimmedTime}
Treatment/Service: ${trimmedService}
Message: ${trimmedNotes}

Please confirm the appointment.`;

    // Existing clinic WhatsApp number: 917460010035
    const whatsappNumber = CLINIC_INFO.phoneRaw.startsWith("91")
      ? CLINIC_INFO.phoneRaw
      : `91${CLINIC_INFO.phoneRaw}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    setLastWhatsAppUrl(whatsappUrl);
    setLastSubmittedDetails({
      name: trimmedName,
      phone: trimmedPhone,
      date: trimmedDate,
      time: trimmedTime,
      service: trimmedService,
      notes: trimmedNotes,
    });
    setIsSent(true);

    // Open WhatsApp in a new window/tab (works on Android, iPhone, and Desktop)
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  const handleReset = () => {
    setPatientName("");
    setPhoneNumber("");
    setAppointmentDate("");
    setPreferredTime("");
    setService(DENTAL_SERVICES[0]);
    setNotes("");
    setValidationError(null);
    setIsSent(false);
    setLastWhatsAppUrl("");
    setLastSubmittedDetails(null);
  };

  return (
    <section id="appointment" className="py-20 bg-slate-50/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-100/80 px-3.5 py-1.5 rounded-full inline-block">
            WhatsApp Booking
          </span>
          <h2
            id="appointment-heading"
            className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight"
          >
            Request a Dental Appointment
          </h2>
          <p className="mt-2 text-base text-slate-600">
            Fill in your preferred appointment details below. Your request will open directly in WhatsApp for quick confirmation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start max-w-5xl mx-auto">
          
          {/* Main Appointment Form Container */}
          <div className="lg:col-span-7 bg-white rounded-[32px] p-6 sm:p-10 border border-blue-50 shadow-2xl shadow-blue-100/60 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full pointer-events-none opacity-40" />

            {/* Validation Error Banner */}
            {validationError && (
              <div
                id="appointment-validation-error"
                className="mb-5 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Please check your details:</span>
                  <p>{validationError}</p>
                </div>
              </div>
            )}

            {isSent && lastSubmittedDetails ? (
              /* Success / WhatsApp Sent State */
              <div id="appointment-success-state" className="text-center py-4 space-y-5 relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100 font-bold">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    Ready to Send on WhatsApp
                  </h3>
                  <p className="text-sm text-slate-600 mt-1 max-w-md mx-auto">
                    We have generated your appointment details. Click the button below if WhatsApp did not open automatically.
                  </p>
                </div>

                {/* Important Notice */}
                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 text-xs sm:text-sm text-left flex items-start gap-3">
                  <MessageCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Appointment Confirmation Notice:</span>
                    Your appointment request will be sent to the clinic through WhatsApp. The clinic will confirm your appointment.
                  </div>
                </div>

                {/* Request Summary Card */}
                <div className="bg-slate-50 p-4 rounded-2xl text-left text-xs space-y-2 border border-slate-200">
                  <p className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    Pre-filled Request Details:
                  </p>
                  <p>
                    <strong className="text-slate-700">Patient:</strong> {lastSubmittedDetails.name}
                  </p>
                  <p>
                    <strong className="text-slate-700">Phone:</strong> {lastSubmittedDetails.phone}
                  </p>
                  <p>
                    <strong className="text-slate-700">Service:</strong> {lastSubmittedDetails.service}
                  </p>
                  <p>
                    <strong className="text-slate-700">Date:</strong> {lastSubmittedDetails.date}
                  </p>
                  <p>
                    <strong className="text-slate-700">Time:</strong> {lastSubmittedDetails.time}
                  </p>
                  {lastSubmittedDetails.notes !== "None" && (
                    <p>
                      <strong className="text-slate-700">Message / Reason:</strong> {lastSubmittedDetails.notes}
                    </p>
                  )}
                </div>

                {/* Direct Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                  <a
                    id="open-whatsapp-again-btn"
                    href={lastWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-sm font-bold transition-all shadow-md shadow-emerald-200 hover:-translate-y-0.5"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>Open WhatsApp</span>
                    <ExternalLink className="w-4 h-4 ml-1 opacity-75" />
                  </a>

                  <button
                    id="appointment-reset-btn"
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center justify-center px-5 py-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-bold transition-colors cursor-pointer"
                  >
                    Book Another Appointment
                  </button>
                </div>
              </div>
            ) : (
              /* Active Booking Form */
              <form id="appointment-form" onSubmit={handleFormSubmit} noValidate className="space-y-4 relative z-10">
                
                {/* Full Name */}
                <div>
                  <label htmlFor="patientName" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      id="patientName"
                      name="patientName"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={patientName}
                      onChange={(e) => {
                        setPatientName(e.target.value);
                        if (validationError) setValidationError(null);
                      }}
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label htmlFor="phoneNumber" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      required
                      placeholder="e.g. 74600 10035"
                      value={phoneNumber}
                      onChange={(e) => {
                        setPhoneNumber(e.target.value);
                        if (validationError) setValidationError(null);
                      }}
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Service / Treatment Selection */}
                <div>
                  <label htmlFor="service" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Treatment / Service <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Stethoscope className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select
                      id="service"
                      name="service"
                      required
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors cursor-pointer"
                    >
                      {DENTAL_SERVICES.map((srv) => (
                        <option key={srv} value={srv}>
                          {srv}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Appointment Date & Preferred Time Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="appointmentDate" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Appointment Date <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Calendar className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="date"
                        id="appointmentDate"
                        name="appointmentDate"
                        required
                        min={todayString}
                        value={appointmentDate}
                        onChange={(e) => {
                          setAppointmentDate(e.target.value);
                          if (validationError) setValidationError(null);
                        }}
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors cursor-pointer"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="preferredTime" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Preferred Time <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Clock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <select
                        id="preferredTime"
                        name="preferredTime"
                        required
                        value={preferredTime}
                        onChange={(e) => {
                          setPreferredTime(e.target.value);
                          if (validationError) setValidationError(null);
                        }}
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors cursor-pointer"
                      >
                        <option value="">Select Preferred Time</option>
                        {TIME_SLOTS.map((slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Message / Reason for Visit */}
                <div>
                  <label htmlFor="notes" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Message / Reason for Visit <span className="text-slate-400 font-normal lowercase">(optional)</span>
                  </label>
                  <div className="relative">
                    <FileText className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                    <textarea
                      id="notes"
                      name="notes"
                      rows={3}
                      placeholder="Describe symptoms, tooth pain, previous treatment, or specific requirements..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Appointment Confirmation Notice */}
                <div className="text-[12px] text-slate-600 bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200/80 flex items-start gap-2.5">
                  <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <p>
                    Your appointment request will be sent to the clinic through WhatsApp. The clinic will confirm your appointment.
                  </p>
                </div>

                {/* Main Submit Button */}
                <button
                  id="book-appointment-whatsapp-btn"
                  type="submit"
                  className="w-full py-4 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-base shadow-lg shadow-emerald-200 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Book Appointment on WhatsApp</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>

          {/* Quick Direct Actions Column */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Phone Call Card */}
            <div className="p-7 rounded-[28px] bg-white border border-slate-200/80 shadow-md shadow-blue-50/50 space-y-3.5">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                Direct Telephone
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                Prefer to call immediately?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                Speak directly with the clinic for enquiries, location guidance, or immediate assistance.
              </p>
              <a
                id="appointment-call-now-cta"
                href={CLINIC_INFO.phoneTel}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-base border border-blue-200 transition-colors"
              >
                <Phone className="w-5 h-5 text-blue-600" />
                <span>Call Now – {CLINIC_INFO.phone}</span>
              </a>
            </div>

            {/* Direct WhatsApp Appointment Card */}
            <div className="p-7 rounded-[28px] bg-white border border-slate-200/80 shadow-md shadow-blue-50/50 space-y-3.5">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Instant Messaging
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                Enquire via WhatsApp
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                Connect via WhatsApp using our pre-filled enquiry message:
              </p>
              <blockquote className="text-xs italic text-slate-600 bg-slate-50 p-3 rounded-xl border-l-3 border-emerald-500">
                “Hello Dr. Esha Pandey, I would like to enquire about a dental appointment.”
              </blockquote>
              <a
                id="appointment-whatsapp-cta"
                href={CLINIC_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-lg shadow-emerald-200 hover:-translate-y-0.5 transition-all"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
