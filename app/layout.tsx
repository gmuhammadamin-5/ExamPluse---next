import React from "react";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers/Providers";
import ClientLayout from "@/components/Layout/ClientShell";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://exampulse.uz"),
  title: {
    template: "%s | ExamPulse",
    default: "ExamPulse — AI-Powered IELTS, TOEFL & SAT Preparation",
  },
  description:
    "ExamPulse — IELTS, TOEFL, SAT, Cambridge va CEFR imtihonlariga AI yordamida tayyorlanish platformasi. Real mock testlar, darhol AI feedback, 12,000+ o'quvchi. Bepul boshlang.",
  keywords: [
    "IELTS preparation",
    "IELTS mock test",
    "TOEFL preparation",
    "SAT practice",
    "Cambridge exam",
    "CEFR test",
    "AI tutor",
    "online exam preparation",
    "imtihon tayyorgarlik",
    "IELTS band score",
    "speaking practice",
    "writing evaluation",
    "ExamPulse",
  ],
  authors: [{ name: "ExamPulse" }],
  creator: "ExamPulse",
  publisher: "ExamPulse",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    locale: "uz_UZ",
    alternateLocale: ["en_US", "ru_RU"],
    url: "https://exampulse.uz",
    siteName: "ExamPulse",
    title: "ExamPulse — AI-Powered IELTS, TOEFL & SAT Preparation",
    description:
      "IELTS, TOEFL, SAT, Cambridge imtihonlariga AI yordamida tayyorlanish. Real mock testlar va darhol AI feedback.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "ExamPulse" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ExamPulse — AI IELTS & Exam Prep",
    description: "IELTS, TOEFL, SAT imtihonlariga AI yordamida tayyorlanish.",
    images: ["/og-image.png"],
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <head>
        <link rel="canonical" href="https://exampulse.uz" />
        <script src="https://accounts.google.com/gsi/client" async defer id="google-gsi-script" />
      </head>
      <body className={jakarta.className}>
        <Providers>
          <ClientLayout>{children}</ClientLayout>
        </Providers>
      </body>
    </html>
  );
}
