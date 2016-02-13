import Devise from 'ember-simple-auth/authenticators/devise';
import env from 'front-end/config/environment';
import Ember from 'ember';

export default Devise.extend({
  serverTokenEndpoint: Ember.computed(function() {
    if(env.environment !== 'development') {
      return `${env.apiUrl}/users/sign_in`;
    } else {
      return `/users/sign_in`;
    }
  })
});
