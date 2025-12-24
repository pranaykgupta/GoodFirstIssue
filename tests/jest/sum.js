function daysBetweenDates(date1, date2) {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round((date2 - date1) / oneDay);
}

module.exports = daysBetweenDates;

function sum(a, b) {
  return a + b;
}
module.exports = sum;


