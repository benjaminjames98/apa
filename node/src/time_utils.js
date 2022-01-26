let tz = '+11:00';

function first_day_of_week(offset = 0, date = new Date()) {
  let d = new Date(date.setDate(date.getDate() - date.getDay() + (7 * offset)));
  return new Date(`${d.toISOString().substr(0, 10)}T00:00:00${tz}`);
}

// returns number of hours between start and end.
// Start and end should both be instances of Date.
function hours_between(start, end) {
  return (end - start) / (1000 * 60 * 60);
}

module.exports = {
  first_day_of_week: first_day_of_week,
  hours_between: hours_between
};