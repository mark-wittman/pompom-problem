'use client';

import { useEffect, useRef } from 'react';
import { useGameStore } from '@/state/gameStore';
import { audioManager } from '@/audio/AudioManager';
import { PomPomRenderer } from '@/rendering/PomPomRenderer';

export default function TitleScreen() {
  const { setPhase, playerName, setPlayerName, highScores, loadHighScores, startNewGame } =
    useGameStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<PomPomRenderer | null>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    loadHighScores();
  }, [loadHighScores]);

  // Animated pom-pom mascot
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (!rendererRef.current) {
      rendererRef.current = new PomPomRenderer();
    }

    const dpr = window.devicePixelRatio || 1;
    const size = 160;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    const render = (time: number) => {
      ctx.clearRect(0, 0, size, size);
      const t = time / 1000;
      rendererRef.current!.renderPortrait(ctx, size / 2, size / 2, 2.3, 'white', [], t);
      animRef.current = requestAnimationFrame(render);
    };

    animRef.current = requestAnimationFrame(render);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  const handlePlay = () => {
    if (!playerName.trim()) return;
    audioManager.init();
    startNewGame();
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return `${d.getMonth() + 1}/${d.getDate()}`;
    } catch {
      return '';
    }
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center z-20 bg-[#FDF6E3]/95 overflow-y-auto">
      <div className="flex flex-col items-center w-full max-w-sm px-6 py-8">
        {/* Title + mascot */}
        <div className="text-center mb-1">
          <h1
            className="text-6xl font-bold tracking-tight leading-none"
            style={{
              fontFamily: "'Patrick Hand', cursive",
              color: '#4A4A4A',
              textShadow: '2px 2px 0px #E8D44E, -1px -1px 0px #E8829B',
            }}
          >
            PomPom
          </h1>
          <h2
            className="text-3xl font-bold -mt-1"
            style={{
              fontFamily: "'Patrick Hand', cursive",
              color: '#5B8DBE',
            }}
          >
            Problem
          </h2>
        </div>

        {/* Animated pom-pom */}
        <div className="mb-0">
          <canvas ref={canvasRef} />
        </div>

        <p
          className="text-sm text-gray-400 mb-8"
          style={{ fontFamily: "'Patrick Hand', cursive" }}
        >
          a fluffy climbing adventure
        </p>

        {/* Name input */}
        <div className="w-full mb-3">
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value.slice(0, 16))}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handlePlay();
            }}
            placeholder="Your name"
            maxLength={16}
            className="w-full text-center text-xl py-2.5 px-4 bg-white rounded-xl border-2 border-[#E8E0D0] outline-none focus:border-[#5B8DBE] transition-colors"
            style={{
              fontFamily: "'Patrick Hand', cursive",
              color: '#4A4A4A',
            }}
            autoComplete="off"
          />
        </div>

        {/* Play button */}
        <button
          onClick={handlePlay}
          disabled={!playerName.trim()}
          className="px-10 py-3 text-2xl rounded-2xl border-2 transition-all hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
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
        <p
          className="mt-3 text-xs text-gray-300 text-center"
          style={{ fontFamily: "'Patrick Hand', cursive" }}
        >
          Arrows / WASD to move &middot; Space to jump
        </p>

        {/* High Scores */}
        {highScores.length > 0 && (
          <div className="w-full mt-5">
            <div className="bg-white rounded-xl border-2 border-[#E8E0D0] p-4">
              <h3
                className="text-lg mb-3 text-center"
                style={{
                  fontFamily: "'Patrick Hand', cursive",
                  color: '#4A4A4A',
                }}
              >
                🏆 Leaderboard
              </h3>
              <div className="space-y-1">
                {highScores.slice(0, 5).map((entry, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-sm px-2 py-1 rounded-lg"
                    style={{
                      fontFamily: "'Patrick Hand', cursive",
                      color: '#4A4A4A',
                      backgroundColor: i === 0 ? '#FFF8E1' : 'transparent',
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-5 text-center font-bold"
                        style={{
                          color:
                            i === 0 ? '#E8D44E' : i === 1 ? '#B0B0B0' : i === 2 ? '#CD7F32' : '#9B9B9B',
                        }}
                      >
                        {i + 1}
                      </span>
                      <span className="truncate max-w-[100px]">{entry.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold" style={{ color: '#5B8DBE' }}>
                        {entry.score}
                      </span>
                      <span
                        className="w-6 text-center font-bold text-sm"
                        style={{
                          color:
                            entry.grade === 'S' ? '#FFD700' :
                            entry.grade === 'A' ? '#7EBD73' :
                            entry.grade === 'B' ? '#5B8DBE' :
                            entry.grade === 'C' ? '#E8A34E' : '#E8829B',
                        }}
                      >
                        {entry.grade}
                      </span>
                      <span className="text-xs text-gray-300 w-10 text-right">
                        {formatDate(entry.date)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
