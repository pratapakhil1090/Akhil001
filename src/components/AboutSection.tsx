import React from "react";
import { Quote, Check, MapPin, Phone, ShieldCheck, Heart } from "lucide-react";
import { CLINIC_INFO } from "../constants";
import doctorImage from "../assets/images/doctor_portrait_1788406982056.jpg";

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-slate-50/50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          
          {/* Left Column: Doctor/Clinic Image in Artistic Flair card frame */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative mx-auto max-w-md">
              <div className="relative rounded-[32px] overflow-hidden shadow-2xl shadow-blue-100/60 border border-blue-50 bg-white p-3">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full pointer-events-none opacity-50" />
                <img
                  id="about-doctor-image"
                  src={doctorImage}
                  alt="Dr. Esha Pandey - Advanced Dental Care in Lucknow"
                  referrerPolicy="no-referrer"
                  className="rounded-2xl w-full h-[380px] sm:h-[440px] object-cover object-top"
                />
              </div>

              {/* Verified clinic note badge */}
              <div className="mt-4 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-md shadow-blue-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 font-bold">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Dr. Esha Pandey</h4>
                    <p className="text-xs text-slate-500">Best Dentist & RCT Specialist</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-100">
                  <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                  <span>{CLINIC_INFO.specialNote}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Exact quote and narrative layout */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-100/80 px-3.5 py-1.5 rounded-full inline-block">
                About The Practice
              </span>
              <h2
                id="about-heading"
                className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight"
              >
                Advanced Dental Care in Lucknow
              </h2>
              <p className="mt-1 text-sm font-bold text-blue-600">
                Dr. Esha Pandey • RCT Specialist in Lucknow
              </p>
            </div>

            {/* Exact Clinic Statement in Artistic Flair quote card */}
            <div
              id="about-clinic-quote-box"
              className="relative p-6 sm:p-8 rounded-[32px] bg-white border border-blue-50 shadow-2xl shadow-blue-100/60 space-y-4 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full pointer-events-none opacity-50 -z-0" />
              <Quote className="w-10 h-10 text-blue-200 absolute top-4 right-4 z-10 opacity-70" />
              <p className="text-lg sm:text-xl text-slate-800 font-semibold leading-relaxed italic relative z-10">
                “{CLINIC_INFO.aboutQuote}”
              </p>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between relative z-10">
                <div>
                  <p className="text-sm font-bold text-slate-900">Dr. Esha Pandey</p>
                  <p className="text-xs text-slate-500">Bangla Bazar Rd, Rashmi Khand, Sharda Nagar, Lucknow</p>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                  Verified Facility
                </span>
              </div>
            </div>

            {/* Core Commitments from provided information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-300 transition-colors">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 border border-blue-100">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Latest Treatment Unit</h4>
                  <p className="text-xs text-slate-600 mt-0.5">Fully digitalized modern operatory infrastructure.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-300 transition-colors">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 border border-blue-100">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Accurate Diagnosis</h4>
                  <p className="text-xs text-slate-600 mt-0.5">Precise diagnostic foundation for effective outcomes.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-300 transition-colors">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 border border-blue-100">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Quality Dental Care</h4>
                  <p className="text-xs text-slate-600 mt-0.5">Delivering patient-centric dental care in Lucknow.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-rose-200/90 hover:border-rose-300 transition-colors">
                <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 mt-0.5 border border-rose-100">
                  <Heart className="w-4 h-4 fill-rose-600 text-rose-600" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">LGBTQ+ Friendly</h4>
                  <p className="text-xs text-slate-600 mt-0.5">Inclusive and welcoming dental practice for everyone.</p>
                </div>
              </div>
            </div>

            {/* Quick Action Links */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                id="about-book-appointment-link"
                href="#appointment"
                className="inline-flex items-center justify-center px-7 py-3.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-lg shadow-blue-200 hover:-translate-y-0.5 transition-all"
              >
                Schedule a Visit
              </a>
              <a
                id="about-call-link"
                href={CLINIC_INFO.phoneTel}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-bold text-slate-700 bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-xl transition-all"
              >
                <Phone className="w-4 h-4 text-blue-600" />
                <span>Call {CLINIC_INFO.phone}</span>
              </a>
              <div className="text-xs text-slate-500 flex items-center gap-1.5 ml-1">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                <span>Rashmi Khand, Lucknow</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
