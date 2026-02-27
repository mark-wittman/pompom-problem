'use client';

import { useEffect, useRef, useCallback } from 'react';
import { InputState } from '@/types';

export function useInput(): InputState {
  const state = useRef<InputState>({
    left: false,
    right: false,
    up: false,
    down: false,
    jumpPressed: false,
    jumpReleased: false,
  });

  const keys = useRef<Set<string>>(new Set());

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' '].includes(e.key)) {
      e.preventDefault();
    }

    if (keys.current.has(e.key)) return;
    keys.current.add(e.key);

    switch (e.key) {
      case 'ArrowLeft':
      case 'a':
        state.current.left = true;
        break;
      case 'ArrowRight':
      case 'd':
        state.current.right = true;
        break;
      case 'ArrowUp':
      case 'w':
      case ' ':
        state.current.up = true;
        state.current.jumpPressed = true;
        break;
      case 'ArrowDown':
      case 's':
        state.current.down = true;
        break;
    }
  }, []);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    keys.current.delete(e.key);

    switch (e.key) {
      case 'ArrowLeft':
      case 'a':
        state.current.left = false;
        break;
      case 'ArrowRight':
      case 'd':
        state.current.right = false;
        break;
      case 'ArrowUp':
      case 'w':
      case ' ':
        state.current.up = false;
        state.current.jumpReleased = true;
        break;
      case 'ArrowDown':
      case 's':
        state.current.down = false;
        break;
    }
  }, []);

  // Touch controls
  const touchState = useRef({ active: false, startX: 0, startY: 0 });

  const handleTouchStart = useCallback((e: TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    const canvas = (e.target as HTMLElement).closest('canvas');
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const relX = (touch.clientX - rect.left) / rect.width;
    const relY = (touch.clientY - rect.top) / rect.height;

    touchState.current.active = true;
    touchState.current.startX = touch.clientX;
    touchState.current.startY = touch.clientY;

    // Top 70% = jump
    if (relY < 0.7) {
      state.current.up = true;
      state.current.jumpPressed = true;
    }
    // Bottom 30%: left half = left, right half = right
    if (relY >= 0.7) {
      if (relX < 0.5) {
        state.current.left = true;
      } else {
        state.current.right = true;
      }
    }
  }, []);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    e.preventDefault();
    touchState.current.active = false;
    state.current.left = false;
    state.current.right = false;
    state.current.up = false;
    state.current.down = false;
    state.current.jumpReleased = true;
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    e.preventDefault();
    if (!touchState.current.active || e.touches.length === 0) return;

    const touch = e.touches[0];
    const canvas = (e.target as HTMLElement).closest('canvas');
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const relX = (touch.clientX - rect.left) / rect.width;
    const relY = (touch.clientY - rect.top) / rect.height;

    // Update horizontal direction for bottom area
    state.current.left = relY >= 0.7 && relX < 0.5;
    state.current.right = relY >= 0.7 && relX >= 0.5;
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
      canvas.addEventListener('touchend', handleTouchEnd, { passive: false });
      canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (canvas) {
        canvas.removeEventListener('touchstart', handleTouchStart);
        canvas.removeEventListener('touchend', handleTouchEnd);
        canvas.removeEventListener('touchmove', handleTouchMove);
      }
    };
  }, [handleKeyDown, handleKeyUp, handleTouchStart, handleTouchEnd, handleTouchMove]);

  return state.current;
}

// Call this at end of each frame to reset one-shot flags
export function resetInputFlags(input: InputState): void {
  input.jumpPressed = false;
  input.jumpReleased = false;
}
