import random from 'random';

export function diceNumberToArray(count: number, dice: number): number[] {
  const res: number[] = [];
  for (let i = 0; i < count; i++) {
    res.push(dice % 6);
    dice = Math.floor(dice / 6);
  }
  return res;
}

/**
 * @param count
 * @param factor 0 means random, 1 means absolute fair
 */
export function createFairRandomContext(count: number, factor: number) {
  factor = 1 - Math.sqrt(Math.min(1, Math.max(factor, 0)));

  let possibilities = Array(count).fill(1);

  return {
    next(): number {
      const totalPossibility = possibilities.reduce((a, b) => a + b);
      const randPossibility = random.float(0, totalPossibility);

      let res = 0;
      let sum = 0;
      for (let i = 0; i < possibilities.length; i++) {
        sum += possibilities[i];
        if (sum > randPossibility) {
          res = i;
          break;
        }
      }
      possibilities[res] *= factor;

      const newTotalPossibility = possibilities.reduce((a, b) => a + b);
      if (newTotalPossibility === 0) {
        possibilities.fill(1);
      } else if (newTotalPossibility < count * 0.01) {
        possibilities = possibilities.map(e => e * 2);
      }
      return res;
    },
  };
}