const { calcTaxes } = require('./taxCalculator.js');
const { readings } = require('../unit_tests/__mocks__/mockReadings.js');
describe('calcTaxes', () => {
  test('should return 0 if readings is undefined', () => {
    expect(calcTaxes(undefined, '05')).toBe(0);

  });

  test('should return 0 if readings.data is undefined', () => {
    expect(calcTaxes({}, '05')).toBe(0);
  });

  test('should calculate total correctly for indiferenciado waste in given month', () => {
    expect(calcTaxes(readings, '04')).toBeCloseTo(0.27, 2);
    expect(calcTaxes(readings, '05')).toBeCloseTo(0.13,2);
  });
});