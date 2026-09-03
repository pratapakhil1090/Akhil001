import React from "react";
import { Cpu, MonitorCheck, Target, Award, Heart } from "lucide-react";

export const TrustSection: React.FC = () => {
  const trustItems = [
    {
      id: "trust-card-treatment-unit",
      title: "State-of-the-Art Dental Treatment Unit",
      description:
        "Equipped with advanced modern dental systems engineered for patient comfort, optimal ergonomics, and clinical excellence.",
      icon: Cpu,
      accent: "text-blue-600 bg-blue-50 border-blue-100",
    },
    {
      id: "trust-card-digitalized-care",
      title: "Fully Digitalized Dental Care",
      description:
        "Modern digitalized workflows that enhance precision across examinations, treatment planning, and procedure execution.",
      icon: MonitorCheck,
      accent: "text-blue-600 bg-blue-50 border-blue-100",
    },
    {
      id: "trust-card-accurate-diagnosis",
      title: "Accurate Diagnosis",
      description:
        "Digital technology enables clear visibility and thorough assessment to identify dental concerns with high precision.",
      icon: Target,
      accent: "text-blue-600 bg-blue-50 border-blue-100",
    },
    {
      id: "trust-card-quality-care",
      title: "Quality Dental Care",
      description:
        "Dedicated to providing the highest standard of dental treatment focused on lasting oral health and gentle patient care.",
      icon: Award,
      accent: "text-blue-600 bg-blue-50 border-blue-100",
    },
    {
      id: "trust-card-lgbtq-friendly",
      title: "LGBTQ+ Friendly",
      description:
        "A welcoming, safe, and respectful environment where every patient is treated with dignity, compassion, and equality.",
      icon: Heart,
      accent: "text-rose-600 bg-rose-50 border-rose-100",
      highlight: true,
    },
  ];

  return (
    <section id="trust-section" className="py-16 md:py-20 bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-100/80 px-3.5 py-1.5 rounded-full inline-block">
            Clinical Standards
          </span>
          <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Built on Precision, Technology & Patient Respect
          </h2>
          <p className="mt-2 text-base text-slate-600">
            Committed to advanced digital dental care and accurate diagnosis for patients across Lucknow.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {trustItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <div
                key={item.id}
                id={item.id}
                className={`flex flex-col p-6 rounded-2xl bg-white border transition-all duration-200 hover:-translate-y-1 hover:shadow-xl ${
                  item.highlight
                    ? "border-rose-200 bg-gradient-to-b from-rose-50/40 via-white to-white hover:border-rose-300 hover:shadow-rose-100/60"
                    : "border-slate-200/80 hover:border-blue-400 hover:shadow-blue-100/60"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center border mb-4 font-bold ${item.accent}`}
                >
                  <IconComponent className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 leading-snug mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mt-auto">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
