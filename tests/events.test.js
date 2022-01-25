const assert = require('assert');
const expect = require('expect.js')

const {raw_events, stored_events, category_info} = require('./events.test.data');
const events = require('../events');
events.load_events(raw_events);

describe('Event Parsing Test', () => {
  it('should store raw data', () => {
    expect(events.raw_events).to.eql(raw_events)
  });
  it('should parse raw data into storable data', () => {
    expect(events.stored_events).to.eql(stored_events)
  });
  it('should process data into category information', () => {
    expect(events.category_info).to.eql(category_info)
  });
});

