'use client';

import { useGameStore } from '@/state/gameStore';
import { audioManager } from '@/audio/AudioManager';

export default function HUD() {
  const { elapsedTime, styleScore, muted, toggleMute } = useGameStore();

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleMute = () => {
    toggleMute();
    audioManager.toggleMute();
  };

  return (
    <div
      className="absolute top-0 left-0 right-0 z-10 flex justify-between items-start p-3 pointer-events-none"
      style={{ fontFamily: "'Patrick Hand', cursive" }}
    >
      {/* Timer */}
      <div
        className="bg-[#FDF6E3]/80 px-3 py-1 rounded-lg border border-[#E8E0D0]"
        style={{ color: '#4A4A4A' }}
      >
        <span className="text-lg">{formatTime(elapsedTime)}</span>
      </div>

      {/* Style Score */}
      <div
        className="bg-[#FDF6E3]/80 px-3 py-1 rounded-lg border border-[#E8E0D0] flex items-center gap-1"
        style={{ color: '#4A4A4A' }}
      >
        <span className="text-lg">✨ {styleScore}/10</span>
      </div>

      {/* Mute button */}
      <button
        onClick={handleMute}
        className="pointer-events-auto bg-[#FDF6E3]/80 px-2 py-1 rounded-lg border border-[#E8E0D0] text-lg cursor-pointer"
        style={{ color: '#4A4A4A' }}
      >
        {muted ? '🔇' : '🔊'}
      </button>
    </div>
  );
}
