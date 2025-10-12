"use client";

import { useEffect } from 'react';

export function ThemeLoader() {
  useEffect(() => {
    // Load and apply theme from localStorage on page load
    const savedTheme = localStorage.getItem('admin_theme');
    
    // Remove all theme classes first
    document.documentElement.classList.remove('theme-lumify', 'theme-musclesports', 'theme-vera', 'theme-blisshair');
    document.body.classList.remove('theme-lumify', 'theme-musclesports', 'theme-vera', 'theme-blisshair');
    
    // Apply saved theme
    if (savedTheme === 'lumify') {
      document.documentElement.classList.add('theme-lumify');
      document.body.classList.add('theme-lumify');
    } else if (savedTheme === 'musclesports') {
      document.documentElement.classList.add('theme-musclesports');
      document.body.classList.add('theme-musclesports');
    } else if (savedTheme === 'vera') {
      document.documentElement.classList.add('theme-vera');
      document.body.classList.add('theme-vera');
    } else if (savedTheme === 'blisshair') {
      document.documentElement.classList.add('theme-blisshair');
      document.body.classList.add('theme-blisshair');
    }
    // ordify is default (no class needed), lumify is new default
  }, []);

  return null;
}
