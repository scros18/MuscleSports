import type { Metadata } from "next";
import "../globals.css";

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
  // Return ONLY the children, no header/footer
  return children;
}

