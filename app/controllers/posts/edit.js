import Ember from "ember";
import PostsBaseController from './base';

var EditController = PostsBaseController.extend({
  isEditing: true,

  autoSave: function() {
    if(this.get('model').get('hasDirtyAttributes')) {
      var notificationMessage = `Your post "${this.get("model.title")}" was auto saved`;

      this.model.save().catch(function(reason){
        if(reason.status === 500){
          this.get('flashMessages').danger("Server error. Couldn't auto save.");
        }
      });

      this.get('flashMessages').info(notificationMessage);

      if(document.hidden){
        this.desktopNotifcation(notificationMessage);
      }
    }
  },

  runAutoSave: Ember.observer('model.body', 'model.title', 'model.excerpt', 'model.publishedDate', function() {
    Ember.run.debounce(this, this.autoSave, 10000);
  }),

  desktopNotifcation: function(message) {
    if(window.Notification.permission === "granted") {
      new window.Notification(message);
    }
    else if(window.Notification.permission !== "denied") {
      window.Notification.requestPermission(function (permission) {
        if(permission === "granted") {
          new window.Notification(message);
        }
      });
    }
  },

  actions: {

    destroy: function() {
      var prompt = window.confirm("Are you sure you want to delete this?");
      if(prompt) {
        this.store.find("post", this.model.id).then(function (post) {
          post.destroyRecord();
        });
        return this.transitionTo("dashboard");
      }
    },

    save: function() {
      return this.model.save().then((function(_this) {
        return function() {
          if(_this.model.get('isPublished') === true){
            return _this.transitionToRoute("posts.show", _this.model);
          } else {
            Ember.get(_this, 'flashMessages').info("Your post was saved.");
          }
        };
      })(this));
    }
  }

});

export default EditController;
