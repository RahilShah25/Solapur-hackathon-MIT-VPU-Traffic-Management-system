import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Using Inter for a cleaner look
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Solapur Traffic Management",
  description: "Advanced Traffic Monitoring & Management System for Solapur City",
};

import { Providers } from "@/components/providers";
import TrafficAiAssistant from "@/components/ai/TrafficAiAssistant";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background font-sans antialiased selection:bg-primary/20 selection:text-primary`}>
        <Providers>
          <Navbar />
          <div className="flex flex-col min-h-screen">
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>

          <TrafficAiAssistant />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
