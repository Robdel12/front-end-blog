import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
  title: DS.attr("string"),
  description: DS.attr("string"),
  eventDate: DS.attr("date"),
  createdAt: DS.attr("date"),
  isPublished: DS.attr("boolean"),
  formattedDate: Ember.computed('eventDate', function() {
    return moment(this.get("eventDate")).format("MMMM Do, YYYY");
  })
});
