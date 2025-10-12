"use client";

import { useEffect } from 'react';

export function ThemeLoader() {
  useEffect(() => {
    // Load and apply theme from localStorage on page load
    const savedTheme = localStorage.getItem('admin_theme');
    
    // Remove all theme classes first
    document.documentElement.classList.remove('theme-lumify', 'theme-musclesports', 'theme-vera');
    document.body.classList.remove('theme-lumify', 'theme-musclesports', 'theme-vera');
    
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
    }
    // ordify is default (no class needed), lumify is new default
  }, []);

  return null;
}
