'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminCatchAllRedirect({
  params,
}: {
  params: { slug?: string[] };
}) {
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(true);

  useEffect(() => {
    // Redirect to the /admin route with the path preserved
    const slug = params.slug?.[0] || '';
    
    if (!slug) {
      // Just stay on /admin (root admin page)
      setIsRedirecting(false);
      return;
    }

    // For any other paths like /admin/orders, /admin/products, etc.
    // they will be handled by the individual page files we create directly in /app/admin/
    // This catch-all just prevents them from being lost
    setIsRedirecting(false);
  }, [params.slug, router]);

  if (isRedirecting) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading...</p>
        </div>
      </div>
    );
  }

  // This component acts as a fallback - individual pages in /app/admin/[page]/page.tsx will take precedence
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-center">
        <p className="text-slate-300">Page not found</p>
      </div>
    </div>
  );
}
