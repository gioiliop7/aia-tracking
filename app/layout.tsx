import type React from "react";
import type { Metadata } from "next";
import { Handjet } from "next/font/google";
import "./globals.css";

const handjet = Handjet({
  subsets: ["greek"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Athens International Airport - Flight Information",
  description:
    "Real-time flight arrivals and departures for Athens International Airport Eleftherios Venizelos",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="el">
      <body className={`${handjet.className}`}>{children}</body>
    </html>
  );
}
