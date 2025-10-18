"use client";

import { useEffect } from 'react';
import Script from 'next/script';

export function ThemeLoader() {
  useEffect(() => {
    // Skip theme loading on maintenance page
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/maintenance')) {
      return;
    }

    // Fetch theme from database and apply it
    async function loadTheme() {
      try {
        const response = await fetch('/api/business-settings');
        if (response.ok) {
          const settings = await response.json();
          const theme = settings.theme || 'musclesports';
          
          // Default to musclesports if no theme is set
          if (!settings.theme) {
            // Save musclesports as the default theme
            fetch('/api/business-settings', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ theme: 'musclesports' })
            }).catch(err => console.error('Failed to save default theme:', err));
          }
          
          // Remove all theme classes
          document.documentElement.classList.remove('theme-lumify', 'theme-musclesports', 'theme-vera', 'theme-blisshair', 'theme-ordify');
          document.body.classList.remove('theme-lumify', 'theme-musclesports', 'theme-vera', 'theme-blisshair', 'theme-ordify');
          
          // Apply the theme from database
          if (theme !== 'ordify') {
            document.documentElement.classList.add(`theme-${theme}`);
            document.body.classList.add(`theme-${theme}`);
          }
          
          console.log('Theme loaded from database:', theme);
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    }
    
    loadTheme();
  }, []);

  // This script runs BEFORE React hydrates to prevent flash
  return (
    <>
      <Script
        id="theme-loader"
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                // Skip on maintenance page
                if (window.location.pathname.startsWith('/maintenance')) {
                  return;
                }
                
                // Default to musclesports theme
                var defaultTheme = 'musclesports';
                var themes = ['theme-lumify', 'theme-musclesports', 'theme-vera', 'theme-blisshair', 'theme-ordify'];
                
                // Remove all theme classes
                themes.forEach(function(theme) {
                  document.documentElement.classList.remove(theme);
                });
                
                // Apply musclesports theme by default
                document.documentElement.classList.add('theme-' + defaultTheme);
                console.log('ThemeLoader: Applied default MuscleSports theme');
                
                // Add hydrated class
                document.documentElement.classList.add('hydrated');
              } catch (e) {
                console.error('Theme loader error:', e);
              }
            })();
          `,
        }}
      />
    </>
  );
}