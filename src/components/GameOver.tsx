'use client';

import { useGameStore } from '@/state/gameStore';

export default function GameOver() {
  const { elapsedTime, styleScore, startNewGame, setPhase } = useGameStore();

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTryAgain = () => {
    startNewGame();
    setPhase('title');
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-[#FDF6E3]/95">
      <div
        className="text-center max-w-sm px-6"
        style={{ fontFamily: "'Patrick Hand', cursive" }}
      >
        <h2
          className="text-5xl font-bold mb-3"
          style={{ color: '#E8829B' }}
        >
          Game Over
        </h2>
        <p className="text-lg mb-8" style={{ color: '#9B9B9B' }}>
          No lives left!
        </p>

        {/* Stats */}
        <div className="bg-white rounded-xl border-2 border-[#E8E0D0] p-5 mb-8">
          <div className="flex justify-center gap-8 text-base">
            <div>
              <div className="text-gray-400 text-sm">Time</div>
              <div className="text-xl" style={{ color: '#5B8DBE' }}>
                {formatTime(elapsedTime)}
              </div>
            </div>
            <div>
              <div className="text-gray-400 text-sm">Style</div>
              <div className="text-xl" style={{ color: '#E8829B' }}>
                {styleScore}/10
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleTryAgain}
          className="px-10 py-3 text-2xl rounded-2xl border-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          style={{
            fontFamily: "'Patrick Hand', cursive",
            backgroundColor: '#7EBD73',
            borderColor: '#5C9B51',
            color: '#FFFFFF',
            boxShadow: '3px 3px 0px #5C9B51',
          }}
        >
          Try Again!
        </button>
      </div>
    </div>
  );
}
