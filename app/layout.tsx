import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hevy to Garmin FIT Converter",
  description: "Convert Hevy CSV workout files to Garmin FIT format",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-light">{children}</body>
    </html>
  );
}

