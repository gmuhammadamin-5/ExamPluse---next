import React from "react";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

import Providers from "@/components/Providers/Providers";
import ClientLayout from "@/components/Layout/ClientShell";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata = {
  title: "ExamPulse",
  description: "AI IELTS Preparation Platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={jakarta.className}>
        <Providers>
          <ClientLayout>
            {children}
          </ClientLayout>
        </Providers>
      </body>
    </html>
  );
}