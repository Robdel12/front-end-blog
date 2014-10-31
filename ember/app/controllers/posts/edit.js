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
        }, 5000);

      }
      this.autoSave();
    }, 60000); //60000 = 1 min
  },

  desktopNotifcation: function(message) {
    if (Notification.permission === "granted") {
      var notification = new Notification(message);
    }
    else if (Notification.permission !== 'denied') {
      Notification.requestPermission(function (permission) {
        if (permission === "granted") {
          var notification = new Notification(message);
        }
      });
    }
  },

  actions: {

    destroy: function() {
      var prompt = window.confirm("Are you sure you want to delete this?");
      if(prompt) {
        this.store.find('posts', this.model.id).then(function (post) {
          post.destroyRecord();
        });
        return this.transitionTo('dashboard');
      }
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
