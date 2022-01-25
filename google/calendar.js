const {google} = require('googleapis');
const {first_day_of_week, first_day_of_next_week} = require('./../time_utils');

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
}

function get_events_from_week(date, jwt_client = default_jwt_client) {
  return new Promise((resolve, reject) => {
      calendar.events.list({
        auth: jwt_client.client,
        calendarId: process.env.PERSONAL_CALENDAR_ID,
        singleEvents: true,
        timeMin: first_day_of_week(date).toISOString(),
        timeMax: first_day_of_next_week(date).toISOString(),
        orderBy: "startTime"
      }, (err, res) => err ? reject(err) : resolve(res.data.items));
    }
  );
}

module.exports = {
  init: init,
  get_events_from_week
};