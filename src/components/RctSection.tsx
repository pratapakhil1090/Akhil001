import React from "react";
import { Activity, CheckCircle2, Calendar, Phone, ArrowRight, Shield, Sparkles } from "lucide-react";
import { CLINIC_INFO } from "../constants";

export const RctSection: React.FC = () => {
  return (
    <section id="rct-specialist" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100/80 text-blue-700 text-xs font-bold tracking-wider uppercase">
            <Activity className="w-3.5 h-3.5 text-blue-600" />
            Specialized Dental Care
          </div>
          <h2
            id="rct-specialist-heading"
            className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight"
          >
            RCT Specialist in Lucknow
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Consult Dr. Esha Pandey for dedicated Root Canal Treatment (RCT) care in Lucknow, powered by a state-of-the-art, fully digitalized dental treatment unit.
          </p>
        </div>

        {/* Informational Cards strictly supported by provided facts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
          <div
            id="rct-card-digital-diagnosis"
            className="p-8 rounded-[28px] bg-white border border-slate-200/80 shadow-md shadow-blue-50/50 flex flex-col hover:border-blue-400 hover:shadow-xl hover:shadow-blue-100/50 hover:-translate-y-1 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5 border border-blue-100">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Accurate Diagnostic Assessment
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Dr. Esha Pandey utilizes fully digitalized dental treatment systems to carry out accurate diagnosis, identifying the precise condition of the tooth before RCT treatment.
            </p>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-bold text-blue-700">
              <CheckCircle2 className="w-4 h-4 mr-1.5 text-blue-600" />
              Accurate Diagnosis
            </div>
          </div>

          <div
            id="rct-card-state-of-the-art"
            className="p-8 rounded-[28px] bg-white border border-slate-200/80 shadow-md shadow-blue-50/50 flex flex-col hover:border-blue-400 hover:shadow-xl hover:shadow-blue-100/50 hover:-translate-y-1 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5 border border-blue-100">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              State-of-the-Art Treatment Unit
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Equipped with the latest dental technology, the clinic’s digitalized treatment unit facilitates precise procedures for high-quality root canal dental care.
            </p>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-bold text-blue-700">
              <CheckCircle2 className="w-4 h-4 mr-1.5 text-blue-600" />
              Fully Digitalized Setup
            </div>
          </div>

          <div
            id="rct-card-patient-care"
            className="p-8 rounded-[28px] bg-white border border-slate-200/80 shadow-md shadow-blue-50/50 flex flex-col hover:border-blue-400 hover:shadow-xl hover:shadow-blue-100/50 hover:-translate-y-1 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5 border border-blue-100">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Highest Quality Dental Care
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Every RCT consultation is focused on providing the highest standard of dental treatment, preserving natural teeth and ensuring patient well-being.
            </p>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-bold text-blue-700">
              <CheckCircle2 className="w-4 h-4 mr-1.5 text-blue-600" />
              Patient-Centric Approach
            </div>
          </div>

        </div>

        {/* Feature Banner in Artistic Flair aesthetic */}
        <div
          id="rct-cta-banner"
          className="rounded-[32px] bg-slate-900 text-white p-8 sm:p-12 shadow-2xl shadow-blue-950/20 flex flex-col lg:flex-row items-center justify-between gap-8 border border-slate-800 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-bl-full pointer-events-none" />
          <div className="space-y-2.5 text-center lg:text-left relative z-10">
            <span className="text-xs uppercase font-bold tracking-widest text-blue-400">
              Consultation in Lucknow
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Looking for an RCT Specialist in Lucknow?
            </h3>
            <p className="text-slate-300 text-sm sm:text-base max-w-xl font-normal leading-relaxed">
              Visit Dr. Esha Pandey at Bangla Bazar Rd, Rashmi Khand, Sharda Nagar for advanced, fully digitalized root canal assessment.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full lg:w-auto shrink-0 relative z-10">
            <a
              id="rct-book-btn"
              href="#appointment"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all text-sm hover:-translate-y-0.5"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
            </a>
            <a
              id="rct-call-btn"
              href={CLINIC_INFO.phoneTel}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl font-bold text-slate-200 bg-slate-800 hover:bg-slate-750 border border-slate-700 transition-colors text-sm"
            >
              <Phone className="w-4 h-4 text-blue-400" />
              <span>Call {CLINIC_INFO.phone}</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
