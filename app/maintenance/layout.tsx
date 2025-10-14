import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Site Under Maintenance - MuscleSports',
  description: 'We are currently performing scheduled maintenance. Please check back soon!',
  robots: 'noindex, nofollow',
};

export default function MaintenanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          * { margin: 0; padding: 0; box-sizing: border-box; }
          html, body { height: 100%; }
          body { 
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%) !important;
            color: white !important;
            display: block !important;
            visibility: visible !important;
            overflow-x: hidden;
          }
          body * { display: block !important; visibility: visible !important; }
        `
      }} />
      <div style={{
        display: 'block',
        visibility: 'visible',
        minHeight: '100vh',
        margin: 0,
        padding: 0,
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)',
        color: 'white'
      }}>
        {children}
      </div>
    </>
  );
}
