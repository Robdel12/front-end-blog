import Ember from 'ember';

export default Ember.Controller.extend({
  isPreviewing: false,

  setUrl: Ember.observer('model.title', function() {
    if(!this.get("model.title")){ return false; }

    var currentPostSlug = this.get("model.title").replace(/\W/g,'-').replace(/-{1,}/g,'-').replace(/^-|-$/g,'').toLowerCase();

    return this.set("model.postSlug", currentPostSlug);
  }),

  actions: {
    save: function() {

      this.get("model").save().then(() => {
        return this.transitionTo('posts.edit', this.get('model'));
      }).catch(function(reason) {
        if(reason.status === 500) {
          this.get('flashes').danger("There was a server error.");
        }
      });

      return false;
    },

    selectPublished: function(selection) {
      this.set('model.isPublished', selection);
    },

    togglePreview: function() {
      if(this.get("isPreviewing") === false) {
        this.set("isPreviewing", true);
      } else {
        this.set("isPreviewing", false);
      }
    }
  }
});
