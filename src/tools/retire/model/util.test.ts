import { NumberRange } from './util';

describe('NumberRange', () => {
  describe('match', () => {
    it('should return false if value is less than the lower bound', () => {
      expect(NumberRange.match([1, 10], 0)).toBe(false);
    });

    it('should return false if value is greater than the upper bound', () => {
      expect(NumberRange.match([1, 10], 11)).toBe(false);
    });

    it('should return true if value is within the range', () => {
      expect(NumberRange.match([1, 10], 5)).toBe(true);
    });

    it('should return true if both bounds are null', () => {
      expect(NumberRange.match([null, null], 5)).toBe(true);
    });

    it('should return true if only lower bound is specified and value is equal to it', () => {
      expect(NumberRange.match([1, null], 1)).toBe(true);
    });

    it('should return true if only upper bound is specified and value is equal to it', () => {
      expect(NumberRange.match([null, 10], 10)).toBe(true);
    });
  });

  describe('to', () => {
    it('should return the upper bound if value is greater than it', () => {
      expect(NumberRange.to([1, 10], 11)).toBe(10);
    });

    it('should return the lower bound if value is less than it', () => {
      expect(NumberRange.to([1, 10], 0)).toBe(1);
    });

    it('should return the value if it is within the range', () => {
      expect(NumberRange.to([1, 10], 5)).toBe(5);
    });

    it('should return the value if both bounds are null', () => {
      expect(NumberRange.to([null, null], 5)).toBe(5);
    });

    it('should return the value if only lower bound is specified and value is equal to it', () => {
      expect(NumberRange.to([1, null], 1)).toBe(1);
    });

    it('should return the value if only upper bound is specified and value is equal to it', () => {
      expect(NumberRange.to([null, 10], 10)).toBe(10);
    });
  });
});
