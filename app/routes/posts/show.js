import Ember from "ember";

var PostsRoute = Ember.Route.extend({
  model: function(params) {
    return this.store.find("post", params.postSlug).then(function(slug) {
      return slug;
    });
  }
});

export default PostsRoute;
