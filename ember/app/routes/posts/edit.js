import Ember from "ember";
import AuthenticatedRouteMixin from "simple-auth/mixins/authenticated-route-mixin";

var PostsRoute = Ember.Route.extend(AuthenticatedRouteMixin, {

  model: function(params) {
    return this.store.find("post", params.post_id);
  },

  deactivate: function(){
    this.controllerFor(this.routeName).stopAutoSave();
  }

});

export default PostsRoute;
