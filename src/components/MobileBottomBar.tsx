import React from "react";
import { Phone, MessageCircle, Calendar } from "lucide-react";
import { CLINIC_INFO } from "../constants";

export const MobileBottomBar: React.FC = () => {
  return (
    <aside
      id="mobile-sticky-bottom-bar"
      aria-label="Quick contact and appointment actions"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-2xl px-3 py-2"
    >
      <div className="grid grid-cols-3 gap-2 max-w-md mx-auto">
        {/* Call Button */}
        <a
          id="mobile-bottom-call-btn"
          href={CLINIC_INFO.phoneTel}
          className="flex flex-col items-center justify-center py-2.5 px-1 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 transition-colors"
        >
          <Phone className="w-4 h-4 text-blue-600 mb-0.5" />
          <span className="text-[11px] font-bold uppercase tracking-tight">Call</span>
        </a>

        {/* WhatsApp Button */}
        <a
          id="mobile-bottom-whatsapp-btn"
          href={CLINIC_INFO.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-2.5 px-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 active:bg-emerald-200 text-emerald-800 transition-colors border border-emerald-200/60"
        >
          <MessageCircle className="w-4 h-4 text-emerald-600 mb-0.5" />
          <span className="text-[11px] font-bold uppercase tracking-tight">WhatsApp</span>
        </a>

        {/* Appointment Button */}
        <a
          id="mobile-bottom-appointment-btn"
          href="#appointment"
          className="flex flex-col items-center justify-center py-2.5 px-1 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white transition-all shadow-md shadow-blue-500/30"
        >
          <Calendar className="w-4 h-4 text-white mb-0.5" />
          <span className="text-[11px] font-bold uppercase tracking-tight">Book</span>
        </a>
      </div>
    </aside>
  );
};
