import Ember from 'ember';

export default Ember.Controller.extend({
  isPreviewing: false,
  moreOptions: false,

  currentOptionName: Ember.computed('moreOptions', function() {
    if(this.get('moreOptions') === false) {
      return "More options";
    } else {
      return "Less options";
    }
  }),

  publishedState: Ember.computed('model.isPublished', function() {
    if(this.get('model.isPublished') === false) {
      return "Publish";
    } else {
      return "Unpublish";
    }
  }),

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

    toggleMoreOptions: function() {
      if(this.get("moreOptions") === false) {
        this.set("moreOptions", true);
      } else {
        this.set("moreOptions", false);
      }
    },

    togglePublishState: function() {
      if(this.get('model.isPublished') === false) {
        return this.set('model.isPublished', true);
      } else {
        return this.set('model.isPublished', false);
      }
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
