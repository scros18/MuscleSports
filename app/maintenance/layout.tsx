import type { Metadata } from "next";
import { Inter, Saira } from "next/font/google";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });
const saira = Saira({ 
  subsets: ["latin"],
  variable: "--font-saira",
  weight: ["300", "400", "500", "600", "700", "800"]
});

export const metadata: Metadata = {
  title: "Maintenance - MuscleSports",
  description: "We're currently performing maintenance. We'll be back soon!",
  robots: "noindex,nofollow",
};

export default function MaintenanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="theme-musclesports">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>
      <body className={`${inter.className} ${saira.variable} antialiased theme-musclesports`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

