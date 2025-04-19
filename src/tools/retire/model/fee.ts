import { NumberRange } from './util';

export type Fee = {
  id: number
  name: string;
  startValue: number; // month value
  comment: string;
  yearIncrease: number; // month value
  yearIncreaseRatio: number;
  yearRange: NumberRange;
  ageRange: NumberRange;
  valueRange: NumberRange;
  income: boolean
  work: boolean
}

let idCounter = 0;

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
      income = false,
      work = false,
    }: Partial<Fee> & Pick<Fee, 'name' | 'startValue'>,
  ): Fee => {
    idCounter += 1;
    return {
      id: idCounter,
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