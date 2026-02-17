import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css"; 
// Agar CSS faylingiz styles papkasida bo'lsa: import "@/styles/App.css";

import Providers from "@/components/Providers/Providers";
import ClientLayout from "@/components/Layout/ClientShell";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata = {
  title: "ExamPulse",
  description: "AI IELTS Preparation Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={jakarta.className}>
        <Providers>
          {/* Loading va Mobile Check shu ClientLayout ichida */}
          <ClientLayout>
            {children}
          </ClientLayout>
        </Providers>
      </body>
    </html>
  );
}