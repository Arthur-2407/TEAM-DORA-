'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { useAuth } from '@/context/AuthContext';
import { Skeleton } from '@/components/ui/Skeleton';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isDemo, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user && !isDemo) {
      router.push('/login');
    }
  }, [loading, user, isDemo, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-4 text-center max-w-sm">
          <div className="w-12 h-12 rounded-xl border-2 border-[var(--neon-cyan)] border-t-transparent animate-spin" />
          <p
            className="text-xs font-mono tracking-widest text-[var(--neon-cyan)] uppercase"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            SYNCHRONIZING NEURAL UPLINK...
          </p>
          <Skeleton width="100%" height="4px" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] bg-grid flex">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:pl-[260px] min-w-0">
        <TopBar onMenuToggle={() => setSidebarOpen((prev) => !prev)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
