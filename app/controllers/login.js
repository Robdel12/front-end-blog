import Ember from "ember";
// import LoginControllerMixin from "ember-simple-auth/mixins/login-controller-mixin";

export default Ember.Controller.extend({
  session: Ember.inject.service('session'),

  actions: {
    authenticate: function() {
      let { identification, password } = this.getProperties('identification', 'password');

      this.get('session').authenticate('authenticator:devise', identification, password).then(() => {
        this.transitionToRoute('index');
      }).catch((reason) => {
        this.set('errorMessage', reason.error || reason);
      });
    }
  }
});
