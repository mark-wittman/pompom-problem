'use client';

import { useState, useEffect, useCallback } from 'react';
import { useGameStore } from '@/state/gameStore';
import { getRandomMathProblem } from '@/level/MathProblems';
import { audioManager } from '@/audio/AudioManager';
import { MathProblem } from '@/types';

export default function MathChallenge() {
  const { setPhase, loseLife, lives, setRespawnMode } = useGameStore();

  const [problem, setProblem] = useState<MathProblem | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    setProblem(getRandomMathProblem());
  }, []);

  const handleChoice = useCallback(
    (choice: number) => {
      if (feedback !== null || !problem) return;

      setSelected(choice);

      if (choice === problem.answer) {
        setFeedback('correct');
        audioManager.playSfx('correct');
        setTimeout(() => {
          setRespawnMode('platform');
          setPhase('playing');
        }, 1200);
      } else {
        setFeedback('wrong');
        audioManager.playSfx('wrong');
        loseLife();
        const remainingLives = lives - 1;
        setTimeout(() => {
          if (remainingLives > 0) {
            setRespawnMode('bottom');
            setPhase('playing');
          } else {
            setPhase('gameover');
          }
        }, 1200);
      }
    },
    [feedback, problem, setPhase, loseLife, lives, setRespawnMode]
  );

  if (!problem) return null;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-[#FDF6E3]/95">
      <div
        className="text-center max-w-sm px-6 w-full"
        style={{ fontFamily: "'Patrick Hand', cursive" }}
      >
        <h2 className="text-3xl mb-2" style={{ color: '#4A4A4A' }}>
          Math Challenge!
        </h2>
        <p className="text-sm mb-6" style={{ color: '#9B9B9B' }}>
          Answer correctly to keep climbing
        </p>

        {/* Question */}
        <div
          className="text-xl leading-relaxed py-4 px-5 bg-white rounded-xl border-2 border-[#E8E0D0] mb-6"
          style={{ color: '#4A4A4A' }}
        >
          {problem.question}
        </div>

        {/* Choices */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {problem.choices.map((choice, i) => {
            const isSelected = selected === choice;
            const isCorrect = choice === problem.answer;
            let bg = '#FFFFFF';
            let border = '#E8E0D0';
            let textColor = '#4A4A4A';

            if (feedback !== null) {
              if (isCorrect) {
                bg = '#7EBD73';
                border = '#5C9B51';
                textColor = '#FFFFFF';
              } else if (isSelected && !isCorrect) {
                bg = '#E8829B';
                border = '#C4607A';
                textColor = '#FFFFFF';
              }
            }

            return (
              <button
                key={i}
                onClick={() => handleChoice(choice)}
                disabled={feedback !== null}
                className="py-3 px-4 text-2xl rounded-xl border-2 transition-all hover:scale-105 active:scale-95 disabled:hover:scale-100 cursor-pointer disabled:cursor-default"
                style={{
                  fontFamily: "'Patrick Hand', cursive",
                  backgroundColor: bg,
                  borderColor: border,
                  color: textColor,
                  boxShadow: feedback === null ? '2px 2px 0px #E8E0D0' : 'none',
                }}
              >
                {choice}
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {feedback === 'correct' && (
          <div className="text-2xl animate-bounce" style={{ color: '#7EBD73' }}>
            Correct!
          </div>
        )}
        {feedback === 'wrong' && (
          <div style={{ color: '#E8829B' }}>
            <p className="text-2xl">
              {lives - 1 > 0
                ? `Not quite! The answer was ${problem.answer}`
                : 'Oh no! No lives left!'}
            </p>
          </div>
        )}

        {/* Lives indicator */}
        <div className="mt-4 text-lg" style={{ color: '#E8829B' }}>
          {Array.from({ length: 3 }, (_, i) => (
            <span key={i} className="mx-0.5">
              {i < lives ? '♥' : '♡'}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
