"use client";

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import Loading from '@/components/Layout/Loading';
import AuthModal from '@/components/Auth/AuthModal';

const NO_SHELL = ['/admin'];
const NO_FOOTER = ['/ai-tutor'];

export default function ClientShell({ children }) {
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loading />;

  const isAdmin = NO_SHELL.some(p => pathname?.startsWith(p));
  if (isAdmin) return <>{children}</>;

  const hideFooter = NO_FOOTER.some(p => pathname?.startsWith(p));

  return (
    <div className="App">
      <Header />
      <main>{children}</main>
      {!hideFooter && <Footer />}
      <AuthModal />
    </div>
  );
}
