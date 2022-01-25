const http = require("http");
const dotenv = require("dotenv");
dotenv.config();

//const notion = require('./notion');
const events = require('./events');
const events1 = require('./events');
const calendar = require('./google/calendar');
const jwt_client = require('./google/jwt_client');


calendar.init(jwt_client)
  .then(start_http_server);

function start_http_server() {
  http.createServer(http_request_listener).listen(8080);
}

function http_request_listener(request, result) {
  // TODO Allow functions based on input (i.e. get events pre-parsing or pre-duration_summing)

  calendar.get_events_from_week(new Date())
    .then(events.load_events)
    .then(() => return_http_result(result, events.category_info))
    .catch(e => return_http_result(result, e));

  // notion.get_pages_from_week(process.env.NOTION_DATABASE_ID)
  //   .then(r => return_http_result(result, r))
  //   .catch(e => return_http_result(result, e));

}

function return_http_result(result, obj) {
  result.writeHead(200, {'Content-Type': 'application/json'});
  result.write(JSON.stringify(obj));
  result.end();
}


