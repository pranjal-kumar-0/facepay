"use client";

import { ReactNode } from "react";

interface ScannerLayoutProps {
  children: ReactNode;
}

export default function ScannerLayout({ children }: ScannerLayoutProps) {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-violet-950/20 via-zinc-950 to-emerald-950/10"></div>
      
      {/* Header */}
      <div className="relative z-10 p-6 pb-4">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
          <h1 className="text-xl font-light text-zinc-100 tracking-[0.3em] uppercase">
            Scan
          </h1>
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse delay-500"></div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 relative z-10 px-6 flex flex-col">
        <div className="flex-1 relative flex items-center justify-center">
          {children}
        </div>
      </div>
    </div>
  );
}
