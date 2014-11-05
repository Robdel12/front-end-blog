import Ember from "ember";
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

var PostsRoute = Ember.Route.extend(AuthenticatedRouteMixin, {
  model: function(params) {
    return this.store.find('post', params.post_slug).then(function (slug) {
      return slug;
    });
  }
});

export default PostsRoute;
