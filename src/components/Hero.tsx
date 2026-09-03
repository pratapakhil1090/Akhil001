import React from "react";
import { Phone, Calendar, MapPin, Sparkles, Heart, Activity, CheckCircle2 } from "lucide-react";
import { CLINIC_INFO } from "../constants";
import doctorImage from "../assets/images/doctor_portrait_1788406982056.jpg";

export const Hero: React.FC = () => {
  return (
    <section
      id="home"
      className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden bg-white"
    >
      {/* Artistic Flair background graphics and ambient lighting */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50/80 rounded-bl-full pointer-events-none -z-10 opacity-70" />
      <div className="absolute top-1/3 left-0 w-72 h-72 bg-blue-100/30 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Heading, Subtitles, Location & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-6">
            
            {/* Artistic Flair Pill Badge */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div
                id="hero-badge-best-dentist"
                className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-blue-100/80"
              >
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                <span>{CLINIC_INFO.doctorTitle}</span>
              </div>

              <div
                id="hero-location-badge"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200/80 text-xs font-semibold text-slate-700"
              >
                <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Rashmi Khand, Lucknow</span>
              </div>
            </div>

            {/* Doctor Name & Titles in Artistic Flair display typography */}
            <div className="space-y-3">
              <h1
                id="hero-doctor-name"
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]"
              >
                {CLINIC_INFO.doctorName}
                <span className="block text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-700 mt-2">
                  RCT Specialist in <span className="text-blue-600">Lucknow</span>
                </span>
              </h1>
            </div>

            {/* Supporting Line */}
            <p
              id="hero-supporting-line"
              className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed font-normal"
            >
              “{CLINIC_INFO.aboutQuote}”
            </p>

            {/* Micro Feature Cards - Signature Artistic Flair Pattern */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1 w-full max-w-xl">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 hover:border-blue-200 transition-colors">
                <h3 className="text-xs font-bold text-blue-600 uppercase mb-1">Infrastructure</h3>
                <p className="text-xs font-bold text-slate-800 leading-snug">State-of-the-Art Digital Unit</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 hover:border-blue-200 transition-colors">
                <h3 className="text-xs font-bold text-blue-600 uppercase mb-1">Specialization</h3>
                <p className="text-xs font-bold text-slate-800 leading-snug">RCT Specialist in Lucknow</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 hover:border-blue-200 transition-colors">
                <h3 className="text-xs font-bold text-blue-600 uppercase mb-1">Inclusivity</h3>
                <p className="text-xs font-bold text-slate-800 leading-snug uppercase tracking-tight flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 shrink-0" />
                  <span>{CLINIC_INFO.specialNote}</span>
                </p>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2 w-full sm:w-auto">
              <a
                id="hero-primary-cta"
                href="#appointment"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 text-sm sm:text-base font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-lg shadow-blue-200 hover:-translate-y-0.5 transition-all"
              >
                <Calendar className="w-5 h-5" />
                <span>Book an Appointment</span>
              </a>

              <a
                id="hero-secondary-cta"
                href={CLINIC_INFO.phoneTel}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 text-sm sm:text-base font-bold text-slate-700 bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-slate-300 rounded-xl transition-all"
              >
                <Phone className="w-5 h-5 text-blue-600" />
                <span>Call {CLINIC_INFO.phone}</span>
              </a>
            </div>

            {/* Address snippet */}
            <div className="text-xs text-slate-500 pt-1 flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>A1/3, Bangla Bazar Rd, Rashmi Khand, Sharda Nagar, Lucknow – 226002</span>
            </div>

          </div>

          {/* Right Column: Doctor & Clinic Imagery in Artistic Flair frame */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md">
              
              {/* Outer Artistic curved card frame */}
              <div className="relative rounded-[32px] overflow-hidden shadow-2xl shadow-blue-100/80 border border-blue-50 bg-white p-3">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full pointer-events-none opacity-60" />
                <div className="relative rounded-2xl overflow-hidden aspect-4/3 sm:aspect-1/1 bg-slate-100">
                  <img
                    id="hero-doctor-image"
                    src={doctorImage}
                    alt="Dr. Esha Pandey - Dentist and RCT Specialist in Lucknow"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                  
                  {/* Overlay badge in photo */}
                  <div className="absolute bottom-3 left-3 right-3 p-3.5 rounded-xl bg-white/95 backdrop-blur-md shadow-sm border border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-900 leading-tight">Dr. Esha Pandey</p>
                      <p className="text-[11px] text-blue-600 font-bold">Best Dentist in Lucknow</p>
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                      Lucknow
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating Trust Chip: Digital Treatment Unit */}
              <div className="hidden sm:flex absolute -bottom-5 -left-5 bg-white rounded-2xl p-3.5 shadow-xl shadow-blue-100 border border-blue-50 items-center gap-3 max-w-[250px]">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 font-bold">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Fully Digitalized</p>
                  <p className="text-[11px] text-slate-500">Treatment Unit</p>
                </div>
              </div>

              {/* Floating Trust Chip: LGBTQ+ Friendly */}
              <div className="hidden sm:flex absolute -top-4 -right-4 bg-white rounded-2xl px-4 py-2.5 shadow-xl shadow-blue-100 border border-blue-50 items-center gap-2">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                <span className="text-xs font-bold text-slate-800">{CLINIC_INFO.specialNote}</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
