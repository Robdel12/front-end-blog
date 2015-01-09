import Ember from "ember";

var EditController = Ember.ObjectController.extend({
  published: [false, true],

  init: function() {
    this.autoSave();
  },

  autoSave: function() {
    this.timer = Ember.run.later(this, function() {
      if(this.get("isDirty")){
        var alert = Ember.$(".alert");
        var notificationMessage = 'Your timeline "' + this.get("title") + '" was auto saved';

        this.model.save().catch(function(reason){
          if(reason.status === 500){
            alert.text("Server error. Couldn't auto save.");
          }
        });

        alert.text(notificationMessage).show();
        if(document.hidden){
          this.desktopNotifcation(notificationMessage);
        }

        window.setTimeout(function(){
          alert.text("").hide();
        }, 5000);

      }
      this.autoSave();
    }, 60000); //60000 = 1 min
  },

  stopAutoSave: function(){
    Ember.run.cancel(this.timer);
  },

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
        this.store.find("timeline", this.model.id).then(function (event) {
          event.destroyRecord();
        });
        return this.transitionTo("about.index");
      }
    },

    save: function() {
      return this.model.save().then((function(_this) {
        return function() {
          return _this.transitionToRoute("about.index");
        };
      })(this));
    }

  }

});

export default EditController;
