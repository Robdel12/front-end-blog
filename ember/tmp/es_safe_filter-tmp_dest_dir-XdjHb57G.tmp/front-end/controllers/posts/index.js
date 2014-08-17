import Ember from 'ember';

var PostsController = Ember.ArrayController.extend({
  sortProperties: ['id'],
  sortAscending: false
});

export default PostsController;
