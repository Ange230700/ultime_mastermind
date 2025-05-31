// src/helpers/computeClues.ts
export interface Clues {
  wellPlacedColors: string[];
  misplacedColors: string[];
  notInCodeColors: string[];
}

/**
 * Given a guess (array of colors) and the secret code (array of colors),
 * returns which are well‐placed, which are merely misplaced, and which aren’t in code.
 */
export function computeClues(
  guessArray: string[],
  secretArray: string[],
): Clues {
  if (guessArray.length !== secretArray.length) {
    return {
      wellPlacedColors: [],
      misplacedColors: [],
      notInCodeColors: [...guessArray],
    };
  }

  const wellPlacedColors: string[] = [];
  const leftoverSecret: string[] = [];
  const leftoverGuess: string[] = [];

  // First pass: find well‐placed
  for (let i = 0; i < secretArray.length; i++) {
    if (guessArray[i] === secretArray[i]) {
      wellPlacedColors.push(guessArray[i]);
    } else {
      leftoverSecret.push(secretArray[i]);
      leftoverGuess.push(guessArray[i]);
    }
  }

  const misplacedColors: string[] = [];
  const notInCodeColors: string[] = [];

  leftoverGuess.forEach((color) => {
    const idx = leftoverSecret.indexOf(color);
    if (idx !== -1) {
      misplacedColors.push(color);
      // remove one instance of that color
      leftoverSecret.splice(idx, 1);
    } else {
      notInCodeColors.push(color);
    }
  });

  return { wellPlacedColors, misplacedColors, notInCodeColors };
}
