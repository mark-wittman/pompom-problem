import { create } from 'zustand';
import { GamePhase, PaintColor, AccessoryName } from '@/types';

interface GameState {
  phase: GamePhase;
  elapsedTime: number;
  styleScore: number;
  pomColor: PaintColor;
  accessories: AccessoryName[];
  spellingWord: string;
  spellingAttempts: number;
  muted: boolean;

  // Actions
  setPhase: (phase: GamePhase) => void;
  setElapsedTime: (time: number) => void;
  incrementStyleScore: () => void;
  setPomColor: (color: PaintColor) => void;
  addAccessory: (accessory: AccessoryName) => void;
  setSpellingWord: (word: string) => void;
  incrementSpellingAttempts: () => void;
  toggleMute: () => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  phase: 'title',
  elapsedTime: 0,
  styleScore: 0,
  pomColor: 'white',
  accessories: [],
  spellingWord: '',
  spellingAttempts: 0,
  muted: false,

  setPhase: (phase) => set({ phase }),
  setElapsedTime: (time) => set({ elapsedTime: time }),
  incrementStyleScore: () => set((s) => ({ styleScore: s.styleScore + 1 })),
  setPomColor: (color) => set({ pomColor: color }),
  addAccessory: (accessory) =>
    set((s) => ({
      accessories: s.accessories.includes(accessory)
        ? s.accessories
        : [...s.accessories, accessory],
    })),
  setSpellingWord: (word) => set({ spellingWord: word }),
  incrementSpellingAttempts: () =>
    set((s) => ({ spellingAttempts: s.spellingAttempts + 1 })),
  toggleMute: () => set((s) => ({ muted: !s.muted })),
  resetGame: () =>
    set({
      phase: 'title',
      elapsedTime: 0,
      styleScore: 0,
      pomColor: 'white',
      accessories: [],
      spellingWord: '',
      spellingAttempts: 0,
    }),
}));
