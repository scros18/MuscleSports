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

// Completely override the root layout - don't inherit anything
export default function MaintenanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

