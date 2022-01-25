const dotenv = require("dotenv");
dotenv.config();

const {
  first_day_of_week,
  first_day_of_next_week,
  hours_between
} = require('./time_utils');

const {google} = require('googleapis');
let creds = require("./google_creds_apa-integration.json");
let jwt_client = new google.auth.JWT(
  creds.client_email,
  null,
  creds.private_key,
  ['https://www.googleapis.com/auth/calendar']
);
let calendar;

function init_calendar() {
  return new Promise(((resolve, reject) => {
    jwt_client.authorize(
      (err) => {
        if (err) reject(err);
        calendar = google.calendar('v3');
        resolve("Successfully connected!");
      });
  }));
}

function get_events_from_week(date) {
  return new Promise((resolve, reject) => {
      calendar.events.list({
        auth: jwt_client,
        calendarId: process.env.GOOGLE_CALENDAR_ID,
        singleEvents: true,
        timeMin: first_day_of_week(date).toISOString(),
        timeMax: first_day_of_next_week(date).toISOString(),
        orderBy: "startTime"
      }, (err, res) => err ? reject(err) : resolve(res.data.items));
    }
  );
}

let categories = [{
  name: "Antioch Initiative",
  google_color_id: 3,
  target_hours: 6
}, {
  name: "BJITS",
  google_color_id: 10,
  target_hours: 15
}, {
  name: "St David's",
  google_color_id: 6,
  target_hours: 11
}, {
  name: "Study",
  google_color_id: 11,
  target_hours: 8
}];

function parse_events(events) {
  events = events.filter(e => e["start"]['dateTime']);
  return events.map(e => {
    return {
      'summary': e["summary"],
      'start_time': e["start"]['dateTime'] || '',
      'duration': hours_between(
        new Date(e["start"]['dateTime']),
        new Date(e["end"]['dateTime'])
      ),
      'category': get_event_category(e['colorId'] || '0')
    };
  });
}

function get_event_category(colorId) {
  let category = categories.find(
    cat => cat['google_color_id'].toString() === colorId.toString()
  );
  return category ? category['name'] : 'uncategorised';
}

function sum_group_durations(events) {
  return events.reduce((obj, e) => {
    if (!obj[e['category']]) obj[e['category']] = 0;
    obj[e['category']] += e['duration'];
    return obj;
  }, {});
  return {group_info, groups};
}

module.exports = {
  init_calendar: init_calendar,
  get_events_from_week: get_events_from_week,
  parse_events: parse_events,
  sum_group_durations: sum_group_durations,
};