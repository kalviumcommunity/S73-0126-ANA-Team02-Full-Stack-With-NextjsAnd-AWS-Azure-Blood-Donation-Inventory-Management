import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Blood Donation Inventory",
  description: "Track and manage blood donations with a modern Next.js app."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  /* Layout wraps every page; use it to define html/body structure and shared UI. */
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
