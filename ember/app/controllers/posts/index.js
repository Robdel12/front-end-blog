import Ember from 'ember';
import PageControllerMixin from 'ember-cli-pagination/controller-mixin';

var PostsController = Ember.ArrayController.extend(PageControllerMixin, {
  sortProperties: ["created_at"],
  sortAscending: false,
});

export default PostsController;
