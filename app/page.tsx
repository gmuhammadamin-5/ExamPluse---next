"use client";

import Hero from "@/components/Sections/Hero";
import Features from "@/components/Sections/Features";
import HowItWorks from "@/components/Sections/HowItworks";
import TestExamples from "@/components/Sections/TestExamples";
import Testimonials from "@/components/Sections/Testimonials";
import MockCentersClient from "@/components/Sections/MockCentersClient";

export default function HomePage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <TestExamples />
      <Testimonials />
      <MockCentersClient />
      <Features />
    </>
  );
}
