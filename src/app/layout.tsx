import type { Metadata } from "next";
import "./globals.css";
<<<<<<< HEAD
=======
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
>>>>>>> 83434d5ea574734c562d2d820931a0f62c6b4611

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
<<<<<<< HEAD
    <html lang="en">
      <title>VectorEdge</title>
      <body className="">
        {children}
=======
    <html lang="en" suppressHydrationWarning>
      <body className="font-roboto antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          <TooltipProvider>
            {children}
          </TooltipProvider>
        </ThemeProvider>
>>>>>>> 83434d5ea574734c562d2d820931a0f62c6b4611
      </body>
    </html>
  );
}