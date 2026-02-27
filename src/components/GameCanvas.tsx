'use client';

import { useEffect, useRef, useCallback } from 'react';
import { Game } from '@/engine/Game';
import { useCanvas } from '@/hooks/useCanvas';
import { useInput, resetInputFlags } from '@/hooks/useInput';
import { useGameLoop } from '@/hooks/useGameLoop';
import { useGameStore } from '@/state/gameStore';
import { audioManager } from '@/audio/AudioManager';
import { PaintColor, AccessoryName } from '@/types';

interface GameCanvasProps {
  running: boolean;
}

export default function GameCanvas({ running }: GameCanvasProps) {
  const { canvasRef, ctxRef } = useCanvas();
  const input = useInput();
  const gameRef = useRef<Game | null>(null);
  const initRef = useRef(false);

  const {
    setElapsedTime,
    setPomColor,
    addAccessory,
    incrementStyleScore,
    setPhase,
    resetGame,
  } = useGameStore();

  // Initialize game
  useEffect(() => {
    if (!canvasRef.current || initRef.current) return;
    initRef.current = true;

    const game = new Game();
    game.init(canvasRef.current);
    gameRef.current = game;

    // Set up callbacks
    game.onCollectPaint = (color: string) => {
      setPomColor(color as PaintColor);
      audioManager.playSfx('paint');
    };

    game.onCollectAccessory = (name: string) => {
      addAccessory(name as AccessoryName);
      incrementStyleScore();
      audioManager.playSfx('collect');
    };

    game.onReachSummit = () => {
      setPhase('spelling');
    };

    game.onFellOff = () => {
      // Brief delay then restart
      setTimeout(() => {
        resetGame();
        setPhase('playing');
      }, 800);
    };
  }, [canvasRef, setPomColor, addAccessory, incrementStyleScore, setPhase, resetGame]);

  // Reset game when starting new round
  useEffect(() => {
    if (running && gameRef.current) {
      gameRef.current.reset();
    }
  }, [running]);

  // Game loop
  const gameLoop = useCallback(
    (dt: number, time: number) => {
      const game = gameRef.current;
      const ctx = ctxRef.current;
      if (!game || !ctx) return;

      if (running) {
        game.update(input, dt);
        setElapsedTime(game.elapsedTime);

        // Audio for jump/land
        if (input.jumpPressed && game.pom.coyoteTimer > 0) {
          audioManager.playSfx('jump');
        }
      }

      game.render(ctx, time);

      resetInputFlags(input);
    },
    [running, input, ctxRef, setElapsedTime]
  );

  useGameLoop(gameLoop, true); // Always render, but only update when running

  return (
    <canvas
      ref={canvasRef}
      className="block touch-none"
      style={{ imageRendering: 'auto' }}
    />
  );
}
