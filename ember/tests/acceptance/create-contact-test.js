import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';
import Pretender from 'pretender';

var application;
var pretender;

module('Acceptance: CreateContact', {
  beforeEach: function() {
    application = startApp();
    pretender = new Pretender();
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test('Create new contact', function(assert) {
  var contact = {
    name: "Mr. Namerson",
    reason: "Some reason that I made",
    email: "namersonemail@gmail.com",
    comments: "These are my comments"
  };

  visit('/contact');
  fillIn("#name", contact.name);
  fillIn("#email", contact.email);
  fillIn("#reason_for_contact", contact.reason);
  fillIn("textarea", contact.comments);
  click("button:contains('Send me an email!')");

  pretender.post('api/contacts', function(req) {
    var contact = JSON.parse(req.requestBody).contact;

    equal(contact.name, "Mr. Namerson");
    equal(contact.reason, "Some reason that I made");
    equal(contact.email, "namersonemail@gmail.com");
    equal(contact.comments, "These are my comments");

    return [201, { 'Content-Type': 'application/json' }, JSON.stringify({
      posts: contact
    })];
  });

  andThen(function() {
    ok($(".main-container").hasClass("modal-backing"), "Modal doesn't have backdrop");
    ok(find('h1:contains("Thank you!")').length, 'expected to see modal title');
    ok(find('p:contains("Your email has been sent. I should be in contact shortly :)")').length,
        'expected to see modal description');
    ok(find('a:contains("Got it!")').length, 'expected to see modal button');
  });

  click('a:contains("Got it!")');

  andThen(function() {
    ok($(".thank-you").hasClass("modal-closed"), "Modal didn't close");
  });

});
