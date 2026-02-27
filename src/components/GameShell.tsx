'use client';

import { useGameStore } from '@/state/gameStore';
import GameCanvas from './GameCanvas';
import TitleScreen from './TitleScreen';
import HUD from './HUD';
import SpellingChallenge from './SpellingChallenge';
import DressUp from './DressUp';
import PhotoBooth from './PhotoBooth';
import MathChallenge from './MathChallenge';
import GameOver from './GameOver';

export default function GameShell() {
  const phase = useGameStore((s) => s.phase);

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-[#2A2A2A]">
      {/* Canvas container - maintains aspect ratio */}
      <div className="relative w-full h-full max-w-[600px] max-h-[900px]" style={{ aspectRatio: '2/3' }}>
        {/* Game canvas is always rendered */}
        <GameCanvas running={phase === 'playing'} />

        {/* Overlay layers based on phase */}
        {phase === 'title' && <TitleScreen />}
        {phase === 'playing' && <HUD />}
        {phase === 'spelling' && <SpellingChallenge />}
        {phase === 'dressup' && <DressUp />}
        {phase === 'photobooth' && <PhotoBooth />}
        {phase === 'math' && <MathChallenge />}
        {phase === 'gameover' && <GameOver />}
      </div>
    </div>
  );
}
