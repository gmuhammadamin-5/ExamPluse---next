// Fayl: src/app/test-mock/page.js
"use client";

import React from 'react';
import TestDashboard from '@/components/Tests/TestDashboard';

export default function MockExamPage() {
  return (
    <div className="min-h-screen bg-slate-50">
       <TestDashboard />
    </div>
  );
}