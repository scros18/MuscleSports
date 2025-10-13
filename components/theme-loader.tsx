"use client";

import { useEffect } from 'react';
import Script from 'next/script';

export function ThemeLoader() {
  useEffect(() => {
    // This runs after hydration to sync any changes
    const savedTheme = localStorage.getItem('admin_theme');
    
    if (savedTheme) {
      document.documentElement.classList.remove('theme-lumify', 'theme-musclesports', 'theme-vera', 'theme-blisshair', 'theme-ordify');
      document.body.classList.remove('theme-lumify', 'theme-musclesports', 'theme-vera', 'theme-blisshair', 'theme-ordify');
      
      if (savedTheme !== 'ordify') {
        document.documentElement.classList.add(`theme-${savedTheme}`);
        document.body.classList.add(`theme-${savedTheme}`);
      }
    }
  }, []);

  // This script runs BEFORE React hydrates to prevent flash
  return (
    <>
      <Script
        id="theme-loader"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                var savedTheme = localStorage.getItem('admin_theme');
                console.log('ThemeLoader script - savedTheme:', savedTheme);
                
                if (savedTheme) {
                  var themes = ['theme-lumify', 'theme-musclesports', 'theme-vera', 'theme-blisshair', 'theme-ordify'];
                  themes.forEach(function(theme) {
                    document.documentElement.classList.remove(theme);
                  });
                  
                  if (savedTheme !== 'ordify') {
                    document.documentElement.classList.add('theme-' + savedTheme);
                    console.log('ThemeLoader applied class:', 'theme-' + savedTheme);
                  } else {
                    console.log('ThemeLoader: ordify theme (no class needed)');
                  }
                }
                
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