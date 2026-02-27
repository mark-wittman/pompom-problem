import { create } from 'zustand';
import { GamePhase, PaintColor, AccessoryName, HighScoreEntry } from '@/types';

const HIGH_SCORES_KEY = 'pompom-high-scores';

interface GameState {
  phase: GamePhase;
  elapsedTime: number;
  styleScore: number;
  pomColor: PaintColor;
  accessories: AccessoryName[];
  spellingWord: string;
  spellingAttempts: number;
  muted: boolean;
  playerName: string;
  lives: number;
  highScores: HighScoreEntry[];
  respawnMode: 'platform' | 'bottom' | null;

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
  startNewGame: () => void;
  setPlayerName: (name: string) => void;
  loseLife: () => void;
  setRespawnMode: (mode: 'platform' | 'bottom' | null) => void;
  addHighScore: (entry: HighScoreEntry) => void;
  loadHighScores: () => void;
}

function loadHighScoresFromStorage(): HighScoreEntry[] {
  try {
    const stored = localStorage.getItem(HIGH_SCORES_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return [];
}

function saveHighScoresToStorage(scores: HighScoreEntry[]) {
  try {
    localStorage.setItem(HIGH_SCORES_KEY, JSON.stringify(scores));
  } catch {}
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
  playerName: '',
  lives: 3,
  highScores: [],
  respawnMode: null,

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

  // resetGame: resets round state but preserves playerName, lives, highScores
  resetGame: () =>
    set({
      phase: 'title',
      elapsedTime: 0,
      styleScore: 0,
      pomColor: 'white',
      accessories: [],
      spellingWord: '',
      spellingAttempts: 0,
      respawnMode: null,
    }),

  // startNewGame: full reset including lives (called from title screen)
  startNewGame: () =>
    set({
      phase: 'playing',
      elapsedTime: 0,
      styleScore: 0,
      pomColor: 'white',
      accessories: [],
      spellingWord: '',
      spellingAttempts: 0,
      lives: 3,
      respawnMode: null,
    }),

  setPlayerName: (name) => set({ playerName: name }),
  loseLife: () => set((s) => ({ lives: Math.max(0, s.lives - 1) })),
  setRespawnMode: (mode) => set({ respawnMode: mode }),

  addHighScore: (entry) =>
    set((s) => {
      const updated = [...s.highScores, entry]
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);
      saveHighScoresToStorage(updated);
      return { highScores: updated };
    }),

  loadHighScores: () =>
    set({ highScores: loadHighScoresFromStorage() }),
}));
