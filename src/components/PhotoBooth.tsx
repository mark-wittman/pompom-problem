'use client';

import { useRef, useEffect } from 'react';
import { useGameStore } from '@/state/gameStore';
import { PomPomRenderer } from '@/rendering/PomPomRenderer';
import { PALETTE } from '@/utils/color';

export default function PhotoBooth() {
  const { elapsedTime, styleScore, pomColor, accessories, resetGame, setPhase } = useGameStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<PomPomRenderer | null>(null);
  const animRef = useRef<number>(0);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (!rendererRef.current) {
      rendererRef.current = new PomPomRenderer();
    }

    const dpr = window.devicePixelRatio || 1;
    canvas.width = 300 * dpr;
    canvas.height = 300 * dpr;
    canvas.style.width = '300px';
    canvas.style.height = '300px';
    ctx.scale(dpr, dpr);

    const render = (time: number) => {
      ctx.clearRect(0, 0, 300, 300);

      // Paper background
      ctx.fillStyle = '#FDF6E3';
      ctx.fillRect(0, 0, 300, 300);

      // Decorative border (hand-drawn style)
      ctx.strokeStyle = '#E8E0D0';
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 4]);
      ctx.strokeRect(8, 8, 284, 284);
      ctx.setLineDash([]);

      // Confetti dots
      const t = time / 1000;
      ctx.globalAlpha = 0.3;
      const confettiColors = ['#E8829B', '#5B8DBE', '#7EBD73', '#E8D44E', '#9B72CF', '#E8A34E'];
      for (let i = 0; i < 20; i++) {
        const cx = 30 + (i * 137) % 240;
        const cy = 20 + Math.sin(t * 2 + i) * 10 + (i * 97) % 260;
        ctx.fillStyle = confettiColors[i % confettiColors.length];
        ctx.beginPath();
        ctx.arc(cx, cy, 3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Render pom-pom portrait
      rendererRef.current!.renderPortrait(
        ctx,
        150,
        150,
        3.5,
        pomColor,
        accessories,
        t
      );

      animRef.current = requestAnimationFrame(render);
    };

    animRef.current = requestAnimationFrame(render);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [pomColor, accessories]);

  const handlePlayAgain = () => {
    resetGame();
    setPhase('title');
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-[#FDF6E3]/95">
      <div
        className="text-center"
        style={{ fontFamily: "'Patrick Hand', cursive" }}
      >
        <h2 className="text-3xl mb-4" style={{ color: '#4A4A4A' }}>
          Photo Booth!
        </h2>

        {/* Portrait canvas */}
        <div className="inline-block rounded-2xl overflow-hidden border-4 border-[#E8E0D0] shadow-lg mb-6">
          <canvas ref={canvasRef} />
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-8 mb-6">
          <div className="text-center">
            <div className="text-sm text-gray-400">Time</div>
            <div className="text-2xl" style={{ color: '#5B8DBE' }}>
              {formatTime(elapsedTime)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-400">Style</div>
            <div className="text-2xl" style={{ color: '#E8829B' }}>
              ✨ {styleScore}/10
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-400">Color</div>
            <div className="text-2xl">
              <span
                className="inline-block w-6 h-6 rounded-full border-2 border-gray-300"
                style={{ backgroundColor: PALETTE[pomColor] }}
              />
            </div>
          </div>
        </div>

        {/* Accessories collected */}
        {accessories.length > 0 && (
          <div className="mb-6">
            <div className="text-sm text-gray-400 mb-1">Collected</div>
            <div className="flex flex-wrap justify-center gap-2">
              {accessories.map((acc) => (
                <span
                  key={acc}
                  className="px-2 py-1 bg-white rounded-lg border border-[#E8E0D0] text-sm"
                  style={{ color: '#4A4A4A' }}
                >
                  {acc}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Play Again button */}
        <button
          onClick={handlePlayAgain}
          className="px-8 py-3 text-xl rounded-2xl border-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          style={{
            fontFamily: "'Patrick Hand', cursive",
            backgroundColor: '#E8829B',
            borderColor: '#C4607A',
            color: '#FFFFFF',
            boxShadow: '3px 3px 0px #C4607A',
          }}
        >
          Play Again!
        </button>
      </div>
    </div>
  );
}
