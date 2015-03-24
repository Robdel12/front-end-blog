/* global authenticateSession */
/* global invalidateSession */
import Ember from 'ember';
import {module, test} from 'qunit';
import startApp from '../helpers/start-app';
import Pretender from 'pretender';

var application;
var pretender;

module('Acceptance: Adding an about', {
  beforeEach: function() {
    application = startApp();
    pretender = new Pretender();
    authenticateSession();
  },
  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test('Create new about', function(assert) {
  var timeline = {
    id: 101,
    title: 'My new About',
    event_date: new Date(2014, 02, 03).toString(), //March 3rd, 2014
    description: "My new abouts description",
    is_published: "true"
  };

  visit('/about/new');
  fillIn(".title", timeline.title);
  // fillIn("#date", timeline.event_date);
  fillIn(".description", timeline.description);
  fillIn("#isPublished", timeline.is_published);

  click("button:contains('Save')");

  pretender.post('api/timeline', function(req) {
    var aboutResponse = JSON.parse(req.requestBody).timeline;

    assert.equal(aboutResponse.title, "My new About", "About title");
    // equal(aboutResponse.event_date, "2014-03-3", "About date");
    assert.equal(aboutResponse.description, "My new abouts description", "About description");
    assert.equal(aboutResponse.is_published, true, "About is_published");

    return [201, { 'Content-Type': 'application/json' }, JSON.stringify({
      timeline: timeline
    })];
  });

  pretender.get('api/timeline', function() {
    return [201, { 'Content-Type': 'application/json' }, JSON.stringify({
      timelines: [timeline]
    })];
  });

  invalidateSession();

  andThen(function() {
    assert.ok(find('h4:contains("'+ timeline.title +'")').length, 'expected to see "'+ timeline.title + '"');
    assert.ok(find('p:contains("'+ timeline.description +'")').length, 'expected to see "'+ timeline.title + '"');
    assert.ok(find('.date:contains("March 3rd, 2014")').length, 'expected to see "March 3rd, 2014"');
  });
});
