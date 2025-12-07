import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HevyConnect - Convert Hevy Workouts to Garmin FIT",
  description: "Convert your Hevy CSV workout files to Garmin FIT format for seamless import into Garmin Connect",
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

