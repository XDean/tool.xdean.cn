import { Fee } from './fee';
import { NumberRange } from './util';

export type YearRes = {
  year: number
  age: number
  fees: (number | null)[]
  startBalance: number
  endBalance: number
  interest: number
  nowNeed: number
};

export type RetireRes = {
  years: YearRes[]
  total: {
    fees: number[]
    expense: number
    income: number
    interest: number
  }
  endValue: number
  minRetireAge: number
}

export type RetireInput = {
  fees: Fee[]
  balance: number
  nowYear: number
  nowAge: number
  retireAge: number
  endAge: number
  interestRate: number
}

export const Retire = {
  defaultInput: (): RetireInput => {
    return {
      fees: [
        Fee.create({name: '房租', startValue: 1000, income: false}),
        Fee.create({name: '吃喝', startValue: 1500, income: false}),
        Fee.create({name: '日用', startValue: 200, income: false}),
        Fee.create({
          name: '社保',
          startValue: 1300,
          comment: '退休前灵活就业',
          ageRange: [null, 65],
          work: false,
          income: false,
        }),
        Fee.create({
          name: '工资',
          startValue: 5000,
          yearIncreaseRatio: 0.03,
          yearRange: [null, 65],
          valueRange: [null, 30000],
          work: true,
          income: true,
        }),
        Fee.create({
          name: '养老金',
          startValue: 3000,
          yearIncrease: 100,
          yearRange: [65, null],
          work: true,
          income: true,
        }),
      ],
      balance: 50000,
      nowYear: new Date().getFullYear(),
      nowAge: 20,
      endAge: 80,
      retireAge: 60,
      interestRate: 0.02,
    };
  },
  calc: (input: RetireInput): RetireRes => {
    const nowYear = new Date().getFullYear();
    const years: YearRes[] = [];
    for (let i = 0; i < input.endAge - input.nowAge; i++) {
      const age = input.nowAge + i;
      const year = nowYear + i;
      const lastYear = years.at(-1);
      const stillWork = age <= input.retireAge;
      const fees = input.fees.map((e, i) => {
        if ((e.work !== undefined && stillWork !== e.work) || !Fee.matchAge(e, age) || !Fee.matchYear(e, year)) {
          return null;
        }
        const lastValue = lastYear?.fees[i] ?? null;
        if (lastValue === null) {
          return e.startValue;
        } else {
          return NumberRange.to(e.valueRange, lastValue * (1 + e.yearIncreaseRatio) + e.yearIncrease);
        }
      });
      const feeTotal = fees
        .map((e, i) => e === null ? 0 : input.fees[i].income ? e : -e)
        .reduce((a, b) => a + b ?? 0, 0);
      const startBalance = lastYear?.endBalance ?? input.balance;
      const interest = startBalance * input.interestRate;
      const endBalance = startBalance + feeTotal + interest;
      years.push({
        fees,
        year,
        age,
        startBalance,
        endBalance,
        interest,
        nowNeed: 0,
      });
    }
    return {};
  },
};
