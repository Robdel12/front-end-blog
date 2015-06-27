import Ember from "ember";

export default Ember.Controller.extend({
  openPreview: true,

  actions: {

    save: function() {
      this.get("model").save().then(() => {
        if(this.get('model.isPublished') === true) {
          return this.transitionToRoute("about.index");
        } else {
          return this.transitionToRoute("about.edit", this.get('model'));
        }
      }).catch(function(reason) {
        if(reason.status === 500) {
          this.get('flashes').danger("There was a server error.");
        }
      });
    },

    selectionsChanged: function(selection) {
      this.set('model.isPublished', selection);
    },

    togglePreview: function() {
      this.toggleProperty("openPreview");
    }

  }

});
