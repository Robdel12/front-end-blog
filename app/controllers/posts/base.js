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

  publishedState: Ember.computed('model.isPublished', function() { //helper maybe?
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
        if(this.get('model.isPublished')) {
          return this.transitionToRoute('posts.show', this.get('model'));
        } else {
          return this.transitionToRoute('posts.edit', this.get('model'));
        }
      }).catch(function(reason) {
        if(reason.status === 500) {
          this.get('flashMessages').danger("There was a server error.");
        }
      });

      return false;
    },

    toggleMoreOptions: function() {
      this.toggleProperty('moreOptions');
    },

    togglePublishState: function() {
      this.toggleProperty('model.isPublished');
    },

    togglePreview: function() {
      this.toggleProperty('isPreviewing');
    }
  }
});
