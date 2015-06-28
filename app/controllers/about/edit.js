import Ember from "ember";
import TimelineBaseController from "./base";

export default TimelineBaseController.extend({

  autoSave: function() {
    if(this.get('model').get('hasDirtyAttributes')) {
      var notificationMessage = `Your about "${this.get("model.title")}" was auto saved`;

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

  runAutoSave: Ember.observer('model.description', 'model.title', 'model.eventDate', function() {
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
        this.store.query("timeline", this.model.id).then(function (event) {
          event.destroyRecord();
        });
        return this.transitionTo("about.index");
      }
    }
  }

});
