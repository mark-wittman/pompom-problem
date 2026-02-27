'use client';

import { useRef, useEffect } from 'react';
import { useGameStore } from '@/state/gameStore';
import { PomPomRenderer } from '@/rendering/PomPomRenderer';
import { PALETTE } from '@/utils/color';

export default function PhotoBooth() {
  const { elapsedTime, styleScore, pomColor, accessories, playerName, resetGame, setPhase, addHighScore } =
    useGameStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<PomPomRenderer | null>(null);
  const animRef = useRef<number>(0);
  const savedRef = useRef(false);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Time score: faster = more points (max 50 points for under 1 min, 0 for over 5 min)
  const timeScore = Math.max(0, Math.round(50 * (1 - Math.min(elapsedTime, 300) / 300)));
  // Style score: each accessory = 5 points (max 50)
  const stylePoints = styleScore * 5;
  // Total
  const totalScore = timeScore + stylePoints;

  // Grade
  const grade =
    totalScore >= 90 ? 'S' :
    totalScore >= 75 ? 'A' :
    totalScore >= 55 ? 'B' :
    totalScore >= 35 ? 'C' : 'D';

  const gradeColor =
    grade === 'S' ? '#FFD700' :
    grade === 'A' ? '#7EBD73' :
    grade === 'B' ? '#5B8DBE' :
    grade === 'C' ? '#E8A34E' : '#E8829B';

  // Save high score on mount
  useEffect(() => {
    if (savedRef.current) return;
    savedRef.current = true;
    addHighScore({
      name: playerName || 'Anonymous',
      score: totalScore,
      grade,
      time: elapsedTime,
      style: styleScore,
      date: new Date().toISOString(),
    });
  }, [addHighScore, playerName, totalScore, grade, elapsedTime, styleScore]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (!rendererRef.current) {
      rendererRef.current = new PomPomRenderer();
    }

    const dpr = window.devicePixelRatio || 1;
    canvas.width = 260 * dpr;
    canvas.height = 260 * dpr;
    canvas.style.width = '260px';
    canvas.style.height = '260px';
    ctx.scale(dpr, dpr);

    const render = (time: number) => {
      ctx.clearRect(0, 0, 260, 260);

      // Paper background
      ctx.fillStyle = '#FDF6E3';
      ctx.fillRect(0, 0, 260, 260);

      // Decorative border
      ctx.strokeStyle = '#E8E0D0';
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 4]);
      ctx.strokeRect(8, 8, 244, 244);
      ctx.setLineDash([]);

      // Confetti dots
      const t = time / 1000;
      ctx.globalAlpha = 0.3;
      const confettiColors = ['#E8829B', '#5B8DBE', '#7EBD73', '#E8D44E', '#9B72CF', '#E8A34E'];
      for (let i = 0; i < 16; i++) {
        const cx = 25 + (i * 137) % 210;
        const cy = 20 + Math.sin(t * 2 + i) * 8 + (i * 97) % 220;
        ctx.fillStyle = confettiColors[i % confettiColors.length];
        ctx.beginPath();
        ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Render pom-pom portrait
      rendererRef.current!.renderPortrait(
        ctx, 130, 130, 3,
        pomColor, accessories, t
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
    <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-[#FDF6E3]/95 overflow-y-auto py-4">
      <div
        className="text-center w-full max-w-sm px-4"
        style={{ fontFamily: "'Patrick Hand', cursive" }}
      >
        <h2 className="text-2xl mb-1" style={{ color: '#4A4A4A' }}>
          Photo Booth!
        </h2>
        {playerName && (
          <p className="text-base mb-3" style={{ color: '#9B9B9B' }}>
            Great job, {playerName}!
          </p>
        )}

        {/* Portrait canvas */}
        <div className="inline-block rounded-2xl overflow-hidden border-4 border-[#E8E0D0] shadow-lg mb-4">
          <canvas ref={canvasRef} />
        </div>

        {/* Score card */}
        <div className="bg-white rounded-xl border-2 border-[#E8E0D0] p-4 mb-4">
          {/* Grade */}
          <div className="text-5xl font-bold mb-2" style={{ color: gradeColor }}>
            {grade}
          </div>
          <div className="text-3xl font-bold mb-3" style={{ color: '#4A4A4A' }}>
            {totalScore} pts
          </div>

          {/* Breakdown */}
          <div className="flex justify-center gap-6 text-sm">
            <div>
              <div className="text-gray-400">Time</div>
              <div style={{ color: '#5B8DBE' }}>
                {formatTime(elapsedTime)}
              </div>
              <div className="text-xs text-gray-300">+{timeScore} pts</div>
            </div>
            <div>
              <div className="text-gray-400">Style</div>
              <div style={{ color: '#E8829B' }}>
                {styleScore}/10
              </div>
              <div className="text-xs text-gray-300">+{stylePoints} pts</div>
            </div>
            <div>
              <div className="text-gray-400">Color</div>
              <div>
                <span
                  className="inline-block w-5 h-5 rounded-full border-2 border-gray-300"
                  style={{ backgroundColor: PALETTE[pomColor] }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Play Again button */}
        <button
          onClick={handlePlayAgain}
          className="px-8 py-2.5 text-xl rounded-2xl border-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
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
