import Ember from "ember";

var EditController = Ember.ObjectController.extend({
  published: [false, true],

  init: function() {
    this.autoSave();
    this._super();
  },

  autoSave: function() {
    this.timer = Ember.run.later(this, function() {
      if(this.get("isDirty")){
        var notificationMessage = 'Your post "' + this.get("title") + '" was auto saved';

        this.model.save().catch(function(reason){
          if(reason.status === 500){
            this.get('flashes').danger("Server error. Couldn't auto save.");
          }
        });

        this.get("flashes").info(notificationMessage);

        if(document.hidden){
          this.desktopNotifcation(notificationMessage);
        }
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
        this.store.find("post", this.model.id).then(function (post) {
          post.destroyRecord();
        });
        return this.transitionTo("dashboard");
      }
    },

    save: function() {
      return this.model.save().then((function(_this) {
        return function() {
          if(_this.model._data.is_published === true){
            return _this.transitionToRoute("posts.show", _this.model);
          } else {
            Ember.get(_this, 'flashes').info("Your post was saved.");
          }
        };
      })(this));
    },

    cancel: function() {
      if(this.model.isDirty) {
        this.model.rollback();
      }
      return this.transitionTo("posts.index");
    },

    togglePreview: function(){
      Ember.$(".preview").toggleClass("hide");
    }

  }

});

export default EditController;
