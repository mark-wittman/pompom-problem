import { MathProblem } from '@/types';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function makeChoices(correct: number): number[] {
  const choices = new Set<number>([correct]);
  // Generate 3 wrong answers near the correct answer
  while (choices.size < 4) {
    const offset = randInt(1, 10) * (Math.random() < 0.5 ? -1 : 1);
    const wrong = correct + offset;
    if (wrong >= 0 && wrong !== correct) {
      choices.add(wrong);
    }
  }
  return shuffle([...choices]);
}

type ProblemGenerator = () => MathProblem;

const generators: ProblemGenerator[] = [
  // Addition within 100
  () => {
    const a = randInt(10, 60);
    const b = randInt(5, 40);
    const answer = a + b;
    return { question: `${a} + ${b} = ?`, answer, choices: makeChoices(answer) };
  },

  // Subtraction within 100
  () => {
    const a = randInt(30, 99);
    const b = randInt(5, a - 1);
    const answer = a - b;
    return { question: `${a} - ${b} = ?`, answer, choices: makeChoices(answer) };
  },

  // Multiplication by 2, 3, 4, 5
  () => {
    const multiplier = [2, 3, 4, 5][randInt(0, 3)];
    const a = randInt(2, 12);
    const answer = a * multiplier;
    return { question: `${a} x ${multiplier} = ?`, answer, choices: makeChoices(answer) };
  },

  // Word problems
  () => {
    const templates = [
      () => {
        const total = randInt(10, 30);
        const gave = randInt(1, total - 1);
        const answer = total - gave;
        return {
          question: `Sam has ${total} apples. He gives away ${gave}. How many are left?`,
          answer,
          choices: makeChoices(answer),
        };
      },
      () => {
        const a = randInt(5, 20);
        const b = randInt(5, 20);
        const answer = a + b;
        return {
          question: `Mia found ${a} shells. Then she found ${b} more. How many shells total?`,
          answer,
          choices: makeChoices(answer),
        };
      },
      () => {
        const groups = randInt(2, 5);
        const per = randInt(2, 6);
        const answer = groups * per;
        return {
          question: `There are ${groups} bags with ${per} cookies each. How many cookies in all?`,
          answer,
          choices: makeChoices(answer),
        };
      },
      () => {
        const total = randInt(10, 24);
        const groups = [2, 3, 4][randInt(0, 2)];
        const leftover = total % groups;
        const each = Math.floor(total / groups);
        const cleanTotal = each * groups;
        const answer = each;
        return {
          question: `${cleanTotal} stickers shared equally among ${groups} friends. How many does each get?`,
          answer,
          choices: makeChoices(answer),
        };
      },
      () => {
        const had = randInt(20, 50);
        const spent = randInt(5, had - 5);
        const answer = had - spent;
        return {
          question: `Leo had $${had}. He spent $${spent} on a toy. How much money is left?`,
          answer,
          choices: makeChoices(answer),
        };
      },
    ];
    return templates[randInt(0, templates.length - 1)]();
  },
];

export function getRandomMathProblem(): MathProblem {
  const gen = generators[randInt(0, generators.length - 1)];
  return gen();
}
