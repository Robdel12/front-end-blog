import Ember from 'ember';
import startApp from '../helpers/start-app';
import Pretender from 'pretender';
import simpleAuth from 'simple-auth-testing/test-helpers';

var application;
var pretender;

module('Acceptance: Adding a post', {
  setup: function() {
    application = startApp();
    pretender = new Pretender();
    authenticateSession();
  },
  teardown: function() {
    Ember.run(application, 'destroy');
    pretender.shutdown();
  }
});

test('Creating a new post', function() {
  pretender.get('/api/posts', function(request) {
    return [200, { 'Content-Type': 'application/json' }, JSON.stringify({
      post: [],
      meta: { total_pages: 1 }
    })];
  });

  visit('/posts');
  click('a:contains("New post")');
  fillIn('#post_title', 'My new post');
  fillIn('.post-text-area', 'The post body.');
  find('select').val('true');
  click('button:contains("Edit post")');

  pretender.post('api/posts', function(req) {
    return [201, { 'Content-Type': 'application/json' }, JSON.stringify({
      posts: {
        id: 101,
        title: 'My new post',
        body: 'The post body.',
        post_slug: "my-new-post"
      }
    })];
  });

  visit("/posts");

  pretender.get('/api/posts', function(request) {
    return [200, { 'Content-Type': 'application/json' }, JSON.stringify({
      post: [{
        id: 101,
        title: 'My new post',
        body: 'The post body.',
        excerpt: "This is my excerpt",
        post_slug: "my-new-post",
        publishedDate: new Date()
      }],
      meta: { total_pages: 1 }
    })];
  });

  andThen(function() {
    ok(find('h3:contains("My new post")').length,
      'expected to see "My new post"');
  });
});
