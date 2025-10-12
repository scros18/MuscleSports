"use client";

import { useEffect } from 'react';
import { useBusinessSettings } from '@/context/business-settings-context';

export function DynamicMetadata() {
  const { settings, loading } = useBusinessSettings();

  useEffect(() => {
    if (loading) return;

    // Update document title
    const title = settings.businessName 
      ? `${settings.businessName} - ${settings.description || 'Online Store'}`
      : 'Online Store - Shop the Best Products';
    document.title = title;

    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', settings.description || 'Shop online for the best products with fast shipping and secure checkout.');

    // Update theme color based on primary color
    if (settings.primaryColor) {
      let themeColorMeta = document.querySelector('meta[name="theme-color"]');
      if (!themeColorMeta) {
        themeColorMeta = document.createElement('meta');
        themeColorMeta.setAttribute('name', 'theme-color');
        document.head.appendChild(themeColorMeta);
      }
      themeColorMeta.setAttribute('content', settings.primaryColor);
    }

    // Update Open Graph tags
    const updateMetaTag = (property: string, content: string) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    if (settings.businessName) {
      updateMetaTag('og:site_name', settings.businessName);
      updateMetaTag('og:title', title);
    }
    if (settings.description) {
      updateMetaTag('og:description', settings.description);
    }
    if (settings.logoUrl) {
      updateMetaTag('og:image', settings.logoUrl);
    }

  }, [settings, loading]);

  return null;
}
