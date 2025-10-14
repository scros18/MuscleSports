import { MaintenancePage } from '@/components/maintenance-page';

interface MaintenanceProps {
  searchParams: {
    message?: string;
    estimatedTime?: string;
  };
}

export default function Maintenance({ searchParams }: MaintenanceProps) {
  return (
    <MaintenancePage 
      message={searchParams.message} 
      estimatedTime={searchParams.estimatedTime} 
    />
  );
}
