import Ember from 'ember';

var PostsController = Ember.ArrayController.extend({
  sortProperties: ["created_at"],
  sortAscending: false,
});

export default PostsController;
