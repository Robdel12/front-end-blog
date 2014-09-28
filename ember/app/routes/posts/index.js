import Ember from "ember";
import PageRouteMixin from 'ember-cli-pagination/route-mixin';

export default Ember.Route.extend(PageRouteMixin, {

  beforeModel: function() {
    // Assume the "loading" class displays an overlay with a loading animation
    Ember.$("body").append("<div class='loader-container'><div class='loader'></div></div>");
  },

  model: function(params) {
    return this.findPaged("posts", params);
  },

  afterModel: function() {
    Ember.$(".loader-container").remove();
  }

});
