import Ember from 'ember';
import startApp from '../helpers/start-app';
import Pretender from 'pretender';
import simpleAuth from 'simple-auth-testing/test-helpers';

var application;
var pretender;

module('Acceptance: Adding an about', {
  setup: function() {
    application = startApp();
    pretender = new Pretender();
    authenticateSession();
  },
  teardown: function() {
    Ember.run(application, 'destroy');
  }
});

test('Create new about', function() {
  var timeline = {
    id: 101,
    title: 'My new About',
    eventDate: new Date(2014, 02, 03), //March 3rd, 2014
    description: "My new abouts description",
    isPublished: true
  };

  visit('/about/new');
  fillIn(".title", timeline.title);
  fillIn(".date", timeline.eventDate);
  fillIn(".description", timeline.description);
  fillIn("#isPublished", timeline.isPublished);
  click("button:contains('Save')");

  pretender.post('api/timeline', function() {
    return [201, { 'Content-Type': 'application/json' }, JSON.stringify({
      timeline: timeline
    })];
  });

  pretender.get('api/timeline', function() {
    return [201, { 'Content-Type': 'application/json' }, JSON.stringify({
      timelines: [timeline]
    })];
  });

  andThen(function() {
    ok(find('h4:contains("'+ timeline.title +'")').length, 'expected to see "'+ timeline.title + '"');
    ok(find('p:contains("'+ timeline.description +'")').length, 'expected to see "'+ timeline.title + '"');
    ok(find('.date:contains("March 3rd, 2014")').length, 'expected to see "March 3rd, 2014"');
  });
});
