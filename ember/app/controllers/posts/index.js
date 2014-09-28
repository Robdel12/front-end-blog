import Ember from 'ember';
import PageControllerMixin from 'ember-cli-pagination/controller-mixin';

var PostsController = Ember.ArrayController.extend(PageControllerMixin, {
});

export default PostsController;
