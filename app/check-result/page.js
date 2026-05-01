"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CheckResultPage() {
  const router = useRouter();
  useEffect(() => { router.replace('/results'); }, [router]);
  return null;
}
