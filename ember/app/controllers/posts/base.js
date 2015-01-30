import Ember from 'ember';

export default Ember.Controller.extend({
  published: [false, true],
  selectedState: null,
  preview: false,
  settings: {
    mobile: true
  },

  setUrl: function() {
    if(!this.get("model.title")){ return false; }

    var postSlug = this.get("model.title").replace(/\W/g,'-').replace(/-{1,}/g,'-').replace(/^-|-$/g,'').toLowerCase();

    return this.set("model.post_slug", postSlug);
  }.observes("model.title"),

  actions: {
    save: function() {

      this.get("model").save().catch(function(reason) {
        if(reason.status === 500){
          this.get('flashes').danger("There was a server error.");
        }
      });

      if(this.get("model.is_published") === true){
        this.transitionToRoute("posts.show", this.get("model.post_slug"));
      } else {
        this.transitionToRoute("posts.edit", this.get("model.post_slug"));
      }
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
