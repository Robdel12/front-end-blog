import Ember from "ember";

var NewTimelineController = Ember.ObjectController.extend({
  published: [false, true],
  selectedState: null,

  init: function() {
    this.set("timeline",  Ember.Object.create());
  },

  actions: {

    saveEvent: function() {
      var timelineData = {
            title: this.get("timeline.title"),
            date: this.get("timeline.date"),
            body: this.get("timeline.description"),
            is_published: this.get("selectedState")
          },
          newEvent;

      newEvent = this.store.createRecord("timeline", timelineData);

      newEvent.save().catch(function(reason) {
        if(reason.status === 500){
          Ember.$(".alert").text("There was a server error.");
        }
      });

      this.setProperties({
        "timeline.title": "",
        "timeline.date": "",
        "timeline.description": ""
      });

      if(timelineData.is_published === true){
        this.transitionToRoute("about");
      } else {
        this.transitionToRoute("about.edit", timelineData.id);
      }
    },

    togglePreview: function(){
      Ember.$(".preview").toggleClass("hide");
    }

  }

});

export default NewTimelineController;
