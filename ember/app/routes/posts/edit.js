import Ember from "ember";
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

var PostsRoute = Ember.Route.extend(AuthenticatedRouteMixin, {
  model: function(params) {
    return this.store.find('posts', params.post_id);
  }
});

export default PostsRoute;
