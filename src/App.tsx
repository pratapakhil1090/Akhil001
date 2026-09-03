/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
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
import { AdminLogin } from "./components/admin/AdminLogin";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { AdminUser } from "./types";
import { clinicApi } from "./services/api";

export default function App() {
  const [view, setView] = useState<"public" | "admin">("public");
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return localStorage.getItem("admin_token");
  });
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [authChecking, setAuthChecking] = useState<boolean>(true);

  // Sync with URL hash / pathname on load and popstate
  useEffect(() => {
    const handleUrlChange = () => {
      const isHashAdmin =
        window.location.hash === "#admin" ||
        window.location.hash === "#admin/login" ||
        window.location.hash === "#dashboard";
      const isPathAdmin =
        window.location.pathname.startsWith("/admin") ||
        window.location.pathname.startsWith("/dashboard");
      if (isHashAdmin || isPathAdmin) {
        setView("admin");
      }
    };

    handleUrlChange();
    window.addEventListener("hashchange", handleUrlChange);
    window.addEventListener("popstate", handleUrlChange);

    return () => {
      window.removeEventListener("hashchange", handleUrlChange);
      window.removeEventListener("popstate", handleUrlChange);
    };
  }, []);

  // Validate existing admin token on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        setAuthChecking(false);
        return;
      }

      try {
        const result = await clinicApi.checkAuth(token);
        if (result.success && result.admin) {
          setAdminUser(result.admin);
          setAdminToken(token);
        } else {
          localStorage.removeItem("admin_token");
          setAdminToken(null);
          setAdminUser(null);
        }
      } catch (err) {
        console.error("Auth validation error:", err);
      } finally {
        setAuthChecking(false);
      }
    };

    checkAuth();
  }, []);

  const handleOpenAdmin = () => {
    setView("admin");
    window.location.hash = "#admin";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToWebsite = () => {
    setView("public");
    if (window.location.hash.startsWith("#admin")) {
      window.location.hash = "";
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLoginSuccess = (admin: AdminUser, token: string) => {
    setAdminToken(token);
    setAdminUser(admin);
    localStorage.setItem("admin_token", token);
  };

  const handleLogout = async () => {
    if (adminToken) {
      await clinicApi.logout(adminToken);
    }
    localStorage.removeItem("admin_token");
    setAdminToken(null);
    setAdminUser(null);
  };

  // If in admin view
  if (view === "admin") {
    if (adminToken && adminUser) {
      return (
        <AdminDashboard
          token={adminToken}
          adminUser={adminUser}
          onLogout={handleLogout}
          onViewWebsite={handleBackToWebsite}
        />
      );
    }

    return (
      <AdminLogin
        onLoginSuccess={handleLoginSuccess}
        onBackToWebsite={handleBackToWebsite}
      />
    );
  }

  // Public Dental Clinic Website
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Sticky Navbar with discreet Admin Login */}
      <Navbar onOpenAdmin={handleOpenAdmin} />

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

      {/* Footer with discreet Admin Login */}
      <Footer onOpenAdmin={handleOpenAdmin} />

      {/* Mobile Sticky Action Bar */}
      <MobileBottomBar />
    </div>
  );
}
