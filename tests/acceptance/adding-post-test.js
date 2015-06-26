// import Ember from 'ember';
// import {module, test} from 'qunit';
// import startApp from '../helpers/start-app';
// import Pretender from 'pretender';

// var application;
// var pretender;

// module('Acceptance: Adding a post', {
//   beforeEach: function() {
//     application = startApp();
//     pretender = new Pretender();
//     authenticateSession();
//   },
//   afterEach: function() {
//     Ember.run(application, 'destroy');
//     pretender.shutdown();
//   }
// });

// test('Creating a new post', function(assert) {
//   visit('/posts/new');
//   fillIn('#post_title', 'Post Title');
//   click('.more-options');
//   fillIn('#excerpt', 'Post excerpt');
//   fillIn('.post-text-area', 'This is the post body.. Deal wit it');
//   click('.spec-publish-toggle');
//   click('button:contains("Save post")');

//   pretender.post('api/posts', function(req) {
//     var postResponse = JSON.parse(req.requestBody).post;

//     return [201, { 'Content-Type': 'application/json' }, JSON.stringify({
//       posts: post
//     })];
//   });

//   pretender.get('/api/posts', function(req) {
//     return [200, { 'Content-Type': 'application/json' }, JSON.stringify({
//       post: [post],
//       meta: { total_pages: 1 }
//     })];
//   });

//   andThen(function() {
//     assert.ok(find('.post-title'), 'expected to see "My new post"');
//     assert.ok(find('span:contains("'+ post.excerpt +'")').length, 'expected to see "This is my excerpt"');
//     assert.ok(find(!!$(".inner-date").text(), 'expected to see published date'));
//   });
// });
