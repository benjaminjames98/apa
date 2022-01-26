const dotenv = require("dotenv");
dotenv.config();

const {Client} = require("@notionhq/client");
const notion_client = new Client({auth: process.env.NOTION_API_KEY});
const database_id = process.env.NOTION_DATABASE_ID;

async function get_pages_from_week() {
  return notion_client.databases.query({
    database_id: database_id,
    filter: {
      or: [
        {
          property: 'Date',
          date: {on_or_before: "2022-01-23"}
        },
        {
          property: 'Date',
          date: {on_or_before: "2022-01-29"}
        }
      ]
    }
  });
}

module.exports = {get_pages_from_week};
