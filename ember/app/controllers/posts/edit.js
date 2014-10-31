import Ember from "ember";

var EditController = Ember.ObjectController.extend({
  published: [false, true],

  init: function() {
    this.autoSave();
  },

  autoSave: function() {
    Ember.run.later(this, function() {
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
        }, 60000);

      }
      this.autoSave();
    }, 60000); //60000 = 1 min
  },

  desktopNotifcation: function(message) {
    // Let's check if the user is okay to get some notification
    if (Notification.permission === "granted") {
      // If it's okay let's create a notification
      var notification = new Notification(message);
    }
    // Otherwise, we need to ask the user for permission
    // Note, Chrome does not implement the permission static property
    // So we have to check for NOT 'denied' instead of 'default'
    else if (Notification.permission !== 'denied') {
      Notification.requestPermission(function (permission) {
        // If the user is okay, let's create a notification
        if (permission === "granted") {
          var notification = new Notification(message);
        }
      });
    }
  },

  actions: {

    destroy: function() {
      this.store.find('posts', this.model.id).then(function (post) {
        post.destroyRecord();
      });
      return this.transitionTo('dashboard');
    },

    save: function() {
      return this.model.save().then((function(_this) {
        return function() {
          if(_this.model._data.is_published === true){
            return _this.transitionToRoute('posts.show', _this.model);
          } else {
            var notificationMessage = 'Your post was saved';
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
      if (this.model.isDirty) {
        this.model.rollback();
      }
      return this.transitionTo('posts.show', this.model);
    },

    togglePreview: function(){
      Ember.$(".preview").toggleClass("hide");
    }

  }

});

export default EditController;
