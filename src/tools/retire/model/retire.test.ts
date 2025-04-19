import { Retire, RetireInput, RetireRes } from './retire';
import { Fee } from './fee';

describe('Retire.calc', () => {
  it('should calculate correct financial status for each year', () => {
    const input: RetireInput = {
      fees: [
        Fee.create({ name: '房租水电', startValue: 1500 }),
        Fee.create({ name: '吃吃喝喝', startValue: 1500 }),
        Fee.create({ name: '服装日用', startValue: 500 }),
        Fee.create({ name: '社保', startValue: 1000, ageRange: [null, 60] }),
        Fee.create({
          name: '工作',
          startValue: 5000,
          yearIncreaseRatio: 0.03,
          ageRange: [null, 60],
          valueRange: [null, 10000],
          work: true,
          income: true,
        }),
        Fee.create({
          name: '养老金',
          startValue: 2000,
          yearIncrease: 100,
          ageRange: [61, null],
          income: true,
        }),
      ],
      balance: 50000,
      nowYear: 2025,
      nowAge: 25,
      endAge: 80,
      retireAge: 60,
      interestRate: 0.02,
    };

    const result: RetireRes = Retire.calc(input);

    expect(result.years.length).toBe(input.endAge - input.nowAge);
    expect(result.total.fees.length).toBe(input.fees.length);
    expect(result.endValue).toBeCloseTo(2926495.1);
    expect(result.minRetireAge).toBe(47);
    expect(result.total.expense).toBe(2742000);
    expect(result.total.workIncome).toBe(3505588.2129208054);
    expect(result.total.income).toBe(4166788.2129208054);
    expect(result.total.interest).toBe(1451706.8884531718);
  });
});
