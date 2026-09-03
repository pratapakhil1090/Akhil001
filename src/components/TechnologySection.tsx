import React from "react";
import { Cpu, Sparkles, Check, Target, Award, Layers } from "lucide-react";
import dentalUnitImage from "../assets/images/dental_chair_unit_1788406997847.jpg";

export const TechnologySection: React.FC = () => {
  const techHighlights = [
    {
      id: "tech-highlight-latest-tech",
      title: "Latest Technology",
      description:
        "Modern dental operatory engineering configured to provide a seamless, comfortable, and modern treatment experience.",
      icon: Cpu,
    },
    {
      id: "tech-highlight-state-of-the-art",
      title: "State-of-the-Art Setup",
      description:
        "Thoughtfully designed clinical environment maintaining the highest hygiene, ergonomic comfort, and clinical efficiency.",
      icon: Layers,
    },
    {
      id: "tech-highlight-digitalized-unit",
      title: "Digitalized Treatment Unit",
      description:
        "Integrated digital treatment systems allowing streamlined clinical operation and clear visual feedback during care.",
      icon: Sparkles,
    },
    {
      id: "tech-highlight-accurate-diagnosis",
      title: "Accurate Diagnosis",
      description:
        "Advanced diagnostic capability supporting Dr. Esha Pandey in pinpointing dental issues and forming effective plans.",
      icon: Target,
    },
    {
      id: "tech-highlight-quality-care",
      title: "High-Quality Dental Care",
      description:
        "Engineered to enable the highest quality of dental care for every patient visiting the Lucknow clinic.",
      icon: Award,
    },
  ];

  return (
    <section id="technology" className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 lg:mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-950/80 border border-blue-800/80 px-3.5 py-1.5 rounded-full inline-block">
            Clinic Infrastructure
          </span>
          <h2
            id="technology-heading"
            className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight"
          >
            Fully Digitalized Dental Treatment Unit
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            “We have the latest, state of the art, fully digitalized Dental Treatment unit which allows us to provide accurate diagnosis enabling us to provide the highest quality of dental care.”
          </p>
        </div>

        {/* Two-column layout: Large Operatory Photo & Highlights */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Photo Column */}
          <div className="lg:col-span-7">
            <div className="relative rounded-[32px] overflow-hidden border border-slate-700/80 bg-slate-800 shadow-2xl p-3">
              <div className="relative rounded-2xl overflow-hidden aspect-16/9 bg-slate-800">
                <img
                  id="technology-unit-image"
                  src={dentalUnitImage}
                  alt="State-of-the-Art Fully Digitalized Dental Treatment Unit at Dr. Esha Pandey's Clinic"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-slate-200 bg-slate-900/90 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-700">
                  <span className="font-bold text-blue-400">Digital Treatment Operatory</span>
                  <span className="text-slate-400">Dr. Esha Pandey • Lucknow</span>
                </div>
              </div>
            </div>
          </div>

          {/* Highlights Column */}
          <div className="lg:col-span-5 space-y-3.5">
            {techHighlights.map((item) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={item.id}
                  id={item.id}
                  className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700/80 hover:border-blue-500/60 hover:bg-slate-800 transition-colors flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
