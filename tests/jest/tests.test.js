
const { daysBetweenDates } = require('../../fetchdata.js');

test('Calculate days between dates', () => {
    const d1 = new Date('2026-03-11')
    const d2 = new Date('2026-03-15')
    const monthLimit = 2;
    expect(daysBetweenDates(d1, d2)).toBe(4);
    daysBetweenDates(d1, d2, monthLimit);
});









