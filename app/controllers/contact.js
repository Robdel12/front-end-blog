import Ember from 'ember';

export default Ember.Controller.extend({
  modalClosed: true,
  thankYou: true,

  actions: {

    submitContact: function(){

      if(!this.contactIsValid()) {
        this.get('flashMessages').danger("Make sure all of the required fields are filled out");
        return;
      }

      //No spam!
      if(this.get('model.honeypot') !== undefined) {
        this.get('flashMessages').danger("Uh oh, seems like you're a bot.");
        return;
      }

      this.get('model').save().then(() => {
        //Clear the form
        this.setProperties({
          "model.name": "",
          "model.email": "",
          "model.reason": "",
          "model.comments": ""
        });
        this.set("modalClosed", false);
        Ember.$(".main-container").addClass("modal-backing");
        window.scrollTo(0, 0);
      }).catch(function(reason) {
        if(reason.status === 500) {
          this.get('flashMessages').danger("There was a server error. If it happens more than once contact me on twitter: @robdel12");
        }
      });
    },

    closeModal: function() {
      this.set("modalClosed", true);
      Ember.$(".main-container").removeClass("modal-backing");
    }

  },

  contactIsValid: function() {
    var isValid = true;
    ['model.name', 'model.email', 'model.reason'].forEach(function(field) {
      if (this.get(field) === '' || this.get(field) === undefined) {
        isValid = false;
      }
    }, this);
    return isValid;
  }

});
