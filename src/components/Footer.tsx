import React from "react";
import { Phone, MapPin, Calendar, Navigation, Heart, ShieldCheck, ArrowUp } from "lucide-react";
import { CLINIC_INFO, NAV_LINKS } from "../constants";

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer id="main-footer" className="bg-slate-900 text-slate-300 pt-16 pb-24 md:pb-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          
          {/* Col 1: Identity & Credentials */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-blue-600/30">
                EP
              </div>
              <div>
                <h3 id="footer-doctor-name" className="text-xl font-extrabold text-white tracking-tight">
                  {CLINIC_INFO.doctorName}
                </h3>
                <p className="text-xs text-blue-400 font-bold tracking-wide">
                  {CLINIC_INFO.doctorTitle}
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-300 font-medium">
              {CLINIC_INFO.specialization}
            </p>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              “{CLINIC_INFO.aboutQuote}”
            </p>

            <div className="flex items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/60 text-rose-300 border border-rose-800/80 text-xs font-semibold">
                <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
                {CLINIC_INFO.specialNote}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/60 text-blue-300 border border-blue-800/80 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                Digital Treatment Unit
              </span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    id={`footer-link-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                    href={link.href}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Address, Phone & Actions */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Clinic Location & Contact
            </h4>
            
            <div className="space-y-2 text-sm text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-1" />
                <div>
                  <p>{CLINIC_INFO.addressFull.line1}</p>
                  <p>{CLINIC_INFO.addressFull.line2}</p>
                  <p className="font-bold text-white">{CLINIC_INFO.addressFull.cityStateZip}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 pt-1">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <a
                  id="footer-phone-link"
                  href={CLINIC_INFO.phoneTel}
                  className="font-bold text-white hover:text-blue-400 transition-colors"
                >
                  {CLINIC_INFO.phone}
                </a>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <a
                id="footer-appointment-cta"
                href="#appointment"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/30 hover:-translate-y-0.5"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Appointment</span>
              </a>

              <a
                id="footer-maps-directions-link"
                href={CLINIC_INFO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-bold transition-colors"
              >
                <Navigation className="w-4 h-4 text-blue-400" />
                <span>Google Maps / Directions</span>
              </a>
            </div>

          </div>

        </div>

        {/* Bottom copyright line and back to top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p id="footer-copyright">
            © {new Date().getFullYear()} Dr. Esha Pandey. Best Dentist & RCT Specialist in Lucknow. All rights reserved.
          </p>

          <button
            id="footer-back-to-top"
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
};
