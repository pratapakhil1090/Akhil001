/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { TrustSection } from "./components/TrustSection";
import { AboutSection } from "./components/AboutSection";
import { RctSection } from "./components/RctSection";
import { TechnologySection } from "./components/TechnologySection";
import { AppointmentSection } from "./components/AppointmentSection";
import { ContactSection } from "./components/ContactSection";
import { Footer } from "./components/Footer";
import { MobileBottomBar } from "./components/MobileBottomBar";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Sticky Public Navbar */}
      <Navbar />

      {/* Main Content Sections */}
      <main className="flex-1">
        <Hero />
        <TrustSection />
        <AboutSection />
        <RctSection />
        <TechnologySection />
        <AppointmentSection />
        <ContactSection />
      </main>

      {/* Public Footer */}
      <Footer />

      {/* Mobile Sticky Action Bar */}
      <MobileBottomBar />
    </div>
  );
}

