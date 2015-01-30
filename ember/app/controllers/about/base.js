import Ember from "ember";

export default Ember.Controller.extend({
  published: [false, true],
  selectedState: null,
  openPreview: true,

  actions: {

    save: function() {
      this.get("model").save().catch(function(reason) {
        if(reason.status === 500) {
          this.get('flashes').danger("There was a server error.");
        }
      });
      this.transitionToRoute("about.index");
    },

    togglePreview: function() {
      if(this.get("openPreview") === false) {
        this.set("openPreview", true);
      } else {
        this.set("openPreview", false);
      }
    }

  }

});
