const {google} = require('googleapis');
const {first_day_of_week} = require('../time_utils');

let calendar;
let default_jwt_client;

function init(jwt_client) {
  default_jwt_client = jwt_client;
  return new Promise(((resolve, reject) => {
    jwt_client.client.authorize(
      (err) => {
        if (err) reject(err);
        calendar = google.calendar('v3');
        resolve('Success');
      });
  }));
};

function get_events_from_this_week() {
  return get_events_between(first_day_of_week(0), first_day_of_week(1));
};

function get_events_from_week(offset) {
  return get_events_between(
    first_day_of_week(offset),
    first_day_of_week(offset + 1)
  );
};

function get_events_between(min, max, jwt_client = default_jwt_client) {
  return new Promise((resolve, reject) => {
      calendar.events.list({
        auth: jwt_client.client,
        calendarId: process.env.PERSONAL_CALENDAR_ID,
        singleEvents: true,
        timeMin: min.toISOString(),
        timeMax: max.toISOString(),
        orderBy: "startTime"
      }, (err, res) => {
        if (err) reject(err);
        resolve(res.data.items);
      });
    }
  );
}

module.exports = {init, get_events_from_this_week, get_events_from_week};