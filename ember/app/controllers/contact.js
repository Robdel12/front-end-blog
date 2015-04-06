import Ember from 'ember';

export default Ember.Controller.extend({
  modalClosed: true,
  thankYou: true,

  init: function() {
    this.set("contact",  Ember.Object.create());
    this._super();
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

      if(!this.contactIsValid()) {
        this.get('flashes').danger("Make sure all of the required fields are filled out");
        return false;
      }

      //No spam!
      if(contactData.honeypot !== undefined) {
        this.get('flashes').danger("Uh oh, seems like you're a bot.");
        return false;
      }

      newContact = this.store.createRecord("contact", contactData);

      newContact.save().catch(function(reason) {
        if(reason.status === 500) {
          this.get('flashes').danger("There was a server error. If it happens more than once contact me on twitter: @robdel12");
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
      Ember.$(".main-container").addClass("modal-backing");
      window.scrollTo(0, 0);
    },

    closeModal: function() {
      this.set("modalClosed", true);
      Ember.$(".main-container").removeClass("modal-backing");
    }

  },

  contactIsValid: function() {
    var isValid = true;
    ['contact.name', 'contact.email', 'contact.reason'].forEach(function(field) {
      if (this.get(field) === '' || this.get(field) === undefined) {
        isValid = false;
      }
    }, this);
    return isValid;
  }

});
