import React from "react";
import { MapPin, Phone, MessageCircle, Navigation, ExternalLink, ShieldCheck, Heart } from "lucide-react";
import { CLINIC_INFO } from "../constants";

export const ContactSection: React.FC = () => {
  // Safe Google Maps embed using the clinic's actual address without inventing coordinates
  const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
    CLINIC_INFO.addressQuery
  )}&t=&z=16&ie=UTF8&iwloc=&output=embed`;

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-3xl mx-auto text-center mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-100/80 px-3.5 py-1.5 rounded-full inline-block">
            Clinic Location & Contact
          </span>
          <h2
            id="contact-heading"
            className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight"
          >
            Visit Our Clinic in Lucknow
          </h2>
          <p className="mt-2 text-base text-slate-600">
            Conveniently situated in Sharda Nagar, offering easy accessibility and dedicated patient care.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* Left Column: Address & Contact Details */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            
            {/* Address Card */}
            <div
              id="contact-address-card"
              className="p-6 sm:p-8 rounded-[28px] bg-white border border-slate-200/80 shadow-md shadow-blue-50/50 space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-200">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Clinic Address</h3>
                  <p className="text-xs text-blue-700 font-bold">Dr. Esha Pandey</p>
                </div>
              </div>

              {/* Exact address display */}
              <div className="text-slate-800 text-base leading-relaxed pl-3 border-l-3 border-blue-600">
                <p className="font-semibold">{CLINIC_INFO.addressFull.line1}</p>
                <p>{CLINIC_INFO.addressFull.line2}</p>
                <p className="font-bold text-slate-900">{CLINIC_INFO.addressFull.cityStateZip}</p>
              </div>

              <div className="pt-2">
                <a
                  id="contact-get-directions-btn"
                  href={CLINIC_INFO.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all shadow-lg shadow-blue-200 hover:-translate-y-0.5"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Get Directions</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-75" />
                </a>
              </div>
            </div>

            {/* Direct Phone CTA Card */}
            <div
              id="contact-phone-card"
              className="p-6 sm:p-7 rounded-[28px] bg-white border border-slate-200/80 shadow-md shadow-blue-50/50 space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100 font-bold">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Telephone Contact</h4>
                  <p className="text-xs text-slate-500">Tap to call directly</p>
                </div>
              </div>

              <a
                id="contact-phone-clickable"
                href={CLINIC_INFO.phoneTel}
                className="block text-2xl sm:text-3xl font-black text-blue-600 hover:text-blue-700 tracking-tight transition-colors"
              >
                {CLINIC_INFO.phone}
              </a>

              <p className="text-xs text-slate-500">
                Available for appointment requests, inquiries, and treatment consultations.
              </p>
            </div>

            {/* Direct WhatsApp CTA Card */}
            <div
              id="contact-whatsapp-card"
              className="p-6 sm:p-7 rounded-[28px] bg-white border border-slate-200/80 shadow-md shadow-blue-50/50 space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100 font-bold">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">WhatsApp Messaging</h4>
                  <p className="text-xs text-slate-500">74600 10035</p>
                </div>
              </div>

              <a
                id="contact-whatsapp-link"
                href={CLINIC_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-all shadow-md shadow-emerald-200 hover:-translate-y-0.5"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>

            {/* Inclusivity & Safety Badge */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-blue-50/60 border border-blue-100">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Modern Dental Care</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
                <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                <span>{CLINIC_INFO.specialNote}</span>
              </div>
            </div>

          </div>

          {/* Right Column: Google Maps integration */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="relative w-full h-full min-h-[420px] lg:min-h-[500px] rounded-[32px] overflow-hidden border border-slate-200/80 shadow-2xl shadow-blue-100/60 bg-slate-100 flex flex-col">
              
              {/* Header Bar above Map */}
              <div className="bg-white px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold text-slate-900">
                    Dr. Esha Pandey – Clinic Location
                  </span>
                </div>
                <a
                  id="contact-open-maps-link"
                  href={CLINIC_INFO.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <span>View Larger Map</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Google Maps Embed iframe with actual address */}
              <div className="relative flex-1 w-full">
                <iframe
                  id="google-maps-iframe"
                  title="Dr. Esha Pandey Clinic Location Map"
                  src={mapEmbedUrl}
                  className="w-full h-full border-0 absolute inset-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>

              {/* Footer Banner below Map */}
              <div className="bg-white p-5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
                <p>
                  <strong className="text-slate-900">Landmark:</strong> Bangla Bazar Rd, Rashmi Khand, Sharda Nagar, Lucknow – 226002
                </p>
                <a
                  id="contact-map-directions-btn"
                  href={CLINIC_INFO.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 text-blue-700 font-bold hover:underline"
                >
                  Get Driving Directions →
                </a>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
