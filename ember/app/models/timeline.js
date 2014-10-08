import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr("string"),
  description: DS.attr("string"),
  event_date: DS.attr("string"),
  created_at: DS.attr("date"),
  formattedDate: function(){
    return moment(this.get("event_date")).format("MMMM Do YYYY");
  }.property("event_date")
});
