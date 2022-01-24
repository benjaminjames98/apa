let tz = '+11:00';

function first_day_of_week(date = new Date()) {
  let d = new Date(date.setDate(date.getDate() - date.getDay()));
  return new Date(`${d.toISOString().substr(0, 10)}T00:00:00${tz}`);
}

function first_day_of_next_week(date = new Date()) {
  let d = new Date(date.setDate(date.getDate() - date.getDay() + 7));
  return new Date(`${d.toISOString().substr(0, 10)}T00:00:00${tz}`);
}

// returns number of hours between start and end.
// Start and end should both be instances of Date.
function hours_between (start, end) {
  return (end - start) / (1000 * 60 * 60);
}

module.exports = {
  first_day_of_week: first_day_of_week,
  first_day_of_next_week: first_day_of_next_week,
  hours_between: hours_between
};