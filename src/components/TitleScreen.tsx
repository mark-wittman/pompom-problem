'use client';

import { useGameStore } from '@/state/gameStore';
import { audioManager } from '@/audio/AudioManager';

export default function TitleScreen() {
  const { setPhase } = useGameStore();

  const handlePlay = () => {
    audioManager.init();
    setPhase('playing');
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-[#FDF6E3]/95">
      {/* Title */}
      <div className="text-center mb-8">
        <h1
          className="text-6xl font-bold mb-2 tracking-tight"
          style={{
            fontFamily: "'Patrick Hand', cursive",
            color: '#4A4A4A',
            textShadow: '2px 2px 0px #E8D44E, -1px -1px 0px #E8829B',
          }}
        >
          PomPom
        </h1>
        <h2
          className="text-3xl font-bold"
          style={{
            fontFamily: "'Patrick Hand', cursive",
            color: '#5B8DBE',
          }}
        >
          Problem
        </h2>
      </div>

      {/* Cute pom-pom ASCII art representation */}
      <div className="mb-8 text-center">
        <div
          className="text-8xl leading-none animate-bounce"
          style={{ animationDuration: '2s' }}
        >
          ✿
        </div>
        <p
          className="text-sm mt-2 text-gray-500"
          style={{ fontFamily: "'Patrick Hand', cursive" }}
        >
          a fluffy climbing adventure
        </p>
      </div>

      {/* Play button */}
      <button
        onClick={handlePlay}
        className="px-10 py-4 text-2xl rounded-2xl border-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
        style={{
          fontFamily: "'Patrick Hand', cursive",
          backgroundColor: '#7EBD73',
          borderColor: '#5C9B51',
          color: '#FFFFFF',
          boxShadow: '3px 3px 0px #5C9B51',
        }}
      >
        Play!
      </button>

      {/* Controls hint */}
      <div
        className="mt-8 text-sm text-gray-400 text-center"
        style={{ fontFamily: "'Patrick Hand', cursive" }}
      >
        <p>Arrow keys / WASD to move</p>
        <p>Up / Space to jump</p>
        <p className="mt-1 text-xs">Tap on mobile!</p>
      </div>
    </div>
  );
}
