import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-grid-animated relative overflow-hidden">
      {/* Glow Orbs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[rgba(0,240,255,0.15)] blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-[rgba(255,0,170,0.15)] blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">{children}</div>
    </div>
  );
}
