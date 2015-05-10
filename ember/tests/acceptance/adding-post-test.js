import Ember from 'ember';
import startApp from '../helpers/start-app';
import Pretender from 'pretender';

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
    is_published: "true"
  };

  visit('/posts/new');
  fillIn('#post_title', post.title);
  fillIn('#excerpt', post.excerpt);
  fillIn('.post-text-area', post.body);
  fillIn('select', post.is_published);
  click('button:contains("Save post")');

  pretender.post('api/posts', function(req) {
    var postResponse = JSON.parse(req.requestBody).post;

    equal(postResponse.title, "My new post", "Post title");
    equal(postResponse.excerpt, "This is my excerpt", "Excerpt");
    equal(postResponse.body, "The post body.", "Post body");
    equal(postResponse.is_published, true, "Is published");

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
    ok(find(!!$(".inner-date").text(), 'expected to see published date'));
  });
});
