import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Setu Admin",
  description: "Setu provider review console.",
};

// Override the mobile-PWA viewport from the root layout so the admin console
// behaves like a normal, zoomable desktop web page.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "auto",
  colorScheme: "light",
  themeColor: "#ffffff",
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--on-surface)]">
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        rel="stylesheet"
      />
      {children}
    </div>
  );
}
