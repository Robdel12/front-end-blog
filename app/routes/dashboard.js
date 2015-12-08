import Ember from "ember";
import AuthenticatedRouteMixin from "ember-simple-auth/mixins/authenticated-route-mixin";

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  model: function() {
    return this.store.find("post", { dashboard: true });
  },

  setupController: function(controller) {
    this._super.apply(this, arguments);

    controller.set('contacts', this.store.findAll('contact'));
  }
});
