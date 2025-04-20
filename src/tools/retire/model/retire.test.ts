import { Retire, RetireInput, RetireRes } from './retire';

describe('Retire.calc', () => {
  it('should calculate correct financial status for each year', () => {
    const input: RetireInput = Retire.defaultInput();

    const result: RetireRes = Retire.calc(input);

    expect(result.years.length).toBe(input.endAge - input.nowAge);
    expect(result.total.fees.length).toBe(input.fees.length);
    expect(result.endValue).toBeCloseTo(2926495.1);
    expect(result.minRetireAge).toBe(47);
    expect(result.total.expense).toBe(2742000);
    expect(result.total.work).toBe(3505588.2129208054);
    expect(result.total.income).toBe(661200);
    expect(result.total.interest).toBe(1451706.8884531718);
    expect(result.years[0].nowNeed).toBe(1468451.1022562585);
  });
});
