import Ember from "ember";
import PostsBaseController from './base';

var EditController = PostsBaseController.extend({

  autoSave: function() {
    this.timer = Ember.run.later(this, function() {
      if(this.get("model").get("isDirty")) {
        var notificationMessage = 'Your post "' + this.get("model.title") + '" was auto saved';

        this.get("model").save().catch(function(reason){
          if(reason.status === 500){
            this.get('flashes').danger("Server error. Couldn't auto save.", 5000);
          }
        });

        this.get("flashes").info(notificationMessage, 5000);

        if(document.hidden){
          this.desktopNotifcation(notificationMessage);
        }
      }
      this.autoSave();
    }, 60000); //60000 = 1 min
  }.on("init"),

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
    }
  }

});

export default EditController;
