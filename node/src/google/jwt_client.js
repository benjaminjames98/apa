const {google} = require('googleapis');
let creds = require("./google_creds_apa-integration.json");

let jwt_client = new google.auth.JWT(
  creds.client_email,
  null,
  creds.private_key,
  ['https://www.googleapis.com/auth/calendar']
);

Object.defineProperty(module.exports, "client", {
  get: () => jwt_client
});