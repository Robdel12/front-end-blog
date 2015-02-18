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
  var post = {
    id: 101,
    title: 'My new post',
    excerpt: "This is my excerpt",
    body: 'The post body.',
    post_slug: "my-new-post",
    is_published: true,
    published_date: new Date(2015, 02, 03)
  };

  visit('/posts/new');
  fillIn('#post_title', post.title);
  fillIn('#excerpt', post.excerpt);
  fillIn('.post-text-area', post.body);
  // fillIn('.published-date', post.published_date);
  find('.ember-select').val(post.is_published);
  click('button:contains("Save post")');

  pretender.post('api/posts', function(req) {
    var postResponse = JSON.parse(req.requestBody).post;

    equal(postResponse.title, "My new post");
    equal(postResponse.excerpt, "This is my excerpt");
    equal(postResponse.body, "The post body.");
    equal(postResponse.is_published, true);
    // equal(postResponse.published_date, post.published_date);

    return [201, { 'Content-Type': 'application/json' }, JSON.stringify({
      posts: post
    })];
  });

  visit("/posts");

  pretender.get('/api/posts', function(req) {
    return [200, { 'Content-Type': 'application/json' }, JSON.stringify({
      post: [post],
      meta: { total_pages: 1 }
    })];
  });

  andThen(function() {
    ok(find('h3:contains("'+ post.title +'")').length, 'expected to see "My new post"');
    ok(find('span:contains("'+ post.excerpt +'")').length, 'expected to see "This is my excerpt"');
    ok(find(!!$(".inner-date").text(), 'expected to see "This is my excerpt"'));
  });
});
