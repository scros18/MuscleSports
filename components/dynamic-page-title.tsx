"use client";

import { useEffect } from 'react';
import { useBusinessSettings } from '@/context/business-settings-context';
import { getPageTitle } from '@/lib/dynamic-metadata';

interface DynamicPageTitleProps {
  pageTitle?: string;
}

/**
 * Component that dynamically updates the page title based on business settings
 * Use this in client components to update the title based on business name
 */
export function DynamicPageTitle({ pageTitle }: DynamicPageTitleProps) {
  const { settings, loading } = useBusinessSettings();

  useEffect(() => {
    if (!loading && settings.businessName) {
      const title = getPageTitle(pageTitle || '', settings.businessName);
      document.title = title;
    }
  }, [settings, loading, pageTitle]);

  return null; // This component doesn't render anything
}
