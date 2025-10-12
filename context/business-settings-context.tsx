"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface BusinessSettings {
  id: string;
  theme: string;
  businessName?: string;
  businessType?: 'salon' | 'ecommerce' | 'gym' | 'other';
  logoUrl?: string;
  address?: string;
  phone?: string;
  email?: string;
  openingHours?: {
    [key: string]: { open: string; close: string; closed?: boolean };
  };
  googleMapsEmbed?: string;
  latitude?: number;
  longitude?: number;
  primaryColor?: string;
  secondaryColor?: string;
  description?: string;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    tiktok?: string;
  };
}

interface BusinessSettingsContextType {
  settings: BusinessSettings;
  loading: boolean;
  updateSettings: (settings: Partial<BusinessSettings>) => Promise<void>;
  refreshSettings: () => Promise<void>;
}

const defaultSettings: BusinessSettings = {
  id: 'default',
  theme: 'ordify',
  businessType: 'ecommerce'
};

const BusinessSettingsContext = createContext<BusinessSettingsContextType>({
  settings: defaultSettings,
  loading: true,
  updateSettings: async () => {},
  refreshSettings: async () => {}
});

export function BusinessSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<BusinessSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/business-settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Failed to fetch business settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<BusinessSettings>) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/business-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...settings, ...newSettings })
      });

      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      } else {
        throw new Error('Failed to update settings');
      }
    } catch (error) {
      console.error('Failed to update business settings:', error);
      throw error;
    }
  };

  const refreshSettings = async () => {
    await fetchSettings();
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <BusinessSettingsContext.Provider value={{ settings, loading, updateSettings, refreshSettings }}>
      {children}
    </BusinessSettingsContext.Provider>
  );
}

export function useBusinessSettings() {
  return useContext(BusinessSettingsContext);
}
