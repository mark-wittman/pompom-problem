'use client';

import { useRef, useEffect, useCallback } from 'react';

export function useGameLoop(
  callback: (dt: number, time: number) => void,
  running: boolean
) {
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const loop = useCallback((timestamp: number) => {
    if (lastTimeRef.current === 0) {
      lastTimeRef.current = timestamp;
    }

    let dt = (timestamp - lastTimeRef.current) / 1000;
    lastTimeRef.current = timestamp;

    // Cap delta time to prevent spiral of death
    dt = Math.min(dt, 1 / 30);

    callbackRef.current(dt, timestamp / 1000);

    rafRef.current = requestAnimationFrame(loop);
  }, []);

  useEffect(() => {
    if (running) {
      lastTimeRef.current = 0;
      rafRef.current = requestAnimationFrame(loop);
    }
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [running, loop]);
}
