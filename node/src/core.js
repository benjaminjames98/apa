const dotenv = require("dotenv");
dotenv.config();

// TODO add ability to sum hours worked on an invoice

const express = require('express');
const cors = require('cors');
const app = express();
const port = 8080;
app.use(cors());

//const notion = require('./notion');
const event_generator = require('./events');
const events = [
  event_generator(),
  event_generator(),
  event_generator(),
  event_generator()
];
const calendar = require('./google/calendar');
const jwt_client = require('./google/jwt_client');

app.get('/node/', async (request, result) => {
  events[0].load_events(await calendar.get_events_from_week(0));
  events[1].load_events(await calendar.get_events_from_week(1));
  events[2].load_events(await calendar.get_events_from_week(2));
  events[3].load_events(await calendar.get_events_from_week(3));

  result.json(events.map(e => e.category_info));
});

calendar.init(jwt_client)
  .then(start_http_server);

function start_http_server() {
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
}




