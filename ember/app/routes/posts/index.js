import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel: function() {
    // Assume the 'loading' class displays an overlay with a loading animation
    Ember.$('body').append('<div class="loader-container"><div class="loader"></div></div>');
  },

  model: function() {
    return this.store.find("posts", { home: true });
  },

  afterModel: function() {
    Ember.$(".loader-container").remove();
  }
});
