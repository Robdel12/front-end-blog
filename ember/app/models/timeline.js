import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr("string"),
  description: DS.attr("string"),
  date: DS.attr("date"),
  created_at: DS.attr("date"),
  formattedDate: function(){
    return moment(this.get("date")).format("MMMM Do YYYY");
  }.property("date")
});
