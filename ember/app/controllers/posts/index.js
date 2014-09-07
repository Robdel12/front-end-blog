import Ember from 'ember';

var PostsController = Ember.ArrayController.extend({
  sortProperties: ["created_at"],
  sortAscending: false,
  queryParams: "page",
  page: 1
});

export default PostsController;
