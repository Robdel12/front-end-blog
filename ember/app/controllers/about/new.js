import Ember from "ember";

var NewTimelineController = Ember.ObjectController.extend({
  published: [false, true],
  selectedState: null,
  openPreview: false,

  init: function() {
    this.set("timeline",  Ember.Object.create());
    this._super();
  },

  actions: {

    saveEvent: function() {
      var timelineData = {
            title: this.get("timeline.title"),
            event_date: this.get("timeline.event_date"),
            description: this.get("timeline.description"),
            is_published: this.get("selectedState")
          },
          newEvent;

      newEvent = this.store.createRecord("timeline", timelineData);

      newEvent.save().catch(function(reason) {
        if(reason.status === 500) {
          this.get('flashes').danger("There was a server error.");
        }
      });

      this.setProperties({
        "timeline.title": "",
        "timeline.date": "",
        "timeline.description": ""
      });

      this.transitionToRoute("about");
    },

    togglePreview: function() {
      this.set("openPreview", true);
    }

  }

});

export default NewTimelineController;
