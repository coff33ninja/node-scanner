import { sum } from '../src/utils/someUtilityFile'; // Adjust the import based on your utility file location

describe('Sample Test', () => {
  it('should return the sum of two numbers', () => {
    expect(sum(1, 2)).toBe(3);
  });
});
