import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VectorEdge Pro - Advanced Trading Platform",
  description: "Professional trading platform with advanced analytics and AI insights",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <title>VectorEdge</title>
      <body className="">
        {children}
      </body>
    </html>
  );
}