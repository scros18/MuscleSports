import { MaintenancePage } from '@/components/maintenance-page';

interface MaintenanceProps {
  searchParams: {
    message?: string;
    estimatedTime?: string;
  };
}

export const metadata = {
  title: 'Maintenance - MuscleSports',
  description: 'We\'re currently performing maintenance',
  robots: 'noindex,nofollow',
};

export default function Maintenance({ searchParams }: MaintenanceProps) {
  return (
    <MaintenancePage 
      message={searchParams.message} 
      estimatedTime={searchParams.estimatedTime} 
    />
  );
}
