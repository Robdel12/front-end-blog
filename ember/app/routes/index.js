import Ember from 'ember';
import RouteMixin from 'ember-cli-pagination/remote/route-mixin';

var IndexRoute = Ember.Route.extend(RouteMixin, {
  model: function(params) {
    return this.findPaged("post", params);
  }
});

export default IndexRoute;
