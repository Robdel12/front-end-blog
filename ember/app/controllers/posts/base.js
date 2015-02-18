import Ember from 'ember';

export default Ember.Controller.extend({
  published: [true, false],
  preview: false,
  settings: {
    mobile: true
  },

  setUrl: function() {
    if(!this.get("model.title")){ return false; }

    var currentPostSlug = this.get("model.title").replace(/\W/g,'-').replace(/-{1,}/g,'-').replace(/^-|-$/g,'').toLowerCase();

    return this.set("model.postSlug", currentPostSlug);
  }.observes("model.title"),

  actions: {
    save: function() {

      this.get("model").save().catch(function(reason) {
        if(reason.status === 500){
          this.get('flashes').danger("There was a server error.");
        }
      });

      return false;
    },

    togglePreview: function() {
      if(this.get("preview") === false) {
        this.set("preview", true);
      } else {
        this.set("preview", false);
      }
    }
  }
});
