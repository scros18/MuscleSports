'use client';

import { Suspense, useEffect } from 'react';
import { MaintenancePage } from '@/components/maintenance-page';
import { useSearchParams } from 'next/navigation';

function MaintenanceContent() {
  const searchParams = useSearchParams();
  const message = searchParams.get('message') || undefined;
  const estimatedTime = searchParams.get('estimatedTime') || undefined;

  // Force clean theme on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Remove any theme classes and styles from root
      document.documentElement.className = '';
      document.body.className = '';
      
      // Remove any injected theme styles
      const themeStyles = document.querySelectorAll('style[data-theme]');
      themeStyles.forEach(style => style.remove());
    }
  }, []);

  return (
    <MaintenancePage 
      message={message} 
      estimatedTime={estimatedTime} 
    />
  );
}

export default function Maintenance() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    }>
      <MaintenanceContent />
    </Suspense>
  );
}
