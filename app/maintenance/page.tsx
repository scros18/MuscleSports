import { MaintenancePage } from '@/components/maintenance-page';

interface MaintenancePageProps {
  searchParams: {
    message?: string;
    estimatedTime?: string;
  };
}

export default function Maintenance({ searchParams }: MaintenancePageProps) {
  return (
    <MaintenancePage 
      message={searchParams.message} 
      estimatedTime={searchParams.estimatedTime} 
    />
  );
}
