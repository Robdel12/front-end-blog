import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr("string"),
  description: DS.attr("string"),
  eventDate: DS.attr("date"),
  createdAt: DS.attr("date"),
  isPublished: DS.attr("boolean"),
  formattedDate: function() {
    return moment(this.get("eventDate")).format("MMMM Do, YYYY");
  }.property("eventDate")
});
