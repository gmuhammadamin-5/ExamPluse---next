"use client";

import React from 'react';

// Contextlarni to'g'ri manzildan import qilamiz
import { AuthProvider } from '@/contexts/AuthContext';
import { AIProvider } from '@/contexts/AIContext';
import { GamificationProvider } from '@/contexts/GamificationContext';
import { ProgressProvider } from '@/contexts/ProgressContext';
import { CollaborationProvider } from '@/contexts/CollaborationContext';
import { TestProvider } from '@/components/Tests/TestContext';
import { UserProvider } from '@/contexts/UserContext';

export default function Providers({ children }) {
  return (
    <AuthProvider>
      <AIProvider>
        <GamificationProvider>
          <ProgressProvider>
            <CollaborationProvider>
              <TestProvider>
                <UserProvider>
                  {children}
                </UserProvider>
              </TestProvider>
            </CollaborationProvider>
          </ProgressProvider>
        </GamificationProvider>
      </AIProvider>
    </AuthProvider>
  );
}