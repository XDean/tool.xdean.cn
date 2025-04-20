import { Fee, FeeType } from './fee';
import { NumberRange } from './util';
import { FeeTypeOptions } from '../util/constants';

export type YearRes = {
  year: number
  age: number

  fees: (number | null)[] // per month

  startBalance: number
  endBalance: number

  work: number
  income: number
  expense: number
  interest: number
  total: number

  nowNeed: number
};

export type RetireRes = {
  years: YearRes[]
  total: {
    fees: number[]
    expense: number
    work: number
    income: number
    interest: number
  }
  endValue: number
  minRetireAge: number
}

export type RetireInput = {
  fees: Fee[]
  balance: number
  nowAge: number
  retireAge: number
  endAge: number
  interestRate: number
}

export const Retire = {
  defaultInput: (): RetireInput => {
    return {
      fees: [
        Fee.create({name: '房租水电', startValue: 1500}),
        Fee.create({name: '吃吃喝喝', startValue: 1500}),
        Fee.create({name: '服装日用', startValue: 500}),
        Fee.create({name: '社保', startValue: 1000, ageRange: [null, 60]}),
        Fee.create({
          name: '工作',
          startValue: 5000,
          yearIncreaseRatio: 0.03,
          ageRange: [null, 60],
          valueRange: [null, 10000],
          type: 'work',
        }),
        Fee.create({
          name: '养老金',
          startValue: 2000,
          yearIncrease: 100,
          ageRange: [61, null],
          type: 'income',
        }),
      ],
      balance: 50000,
      nowAge: 25,
      endAge: 80,
      retireAge: 60,
      interestRate: 0.02,
    };
  },
  calc: (input: RetireInput): RetireRes => {
    const years: YearRes[] = [];
    for (let i = 0; i < input.endAge - input.nowAge; i++) {
      const age = input.nowAge + i;
      const lastYear = years.at(-1);
      const stillWork = age <= input.retireAge;
      const fees = input.fees.map((e, i) => {
        if ((e.type === 'work' && !stillWork) || !Fee.matchAge(e, age)) {
          return null;
        }
        const lastValue = lastYear?.fees[i] ?? null;
        if (lastValue === null) {
          return e.startValue * 12;
        } else {
          return NumberRange.to(
            e.valueRange.map(e => e === null ? null : e * 12) as NumberRange,
            lastValue * (1 + e.yearIncreaseRatio) + e.yearIncrease * 12,
          );
        }
      });
      const work = fees
        .filter((e, i): e is number => e === null ? false : input.fees[i].type === 'work')
        .reduce((a, b) => a + b ?? 0, 0);
      const income = fees
        .filter((e, i): e is number => e === null ? false : input.fees[i].type === 'income')
        .reduce((a, b) => a + b ?? 0, 0);
      const expense = fees
        .filter((e, i): e is number => e === null ? false : input.fees[i].type === 'expense')
        .reduce((a, b) => a + b ?? 0, 0);

      const startBalance = lastYear?.endBalance ?? input.balance;
      const interest = startBalance * input.interestRate;
      const total = work + income + interest - expense;
      const endBalance = startBalance + total;
      years.push({
        fees,
        year: i,
        age,
        startBalance,
        endBalance,
        interest,
        work,
        income,
        total,
        expense,
        nowNeed: 0,
      });
    }
    const lastYear = years.at(-1)!;
    lastYear.nowNeed = Math.max(0, lastYear.expense - lastYear.income);
    for (let i = years.length - 2; i >= 0; i--) {
      years[i].nowNeed = Math.max(0, years[i].expense - years[i].income) + years[i + 1].nowNeed / (1 + input.interestRate);
    }
    return {
      years,
      total: {
        fees: input.fees.map((_, i) => years.map((y) => {
          const f = y.fees[i];
          return f === null ? 0 : f;
        }).reduce((a, b) => a + b, 0)),
        expense: years.reduce((a, b) => a + b.expense, 0),
        work: years.reduce((a, b) => a + b.work, 0),
        income: years.reduce((a, b) => a + b.income, 0),
        interest: years.reduce((a, b) => a + b.interest, 0),
      },
      endValue: lastYear.endBalance,
      minRetireAge: years.find(e => e.age <= input.retireAge && e.nowNeed <= e.startBalance)?.age ?? -1,
    };
  },
  nextName: (input: RetireInput, type: FeeType): string => {
    return FeeTypeOptions[type].names.find(e => input.fees.every(f => f.name !== e)) ?? '';
  },
};
