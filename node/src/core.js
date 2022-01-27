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
const calendar = require('./google/calendar');
const jwt_client = require('./google/jwt_client');

app.get('/node/', async (request, result) => {
  let promises = [];
  for (let i = 0; i < 3; i++) {
    let promise = new Promise(async resolve => {
      let events = event_generator();
      events.load_events(await calendar.get_events_from_week(i));
      resolve(events.category_info);
    });
    promises.push(promise);
  }

  let res = [];
  for (let category_info of promises)
    res.push(await category_info);

  result.json(res);
});

calendar.init(jwt_client)
  .then(start_http_server);

function start_http_server() {
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
}




