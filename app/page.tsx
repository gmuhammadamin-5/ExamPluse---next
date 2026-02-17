"use client";

import dynamic from 'next/dynamic';

// Sectionlarni import qilamiz
import Hero from '@/components/Sections/Hero';
import Features from '@/components/Sections/Features';
import HowItWorks from '@/components/Sections/HowItworks';
import TestExamples from '@/components/Sections/TestExamples';
import Testimonials from '@/components/Sections/Testimonials';

// Xaritani faqat brauzerda yuklaymiz (Xato bermasligi uchun)
const MockCenters = dynamic(() => import('@/components/Sections/MockCenters'), { 
  ssr: false 
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <TestExamples />
      <Testimonials />
      <MockCenters />
      <Features />
    </>
  );
}