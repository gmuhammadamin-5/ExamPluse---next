"use client";
import dynamic from 'next/dynamic';

const Lessons = dynamic(() => import('./Lessons'), { ssr: false });

export default function LessonsClient() {
  return <Lessons />;
}
