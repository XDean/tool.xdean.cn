import { Fee } from './fee';
import { NumberRange } from './util';

export type YearRes = {
  year: number
  age: number

  fees: (number | null)[] // per month

  startBalance: number
  endBalance: number

  workIncome: number
  otherIncome: number
  income: number

  workExpense: number
  otherExpense: number
  expense: number

  workTotal: number
  otherTotal: number
  interest: number
  total: number

  nowNeed: number
};

export type RetireRes = {
  years: YearRes[]
  total: {
    fees: number[]
    expense: number
    workIncome: number
    otherIncome: number
    income: number // not include interest
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
        Fee.create({name: '房租水电', startValue: 1000}),
        Fee.create({name: '吃吃喝喝', startValue: 1500}),
        Fee.create({name: '服装日用', startValue: 300}),
        Fee.create({name: '社保', startValue: 1000, ageRange: [null, 65]}),
        Fee.create({
          name: '工作',
          startValue: 5000,
          yearIncreaseRatio: 0.03,
          ageRange: [null, 65],
          valueRange: [null, 30000],
          work: true,
          income: true,
        }),
        Fee.create({
          name: '养老金',
          startValue: 3000,
          yearIncrease: 100,
          ageRange: [65, null],
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
        if ((e.work && !stillWork) || !Fee.matchAge(e, age) || !Fee.matchYear(e, year)) {
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
      const workIncome = fees
        .filter((e, i): e is number => e === null ? false : (input.fees[i].income && input.fees[i].work))
        .reduce((a, b) => a + b ?? 0, 0);
      const otherIncome = fees
        .filter((e, i): e is number => e === null ? false : (input.fees[i].income && !input.fees[i].work))
        .reduce((a, b) => a + b ?? 0, 0);
      const income = workIncome + otherIncome;

      const workExpense = fees
        .filter((e, i): e is number => e === null ? false : (!input.fees[i].income && input.fees[i].work))
        .reduce((a, b) => a + b ?? 0, 0);
      const otherExpense = fees
        .filter((e, i): e is number => e === null ? false : (!input.fees[i].income && !input.fees[i].work))
        .reduce((a, b) => a + b ?? 0, 0);
      const expense = workExpense + otherExpense;

      const workTotal = workIncome - workExpense;
      const otherTotal = otherIncome - otherExpense;

      const startBalance = lastYear?.endBalance ?? input.balance;
      const interest = startBalance * input.interestRate;
      const total = income + interest - expense;
      const endBalance = startBalance + total;
      years.push({
        fees,
        year,
        age,
        startBalance,
        endBalance,
        interest,
        workExpense,
        otherExpense,
        workIncome,
        otherIncome,
        workTotal,
        otherTotal,
        total,
        income,
        expense,
        nowNeed: 0,
      });
    }
    const lastYear = years.at(-1)!;
    lastYear.nowNeed = Math.max(0, lastYear.expense - lastYear.otherIncome);
    for (let i = years.length - 2; i >= 0; i--) {
      years[i].nowNeed = Math.max(0, years[i].expense - years[i].otherIncome) + years[i + 1].nowNeed / (1 + input.interestRate);
    }
    return {
      years,
      total: {
        fees: input.fees.map((_, i) => years.map((y) => {
          const f = y.fees[i];
          return f === null ? 0 : f;
        }).reduce((a, b) => a + b, 0)),
        expense: years.reduce((a, b) => a + b.expense, 0),
        workIncome: years.reduce((a, b) => a + b.workIncome, 0),
        otherIncome: years.reduce((a, b) => a + b.otherIncome, 0),
        income: years.reduce((a, b) => a + b.income, 0),
        interest: years.reduce((a, b) => a + b.interest, 0),
      },
      endValue: lastYear.endBalance,
      minRetireAge: years.find(e => e.nowNeed <= e.startBalance)?.age ?? -1,
    };
  },
};
