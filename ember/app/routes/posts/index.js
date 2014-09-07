import Ember from "ember";
var page;

export default Ember.Route.extend({
  queryParams: {
    page: {
      refreshModel: true
    }
  },

  beforeModel: function() {
    // Assume the "loading" class displays an overlay with a loading animation
    Ember.$("body").append("<div class='loader-container'><div class='loader'></div></div>");
  },

  model: function(params) {
    page = params.page;
    return this.store.findQuery("posts", params);
  },

  afterModel: function() {
    Ember.$(".loader-container").remove();
  },

  events: {
    more: function() {
      this.controller.set("page", page + 1);
    }
  },

  resetController: function (controller, isExiting, transition) {
    if (isExiting) {
      controller.set("page", 1);
    }
  }

});
