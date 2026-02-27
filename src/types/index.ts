// Game phases
export type GamePhase = 'title' | 'playing' | 'spelling' | 'dressup' | 'photobooth' | 'math' | 'gameover';

// Platform types
export type PlatformType = 'normal' | 'moving' | 'crumbly';

// Collectible types
export type CollectibleType = 'paint' | 'accessory';

// Paint colors
export type PaintColor = 'white' | 'blue' | 'pink' | 'green' | 'orange' | 'purple' | 'yellow';

// Accessory names
export type AccessoryName =
  | 'sunglasses'
  | 'bow'
  | 'crown'
  | 'tophat'
  | 'flower'
  | 'star'
  | 'mustache'
  | 'cape'
  | 'partyhat'
  | 'wings';

// Position
export interface Vec2 {
  x: number;
  y: number;
}

// AABB bounding box
export interface AABB {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Platform data
export interface PlatformData {
  x: number;
  y: number;
  width: number;
  type: PlatformType;
  moveRange?: number;
  moveSpeed?: number;
  moveAxis?: 'x' | 'y';
}

// Collectible data
export interface CollectibleData {
  x: number;
  y: number;
  type: CollectibleType;
  paintColor?: PaintColor;
  accessoryName?: AccessoryName;
}

// Input state
export interface InputState {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
  jumpPressed: boolean;
  jumpReleased: boolean;
}

// Particle
export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  type: 'dust' | 'sparkle' | 'splatter' | 'fuzz';
}

// Spelling word
export interface SpellingWord {
  word: string;
  difficulty: 'easy' | 'medium';
}

// Math problem
export interface MathProblem {
  question: string;
  answer: number;
  choices: number[];
}

// High score entry
export interface HighScoreEntry {
  name: string;
  score: number;
  grade: string;
  time: number;
  style: number;
  date: string;
}
