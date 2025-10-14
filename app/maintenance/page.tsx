'use client';

import { Suspense } from 'react';
import { MaintenancePage } from '@/components/maintenance-page';
import { useSearchParams } from 'next/navigation';
import { Inter, Saira } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
const saira = Saira({ 
  subsets: ["latin"],
  variable: "--font-saira",
  weight: ["300", "400", "500", "600", "700", "800"]
});

function MaintenanceContent() {
  const searchParams = useSearchParams();
  const message = searchParams.get('message') || undefined;
  const estimatedTime = searchParams.get('estimatedTime') || undefined;

  return (
    <MaintenancePage 
      message={message} 
      estimatedTime={estimatedTime} 
    />
  );
}

export default function Maintenance() {
  return (
    <html lang="en" suppressHydrationWarning className="theme-musclesports">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <title>Maintenance - MuscleSports</title>
      </head>
      <body className={`${inter.className} ${saira.variable} antialiased theme-musclesports`} suppressHydrationWarning>
        <Suspense fallback={
          <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
          </div>
        }>
          <MaintenanceContent />
        </Suspense>
      </body>
    </html>
  );
}
