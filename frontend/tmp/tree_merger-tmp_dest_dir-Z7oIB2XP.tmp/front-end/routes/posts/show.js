import Ember from "ember";

var PostsRoute = Ember.Route.extend({
  model: function(params) {
    return this.store.find('posts', params.post_slug).then(function (slug) {
      return slug;
    });
    // return this.store.find('posts', {post_slug: params.post_slug});
  }
});

export default PostsRoute;
