"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface PerformanceSettings {
  animationsEnabled: boolean;
  reducedMotion: boolean;
}

interface PerformanceContextType {
  settings: PerformanceSettings;
  updateSettings: (settings: Partial<PerformanceSettings>) => void;
  toggleAnimations: () => void;
}

const PerformanceContext = createContext<PerformanceContextType | undefined>(undefined);

const STORAGE_KEY = "ordify-performance-settings";

export function PerformanceProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<PerformanceSettings>({
    animationsEnabled: true,
    reducedMotion: false,
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSettings(JSON.parse(stored));
      }
      
      // Check for system preference
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) {
        setSettings((prev) => ({ ...prev, reducedMotion: true, animationsEnabled: false }));
      }
    } catch (error) {
      console.error("Failed to load performance settings:", error);
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error("Failed to save performance settings:", error);
    }
  }, [settings]);

  const updateSettings = (newSettings: Partial<PerformanceSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const toggleAnimations = () => {
    setSettings((prev) => ({ ...prev, animationsEnabled: !prev.animationsEnabled }));
  };

  return (
    <PerformanceContext.Provider value={{ settings, updateSettings, toggleAnimations }}>
      {children}
    </PerformanceContext.Provider>
  );
}

export function usePerformance() {
  const context = useContext(PerformanceContext);
  if (context === undefined) {
    throw new Error("usePerformance must be used within a PerformanceProvider");
  }
  return context;
}
