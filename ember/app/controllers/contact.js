import Ember from 'ember';

export default Ember.ObjectController.extend({
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
          comments: this.get("contact.comments")
        };
      debugger;

      newContact = this.store.createRecord("contact", contactData);

      newContact.save().catch(function(reason) {
        if(reason.status === 500){
          Ember.$(".alert").text("There was a server error.");
        }
      });

      //Clear the form
      this.setProperties({
        "contact.name": "",
        "contact.email": "",
        "contact.reason": "",
        "contact.comments": ""
      });
    }

  }

});
