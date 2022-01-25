const {google} = require('googleapis');
let creds = require("./../google_creds_apa-integration.json");

let jwt_client = new google.auth.JWT(
  creds.client_email,
  null,
  creds.private_key,
  ['https://www.googleapis.com/auth/calendar']
);

module.exports ={
  client: jwt_client,
}