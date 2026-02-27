'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useGameStore } from '@/state/gameStore';
import { getRandomWord } from '@/level/SpellingWords';
import { audioManager } from '@/audio/AudioManager';

export default function SpellingChallenge() {
  const { setPhase, setSpellingWord, spellingAttempts, incrementSpellingAttempts, loseLife, lives, setRespawnMode } =
    useGameStore();

  const [word, setWord] = useState('');
  const [showWord, setShowWord] = useState(true);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [attempts, setAttempts] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Pick a word on mount
  useEffect(() => {
    const w = getRandomWord();
    setWord(w.word);
    setSpellingWord(w.word);

    // Show word for 5 seconds, then hide
    const timer = setTimeout(() => {
      setShowWord(false);
      // Focus input after word disappears
      setTimeout(() => inputRef.current?.focus(), 100);
    }, 5000);

    return () => clearTimeout(timer);
  }, [setSpellingWord]);

  const handleSubmit = useCallback(() => {
    if (!userInput.trim()) return;

    if (userInput.toLowerCase().trim() === word.toLowerCase()) {
      setFeedback('correct');
      audioManager.playSfx('correct');
      setTimeout(() => {
        setPhase('dressup');
      }, 1500);
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      incrementSpellingAttempts();
      setFeedback('wrong');
      audioManager.playSfx('wrong');
      setUserInput('');

      if (newAttempts >= 3) {
        // Failed spelling — lose a life
        loseLife();
        const remainingLives = lives - 1;
        setTimeout(() => {
          if (remainingLives > 0) {
            setRespawnMode('bottom');
            setPhase('playing');
          } else {
            setPhase('gameover');
          }
        }, 1500);
      } else {
        setTimeout(() => {
          setFeedback(null);
          inputRef.current?.focus();
        }, 800);
      }
    }
  }, [userInput, word, attempts, setPhase, incrementSpellingAttempts, loseLife, lives, setRespawnMode]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-[#FDF6E3]/95">
      <div
        className="text-center max-w-sm px-6"
        style={{ fontFamily: "'Patrick Hand', cursive" }}
      >
        <h2 className="text-3xl mb-6" style={{ color: '#4A4A4A' }}>
          Spelling Challenge!
        </h2>

        {showWord ? (
          // Show the word
          <div className="mb-8">
            <p className="text-lg text-gray-500 mb-2">Remember this word:</p>
            <div
              className="text-5xl py-4 px-6 bg-white rounded-xl border-2 border-[#E8E0D0] inline-block"
              style={{ color: '#5B8DBE' }}
            >
              {word}
            </div>
            <div className="mt-3 text-sm text-gray-400">
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                <div
                  className="bg-[#5B8DBE] h-1.5 rounded-full transition-all duration-[5000ms] ease-linear"
                  style={{ width: '0%', animation: 'shrink 5s linear forwards' }}
                />
              </div>
            </div>
          </div>
        ) : (
          // Input phase
          <div className="mb-8">
            <p className="text-lg text-gray-500 mb-4">
              Spell the word!
              <span className="ml-2 text-sm">
                ({3 - attempts} {3 - attempts === 1 ? 'try' : 'tries'} left)
              </span>
            </p>

            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="text-3xl text-center w-full py-3 px-4 bg-white rounded-xl border-2 border-[#E8E0D0] outline-none focus:border-[#5B8DBE] transition-colors"
              style={{
                fontFamily: "'Patrick Hand', cursive",
                color: '#4A4A4A',
              }}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              disabled={feedback !== null}
            />

            <button
              onClick={handleSubmit}
              disabled={feedback !== null || !userInput.trim()}
              className="mt-4 px-8 py-2 text-xl rounded-xl border-2 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
              style={{
                fontFamily: "'Patrick Hand', cursive",
                backgroundColor: '#5B8DBE',
                borderColor: '#3A6B9B',
                color: '#FFFFFF',
                boxShadow: '2px 2px 0px #3A6B9B',
              }}
            >
              Check!
            </button>
          </div>
        )}

        {/* Feedback */}
        {feedback === 'correct' && (
          <div
            className="text-3xl animate-bounce"
            style={{ color: '#7EBD73' }}
          >
            Correct!
          </div>
        )}
        {feedback === 'wrong' && (
          <div style={{ color: '#E8829B' }}>
            <p className="text-2xl">
              {attempts >= 3 ? "Oh no! Let's try again!" : 'Not quite... try again!'}
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
}
