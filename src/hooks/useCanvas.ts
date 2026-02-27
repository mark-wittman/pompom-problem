'use client';

import { useRef, useEffect, useCallback } from 'react';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '@/engine/Physics';

export function useCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const container = canvas.parentElement;
    if (!container) return;

    // Fit canvas to container while maintaining aspect ratio
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    const aspectRatio = CANVAS_WIDTH / CANVAS_HEIGHT;

    let displayWidth: number;
    let displayHeight: number;

    if (containerWidth / containerHeight > aspectRatio) {
      // Container is wider than needed
      displayHeight = containerHeight;
      displayWidth = displayHeight * aspectRatio;
    } else {
      // Container is taller than needed
      displayWidth = containerWidth;
      displayHeight = displayWidth / aspectRatio;
    }

    canvas.style.width = `${displayWidth}px`;
    canvas.style.height = `${displayHeight}px`;
    canvas.width = CANVAS_WIDTH * dpr;
    canvas.height = CANVAS_HEIGHT * dpr;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
      ctxRef.current = ctx;
    }
  }, []);

  useEffect(() => {
    setupCanvas();
    window.addEventListener('resize', setupCanvas);
    return () => window.removeEventListener('resize', setupCanvas);
  }, [setupCanvas]);

  return { canvasRef, ctxRef };
}
