const dotenv = require("dotenv");
dotenv.config();

const express = require('express');
const cors = require('cors');
const app = express();
const port = 8080;
app.use(cors());

//const notion = require('./notion');
const events = require('./events');
const events1 = require('./events');
const calendar = require('./google/calendar');
const jwt_client = require('./google/jwt_client');

app.get('/node/', (request, result) => {
  calendar.get_events_from_this_week()
    .then(events.load_events)
    .then(() => result.json(events.category_info))
    .catch(e => result.json(e));
});

calendar.init(jwt_client)
  .then(start_http_server);

function start_http_server() {
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
}




