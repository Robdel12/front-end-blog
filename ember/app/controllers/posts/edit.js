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
        var notificationMessage = 'Your post "' + this.get("title") + '" was auto saved';

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
            return _this.transitionToRoute("post.show", _this.model);
          } else {
            var notificationMessage = "Your post was saved";
            var alert = Ember.$(".alert");

            window.setTimeout(function(){
              alert.text("").hide();
            }, 5000);
            alert.text(notificationMessage).show();
          }
        };
      })(this));
    },

    cancel: function() {
      if(this.model.isDirty) {
        this.model.rollback();
      }
      return this.transitionTo("post.show", this.model);
    },

    togglePreview: function(){
      Ember.$(".preview").toggleClass("hide");
    }

  }

});

export default EditController;
