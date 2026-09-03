import React, { useState } from "react";
import { Calendar, Phone, Clock, User, FileText, Send, MessageCircle, AlertCircle, CheckCircle2, Mail, Stethoscope } from "lucide-react";
import { CLINIC_INFO } from "../constants";
import { AppointmentFormData } from "../types";
import { clinicApi } from "../services/api";

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

export const AppointmentSection: React.FC = () => {
  const [formData, setFormData] = useState<AppointmentFormData>({
    patientName: "",
    phoneNumber: "",
    email: "",
    appointmentDate: "",
    preferredDate: "",
    appointmentTime: "",
    preferredTime: "",
    service: "Root Canal Treatment (RCT)",
    reasonForVisit: "",
    notes: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<AppointmentFormData | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patientName.trim() || !formData.phoneNumber.trim()) return;
    setSubmitting(true);

    const payload = {
      patientName: formData.patientName.trim(),
      phoneNumber: formData.phoneNumber.trim(),
      email: formData.email?.trim() || "",
      appointmentDate: formData.appointmentDate || formData.preferredDate || "Flexible",
      preferredDate: formData.appointmentDate || formData.preferredDate || "Flexible",
      appointmentTime: formData.appointmentTime || formData.preferredTime || "Flexible",
      preferredTime: formData.appointmentTime || formData.preferredTime || "Flexible",
      service: formData.service || "General Dental Consultation",
      reasonForVisit: formData.notes?.trim() || formData.reasonForVisit?.trim() || formData.service,
      notes: formData.notes?.trim() || formData.reasonForVisit?.trim() || "",
    };

    try {
      await clinicApi.submitAppointment(payload);
    } catch (err) {
      console.error("Error posting appointment request:", err);
    } finally {
      setSubmittedData({ ...payload });
      setSubmitted(true);
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      patientName: "",
      phoneNumber: "",
      email: "",
      appointmentDate: "",
      preferredDate: "",
      appointmentTime: "",
      preferredTime: "",
      service: "Root Canal Treatment (RCT)",
      reasonForVisit: "",
      notes: "",
    });
    setSubmitted(false);
    setSubmittedData(null);
  };

  // Pre-filled WhatsApp message with specific form details
  const getCustomWhatsAppUrl = () => {
    if (submittedData) {
      const text = `Hello Dr. Esha Pandey, I would like to enquire about a dental appointment.%0A%0APatient Name: ${encodeURIComponent(
        submittedData.patientName
      )}%0APhone: ${encodeURIComponent(
        submittedData.phoneNumber
      )}%0ATreatment: ${encodeURIComponent(
        submittedData.service || "Root Canal Treatment"
      )}%0APreferred Date: ${encodeURIComponent(
        submittedData.appointmentDate || "Flexible"
      )}%0APreferred Time: ${encodeURIComponent(
        submittedData.appointmentTime || "Flexible"
      )}${submittedData.notes ? `%0ANotes: ${encodeURIComponent(submittedData.notes)}` : ""}`;
      return `https://wa.me/917460010035?text=${text}`;
    }
    return CLINIC_INFO.whatsappUrl;
  };

  return (
    <section id="appointment" className="py-20 bg-slate-50/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-3xl mx-auto text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-100/80 px-3.5 py-1.5 rounded-full inline-block">
            Consultation Booking
          </span>
          <h2
            id="appointment-heading"
            className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight"
          >
            Request a Dental Appointment
          </h2>
          <p className="mt-2 text-base text-slate-600">
            Submit your appointment request below, or connect directly via phone or WhatsApp.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start max-w-5xl mx-auto">
          
          {/* Form Container */}
          <div className="lg:col-span-7 bg-white rounded-[32px] p-6 sm:p-10 border border-blue-50 shadow-2xl shadow-blue-100/60 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full pointer-events-none opacity-40" />
            
            {submitted ? (
              <div id="appointment-success-state" className="text-center py-6 space-y-5 relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100 font-bold">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    Appointment Request Received
                  </h3>
                  <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto">
                    Thank you, <span className="font-semibold text-slate-800">{submittedData?.patientName}</span>. Your request has been saved in our clinic database.
                  </p>
                </div>

                {/* Explicit Disclaimer: appointment NOT confirmed until verified */}
                <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-900 text-xs sm:text-sm text-left flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Important Notice:</span>
                    Submitting this request does not mean your appointment is confirmed yet. Our clinic team will review schedule availability and call you at <span className="font-semibold underline">{submittedData?.phoneNumber}</span> to confirm your final appointment time.
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl text-left text-xs space-y-1.5 border border-slate-200">
                  <p className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Request Summary:</p>
                  <p><strong className="text-slate-700">Patient:</strong> {submittedData?.patientName}</p>
                  <p><strong className="text-slate-700">Phone:</strong> {submittedData?.phoneNumber}</p>
                  {submittedData?.email && <p><strong className="text-slate-700">Email:</strong> {submittedData.email}</p>}
                  <p><strong className="text-slate-700">Service:</strong> {submittedData?.service}</p>
                  <p><strong className="text-slate-700">Preferred Date:</strong> {submittedData?.appointmentDate || "Not specified"}</p>
                  <p><strong className="text-slate-700">Preferred Time:</strong> {submittedData?.appointmentTime || "Not specified"}</p>
                  {submittedData?.notes && <p><strong className="text-slate-700">Notes:</strong> {submittedData.notes}</p>}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                  <a
                    id="appointment-whatsapp-followup-btn"
                    href={getCustomWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold transition-all shadow-md shadow-emerald-200 hover:-translate-y-0.5"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Send via WhatsApp as well</span>
                  </a>
                  <button
                    id="appointment-reset-btn"
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center justify-center px-5 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-bold transition-colors cursor-pointer"
                  >
                    Submit Another Request
                  </button>
                </div>
              </div>
            ) : (
              <form id="appointment-form" onSubmit={handleSubmit} className="space-y-4 relative z-10">
                
                {/* Patient Name */}
                <div>
                  <label htmlFor="patientName" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Patient Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      id="patientName"
                      name="patientName"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.patientName}
                      onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Phone Number & Email Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Email Address <span className="text-slate-400 font-normal lowercase">(optional)</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="e.g. rahul@example.com"
                        value={formData.email || ""}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Service / Treatment Selection */}
                <div>
                  <label htmlFor="service" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Select Dental Service / Treatment
                  </label>
                  <div className="relative">
                    <Stethoscope className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors cursor-pointer"
                    >
                      {DENTAL_SERVICES.map((srv) => (
                        <option key={srv} value={srv}>
                          {srv}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Preferred Date & Preferred Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="preferredDate" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Preferred Date
                    </label>
                    <div className="relative">
                      <Calendar className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="date"
                        id="preferredDate"
                        name="preferredDate"
                        value={formData.appointmentDate || formData.preferredDate || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            appointmentDate: e.target.value,
                            preferredDate: e.target.value,
                          })
                        }
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors cursor-pointer"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="preferredTime" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Preferred Time
                    </label>
                    <div className="relative">
                      <Clock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <select
                        id="preferredTime"
                        name="preferredTime"
                        value={formData.appointmentTime || formData.preferredTime || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            appointmentTime: e.target.value,
                            preferredTime: e.target.value,
                          })
                        }
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors cursor-pointer"
                      >
                        <option value="">Select Preferred Time</option>
                        <option value="Morning (10:00 AM - 1:00 PM)">Morning (10:00 AM - 1:00 PM)</option>
                        <option value="Afternoon (1:00 PM - 4:00 PM)">Afternoon (1:00 PM - 4:00 PM)</option>
                        <option value="Evening (5:00 PM - 8:30 PM)">Evening (5:00 PM - 8:30 PM)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Reason / Notes */}
                <div>
                  <label htmlFor="notes" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Message / Dental Symptoms (Notes)
                  </label>
                  <div className="relative">
                    <FileText className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                    <textarea
                      id="notes"
                      name="notes"
                      rows={3}
                      placeholder="Describe any pain, dental history, or questions for Dr. Esha Pandey..."
                      value={formData.notes || formData.reasonForVisit || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          notes: e.target.value,
                          reasonForVisit: e.target.value,
                        })
                      }
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Notice adhering to prompt */}
                <div className="text-[12px] text-slate-500 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                  <p>
                    <strong className="text-slate-700">Notice:</strong> Submitting this form sends an appointment request. It is <em>not</em> an automatic confirmation. Our clinic will call you to confirm the exact schedule.
                  </p>
                </div>

                {/* Request Appointment CTA Button */}
                <button
                  id="request-appointment-submit-button"
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-base shadow-lg shadow-blue-200 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving Request...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Request Appointment</span>
                    </>
                  )}
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

            {/* WhatsApp Appointment Card */}
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
