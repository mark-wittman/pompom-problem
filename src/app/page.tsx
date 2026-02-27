'use client';

import dynamic from 'next/dynamic';

// Dynamic import to avoid SSR issues with canvas
const GameShell = dynamic(() => import('@/components/GameShell'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen flex items-center justify-center bg-[#2A2A2A]">
      <div
        className="text-2xl animate-pulse"
        style={{ fontFamily: "'Patrick Hand', cursive", color: '#FDF6E3' }}
      >
        Loading...
      </div>
    </div>
  ),
});

export default function Home() {
  return (
    <main className="w-full h-screen overflow-hidden">
      <GameShell />
    </main>
  );
}
