export type NumberRange = [number | null, number | null];

export const NumberRange = {
  match: (range: NumberRange, value: number): boolean => {
    if (range[0] !== null && value < range[0]) {
      return false;
    }
    if (range[1] !== null && value > range[1]) {
      return false;
    }
    return true;
  },
  to: (range: NumberRange, value: number): number => {
    if (range[1] !== null && value > range[1]) {
      return range[1];
    }
    if (range[0] !== null && value < range[0]) {
      return range[0];
    }
    return value;
  },
};