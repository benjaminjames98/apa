let categories = [{
  name: "Antioch Initiative",
  google_color_id: 3,
  target_hours: 5
}, {
  name: "BJITS",
  google_color_id: 10,
  target_hours: 15
}, {
  name: "St David's",
  google_color_id: 6,
  target_hours: 12
}, {
  name: "Study",
  google_color_id: 11,
  target_hours: 8
}, {
  name: "Uncategorised",
  google_color_id: -1,
  target_hours: 0
}];

const {hours_between} = require('./time_utils');

function generate_events_obj() {
  let raw_events;
  let stored_events;
  let category_info;

// Completely refreshes the events object
  function load_events(events) {
    raw_events = events.slice();
    stored_events = parse_calendar_events(events);
    category_info = get_category_info(stored_events);
    return true;
  }

// Accepts array of events directly from Google Calendar
  function parse_calendar_events(events) {
    events = events.filter(e => e["start"]['dateTime']);
    return events.map(e => {
      return {
        'summary': e["summary"],
        'start_time': e["start"]['dateTime'] || '',
        'duration': hours_between(
          new Date(e["start"]['dateTime']),
          new Date(e["end"]['dateTime'])
        ),
        'category': get_event_category_from_color(e['colorId'] || '0')
      };
    });
  }

  function get_event_category_from_color(color_id) {
    let category = categories.find(
      cat => cat['google_color_id'].toString() === color_id.toString()
    );
    return category ? category['name'] : 'Uncategorised';
  }

  function get_category_info(events) {
    let category_info = {};
    categories.forEach(
      c => category_info[c['name']] = {
        name: c['name'], target_hours: c['target_hours'], actual_hours: 0
      });
    events.forEach(
      e => category_info[e['category']]['actual_hours'] += e['duration']
    );
    return category_info;
  }

  let result = {load_events};

  Object.defineProperty(result, "raw_events", {
    get: () => raw_events
  });
  Object.defineProperty(result, "stored_events", {
    get: () => stored_events
  });
  Object.defineProperty(result, "category_info", {
    get: () => category_info
  });

  return result;
}

module.exports = generate_events_obj