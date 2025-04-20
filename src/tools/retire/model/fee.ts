import { NumberRange } from './util';
import {v4 as uuid} from 'uuid';

export type FeeType = 'expense' | 'income' | 'work';
export type Fee = {
  id: string
  name: string;
  startValue: number; // month value
  comment: string;
  yearIncrease: number; // month value
  yearIncreaseRatio: number;
  ageRange: NumberRange;
  valueRange: NumberRange;
  type: FeeType
}

export const Fee = {
  create: (
    {
      id,
      name,
      startValue,
      comment = '',
      yearIncrease = 0,
      yearIncreaseRatio = 0,
      ageRange = [null, null],
      valueRange = [null, null],
      type = 'expense',
    }: Partial<Fee> & Pick<Fee, 'name' | 'startValue'>,
  ): Fee => {
    return {
      id: id ?? uuid(),
      name,
      startValue,
      comment,
      yearIncrease,
      yearIncreaseRatio,
      ageRange,
      valueRange,
      type,
    };
  },
  matchAge(fee: Fee, age: number) {
    return NumberRange.match(fee.ageRange, age);
  },
};