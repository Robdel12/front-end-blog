import Ember from 'ember';

var IndexRoute = Ember.Route.extend({
  redirect: function() {
    this.replaceWith("posts");
  }
});

export default IndexRoute;
