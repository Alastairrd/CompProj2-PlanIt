const { calculateDates } = require('../scripts/calculateDates.js');

describe('calculateDates', () => 
{
  test('correctly calculates date range', () => 
  {
    const startDate = new Date('2024-03-01');
    const endDate = new Date('2024-03-03');
    const expectedDates = [
      { date: '1', dayOfWeek: 'FRI' },
      { date: '2', dayOfWeek: 'SAT' },
      { date: '3', dayOfWeek: 'SUN' },
    ];

    const dates = calculateDates(startDate, endDate);

    expect(dates).toEqual(expectedDates);
  });

  
});