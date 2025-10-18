'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminCatchAllRedirect({
  params,
}: {
  params: { slug?: string[] };
}) {
  const router = useRouter();

  useEffect(() => {
    // This component catches all admin paths and re-renders the appropriate admin page
    // For now, we can just render a simple message
    // In production, we'd need to dynamically load the right component
  }, []);

  return (
    <div className="p-8 text-center">
      <h1>Redirecting...</h1>
    </div>
  );
}
