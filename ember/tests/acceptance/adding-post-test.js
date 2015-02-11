import Ember from 'ember';
import startApp from '../helpers/start-app';
import Pretender from 'pretender';
import Helpers from 'ember-cli-pagination/test-helpers';

var application;
var pretender;

module('Acceptance: Adding a post', {
  setup: function() {
    application = startApp();
    pretender = new Pretender();
  },
  teardown: function() {
    Ember.run(application, 'destroy');
    pretender.shutdown();
  }
});

function login() {
  visit('/login');
  fillIn('#identification', 'robert@mail.com');
  fillIn('#password', '12345678');
  click("button:contains('Login')");
  pretender.post('/users/sign_in', function() {
    return [201, { 'Content-Type': 'application/json' }, JSON.stringify({
      "user_token":"abc123",
      "user_email":"robert@mail.com"
    })];
  });
}

test('happy path', function() {
  pretender.get('/api/posts', function(request) {
    return [200, { 'Content-Type': 'application/json' }, JSON.stringify({
      post: [],
      meta: { total_pages: 1 }
    })];
  });

  login();

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
  // pretender.get('api/posts/my-new-post', function(req) {
  //   return [200, { 'Content-Type': 'application/json' }, JSON.stringify({
  //     posts: {
  //       id: 101,
  //       title: 'My new post',
  //       body: 'The post body.',
  //       post_slug: 'my-new-post'
  //     }
  //   })];
  // });
  andThen(function() {
    ok(find('h2:contains("My new post")').length,
      'expected to see "My new post"');
  });
});
