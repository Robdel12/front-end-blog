import Ember from 'ember';

var PostsController = Ember.ArrayController.extend({
  queryParams: ["page", "perPage"],
  pageBinding: "content.page",
  totalPagesBinding: "content.totalPages",
  page: 1,
  perPage: 10
});

export default PostsController;
