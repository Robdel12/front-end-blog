import Ember from 'ember';

var PostsController = Ember.ArrayController.extend({
  queryParams: ["page"],
  pageBinding: "content.page",
  totalPagesBinding: "content.totalPages"
});

export default PostsController;
