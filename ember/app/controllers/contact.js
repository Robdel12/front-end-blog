import Ember from 'ember';

export default Ember.ObjectController.extend({
  modalClosed: true,
  thankYou: true,

  init: function() {
    this.set("contact",  Ember.Object.create());
  },

  actions: {

    submitContact: function(){
      var newContact;
      var contactData = {
        name: this.get("contact.name"),
        email: this.get("contact.email"),
        reason: this.get("contact.reason"),
        comments: this.get("contact.comments"),
        honeypot: this.get("contact.honeypot")
      };

      //No spam!
      if(contactData.honeypot !== undefined) {
        this.get('flashes').danger("Form error. Please try again later");
        return false;
      }

      newContact = this.store.createRecord("contact", contactData);

      newContact.save().catch(function(reason) {
        if(reason.status === 500) {
          this.get('flashes').danger('There was a server error. Please try again.');
        }
      });

      //Clear the form
      this.setProperties({
        "contact.name": "",
        "contact.email": "",
        "contact.reason": "",
        "contact.comments": ""
      });

      this.set("modalClosed", false);
      Ember.$("body").addClass("modal-backing"); //how to do this?
    },

    closeModal: function() {
      this.set("modalClosed", true);
      Ember.$("body").removeClass("modal-backing"); //how to do this?
    }

  }

});
