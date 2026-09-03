import React, { useState, useEffect } from "react";
import { Phone, Calendar, Menu, X, ShieldCheck } from "lucide-react";
import { CLINIC_INFO, NAV_LINKS } from "../constants";

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-200 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-xs border-b border-slate-100"
          : "bg-white/80 backdrop-blur-xs border-b border-slate-100/60"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Identity */}
          <a
            id="nav-brand-link"
            href="#home"
            className="flex items-center gap-3 group focus:outline-hidden focus:ring-2 focus:ring-blue-500 rounded-lg p-1"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-blue-200 group-hover:bg-blue-700 transition-all">
              <span>P</span>
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                {CLINIC_INFO.doctorName}
              </span>
              <span className="text-[10px] uppercase tracking-widest text-blue-600 font-semibold">
                Best Dentist in Lucknow
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav id="desktop-nav-links" className="hidden lg:flex items-center gap-1 xl:gap-2">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                id={`nav-link-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                href={link.href}
                className="px-3.5 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50/70 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Header Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              id="nav-phone-cta"
              href={CLINIC_INFO.phoneTel}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-slate-700 hover:text-blue-600 hover:bg-blue-50/80 rounded-xl transition-colors"
            >
              <Phone className="w-4 h-4 text-blue-600" />
              <span>{CLINIC_INFO.phone}</span>
            </a>
            <a
              id="nav-book-cta"
              href="#appointment"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-md shadow-blue-200 hover:-translate-y-0.5 transition-all"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <a
              id="nav-mobile-call-icon"
              href={CLINIC_INFO.phoneTel}
              className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg sm:hidden"
              aria-label="Call clinic"
            >
              <Phone className="w-5 h-5" />
            </a>
            <button
              id="mobile-menu-toggle-button"
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div id="mobile-navigation-drawer" className="lg:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <div className="flex flex-col space-y-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                id={`mobile-nav-link-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 rounded-lg text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
            <a
              id="mobile-menu-call-btn"
              href={CLINIC_INFO.phoneTel}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-blue-700 bg-blue-50 border border-blue-100"
            >
              <Phone className="w-4 h-4" />
              <span>Call {CLINIC_INFO.phone}</span>
            </a>
            <a
              id="mobile-menu-book-btn"
              href="#appointment"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-200"
            >
              <Calendar className="w-4 h-4" />
              <span>Book an Appointment</span>
            </a>
            <div className="flex items-center justify-center gap-1.5 py-1 text-xs font-medium text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Fully Digitalized Dental Care</span>
              <span className="text-slate-300">•</span>
              <span className="text-blue-700 font-semibold">{CLINIC_INFO.specialNote}</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
