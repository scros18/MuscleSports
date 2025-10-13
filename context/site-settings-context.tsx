"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface SiteSettings {
  siteName: string;
  siteUrl: string;
  logoUrl: string;
  tagline: string;
  showSaleBanner?: boolean;
}

interface SiteSettingsContextType {
  settings: SiteSettings;
  updateSettings: (settings: Partial<SiteSettings>) => void;
}

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

const STORAGE_KEY = "ordify-site-settings";

const DEFAULT_SETTINGS: SiteSettings = {
  siteName: "Ordify Direct Ltd",
  siteUrl: "https://ordifydirect.com",
  logoUrl: "/ordifydirectltd.png",
  tagline: "Premium E-Commerce Platform",
  showSaleBanner: true
};

export function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      }
    } catch (error) {
      console.error("Failed to load site settings:", error);
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error("Failed to save site settings:", error);
    }
  }, [settings]);

  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return (
    <SiteSettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  const context = useContext(SiteSettingsContext);
  if (context === undefined) {
    throw new Error("useSiteSettings must be used within a SiteSettingsProvider");
  }
  return context;
}
