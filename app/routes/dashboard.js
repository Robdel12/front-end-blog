import Ember from "ember";
import AuthenticatedRouteMixin from "ember-simple-auth/mixins/authenticated-route-mixin";

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  model() {
    return this.store.query("post", { dashboard: true });
  },

  setupController(controller) {
    this._super.apply(this, arguments);

    controller.set('contacts', this.store.findAll('contact'));
  }
});
