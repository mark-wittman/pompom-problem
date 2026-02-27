import { SpellingWord } from '@/types';

export const SPELLING_WORDS: SpellingWord[] = [
  // Easy words
  { word: 'fluffy', difficulty: 'easy' },
  { word: 'bouncy', difficulty: 'easy' },
  { word: 'sparkle', difficulty: 'easy' },
  { word: 'purple', difficulty: 'easy' },
  { word: 'flower', difficulty: 'easy' },
  { word: 'rainbow', difficulty: 'easy' },
  { word: 'twinkle', difficulty: 'easy' },
  { word: 'bubble', difficulty: 'easy' },
  { word: 'giggle', difficulty: 'easy' },
  { word: 'shimmer', difficulty: 'easy' },
  // Medium words
  { word: 'beautiful', difficulty: 'medium' },
  { word: 'adventure', difficulty: 'medium' },
  { word: 'brilliant', difficulty: 'medium' },
  { word: 'celebrate', difficulty: 'medium' },
  { word: 'wonderful', difficulty: 'medium' },
  { word: 'marvelous', difficulty: 'medium' },
  { word: 'fantastic', difficulty: 'medium' },
  { word: 'delightful', difficulty: 'medium' },
  { word: 'spectacular', difficulty: 'medium' },
  { word: 'incredible', difficulty: 'medium' },
];

export function getRandomWord(): SpellingWord {
  return SPELLING_WORDS[Math.floor(Math.random() * SPELLING_WORDS.length)];
}
