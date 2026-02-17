"use client"; // Bu qator SHART (Chunki state va effect ishlatyapmiz)

import React, { useState, useEffect } from 'react';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import Loading from '@/components/Layout/Loading';

export default function ClientShell({ children }) {
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // 2 soniyadan keyin loadingni o'chirish
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    // Mobile versiyani tekshirish
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Agar loading bo'lsa, faqat Loading komponenti chiqadi
  if (loading) {
    return <Loading />;
  }

  // Yuklangandan keyin Sayt chiqadi
  return (
    <div className="App">
      <Header />
      <main>
        {children}
      </main>
      <Footer />
    </div>
  );
}