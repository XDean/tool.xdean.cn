import { Fee } from './fee';

describe('Fee', () => {
  describe('create', () => {
    it('should create a Fee object with all required and optional properties', () => {
      const fee = Fee.create({
        id:'id',
        name: 'Test Fee',
        startValue: 100,
        comment: 'Test comment',
        yearIncrease: 5,
        yearIncreaseRatio: 0.1,
        ageRange: [18, 65],
        valueRange: [1000, 5000],
        type: 'income',
      });

      expect(fee).toEqual({
        id:'id',
        name: 'Test Fee',
        startValue: 100,
        comment: 'Test comment',
        yearIncrease: 5,
        yearIncreaseRatio: 0.1,
        ageRange: [18, 65],
        valueRange: [1000, 5000],
        type: 'income',
      });
    });

    it('should create a Fee object with only required properties', () => {
      const fee = Fee.create({
        id: 'id',
        name: 'Test Fee',
        startValue: 100,
      });

      expect(fee).toEqual({
        id: 'id',
        name: 'Test Fee',
        startValue: 100,
        comment: '',
        yearIncrease: 0,
        yearIncreaseRatio: 0,
        ageRange: [null, null],
        valueRange: [null, null],
        type: 'expense',
      });
    });

    it('should create a Fee object with some optional properties', () => {
      const fee = Fee.create({
        id:'id',
        name: 'Test Fee',
        startValue: 100,
        yearIncrease: 5,
        ageRange: [18, 65],
      });

      expect(fee).toEqual({
        id:'id',
        name: 'Test Fee',
        startValue: 100,
        comment: '',
        yearIncrease: 5,
        yearIncreaseRatio: 0,
        ageRange: [18, 65],
        valueRange: [null, null],
        type: 'expense',
      });
    });
  });

  describe('matchAge', () => {
    it('should return true if age is within the range', () => {
      const fee = Fee.create({
        name: 'Test Fee',
        startValue: 100,
        ageRange: [18, 65],
      });

      expect(Fee.matchAge(fee, 30)).toBe(true);
    });

    it('should return false if age is not within the range', () => {
      const fee = Fee.create({
        name: 'Test Fee',
        startValue: 100,
        ageRange: [18, 65],
      });

      expect(Fee.matchAge(fee, 17)).toBe(false);
      expect(Fee.matchAge(fee, 66)).toBe(false);
    });

    it('should return true if age range is [null, null]', () => {
      const fee = Fee.create({
        name: 'Test Fee',
        startValue: 100,
        ageRange: [null, null],
      });

      expect(Fee.matchAge(fee, 30)).toBe(true);
    });
  });
});
