'use client';

import { MaintenancePage } from '@/components/maintenance-page';
import { useSearchParams } from 'next/navigation';

export default function Maintenance() {
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
