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
    const offset = randInt(1, 5) * (Math.random() < 0.5 ? -1 : 1);
    const wrong = correct + offset;
    if (wrong >= 0 && wrong !== correct) {
      choices.add(wrong);
    }
  }
  return shuffle([...choices]);
}

type ProblemGenerator = () => MathProblem;

const generators: ProblemGenerator[] = [
  // Addition within 20
  () => {
    const a = randInt(3, 12);
    const b = randInt(3, 10);
    const answer = a + b;
    return { question: `${a} + ${b} = ?`, answer, choices: makeChoices(answer) };
  },

  // Subtraction within 20
  () => {
    const a = randInt(8, 20);
    const b = randInt(2, a - 2);
    const answer = a - b;
    return { question: `${a} - ${b} = ?`, answer, choices: makeChoices(answer) };
  },

  // Word problems (2nd grade - addition & subtraction within 20)
  () => {
    const templates = [
      () => {
        const total = randInt(10, 18);
        const gave = randInt(3, total - 2);
        const answer = total - gave;
        return {
          question: `Sam has ${total} apples. He gives away ${gave}. How many are left?`,
          answer,
          choices: makeChoices(answer),
        };
      },
      () => {
        const a = randInt(4, 10);
        const b = randInt(3, 8);
        const answer = a + b;
        return {
          question: `Mia found ${a} shells. Then she found ${b} more. How many shells total?`,
          answer,
          choices: makeChoices(answer),
        };
      },
      () => {
        const a = randInt(5, 12);
        const b = randInt(3, 8);
        const answer = a + b;
        return {
          question: `There are ${a} birds in a tree. ${b} more fly in. How many birds now?`,
          answer,
          choices: makeChoices(answer),
        };
      },
      () => {
        const total = randInt(10, 18);
        const ate = randInt(3, total - 2);
        const answer = total - ate;
        return {
          question: `Leo had ${total} grapes. He ate ${ate}. How many are left?`,
          answer,
          choices: makeChoices(answer),
        };
      },
      () => {
        const a = randInt(4, 10);
        const b = randInt(3, 8);
        const answer = a + b;
        return {
          question: `${a} dogs and ${b} cats are at the park. How many animals in all?`,
          answer,
          choices: makeChoices(answer),
        };
      },
      // Two-step word problem
      () => {
        const start = randInt(8, 14);
        const added = randInt(3, 6);
        const removed = randInt(2, 5);
        const answer = start + added - removed;
        return {
          question: `Emma has ${start} stickers. She gets ${added} more, then gives away ${removed}. How many does she have now?`,
          answer,
          choices: makeChoices(answer),
        };
      },
      // Comparing / "how many more" problem
      () => {
        const big = randInt(10, 18);
        const small = randInt(3, big - 3);
        const answer = big - small;
        return {
          question: `Jake has ${big} marbles and Lily has ${small}. How many more does Jake have?`,
          answer,
          choices: makeChoices(answer),
        };
      },
      // Equal groups (early multiplication concept)
      () => {
        const groups = randInt(2, 5);
        const perGroup = randInt(2, 5);
        const answer = groups * perGroup;
        return {
          question: `There are ${groups} bags with ${perGroup} oranges in each bag. How many oranges in all?`,
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
