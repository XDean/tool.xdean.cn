import { NumberRange } from './util';

export type Fee = {
  name: string;
  startValue: number;
  comment: string;
  yearIncrease: number;
  yearIncreaseRatio: number;
  yearRange: NumberRange;
  ageRange: NumberRange;
  valueRange: NumberRange;
  income: boolean
  work?: boolean; // undefined means not related to work
}

export const Fee = {
  create: (
    {
      name,
      startValue,
      comment = '',
      yearIncrease = 0,
      yearIncreaseRatio = 0,
      yearRange = [null, null],
      ageRange = [null, null],
      valueRange = [null, null],
      income,
      work,
    }: Partial<Fee> & Pick<Fee, 'name' | 'startValue' | 'income'>,
  ): Fee => {
    return {
      name,
      startValue,
      comment,
      yearIncrease,
      yearIncreaseRatio,
      yearRange,
      ageRange,
      valueRange,
      income,
      work,
    };
  },
  matchAge(fee: Fee, age: number) {
    return NumberRange.match(fee.ageRange, age);
  },
  matchYear(fee: Fee, year: number) {
    return NumberRange.match(fee.yearRange, year);
  },
};