const http = require("http");
const dotenv = require("dotenv");
dotenv.config();

//const notion = require('./notion');
const calendar = require('./google_calendar');

calendar.init_calendar()
  .then(start_http_server);

function start_http_server() {
  http.createServer(http_request_listener).listen(8080);
}

function http_request_listener(request, result) {
  // TODO Allow functions based on input (i.e. get events pre-parsing or pre-duration_summing)

  calendar.get_events_from_week(new Date())
    .then(calendar.parse_events)
    .then(calendar.sum_group_durations)
    .then(r => return_http_result(result, r))
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


