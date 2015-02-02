import DS from "ember-data";

export default DS.Model.extend({
  postSlug: DS.attr("string"),
  title: DS.attr("string"),
  createdAt: DS.attr("date"),
  excerpt: DS.attr("string"),
  body: DS.attr("string"),
  isPublished: DS.attr("boolean"),
  formattedDate: function() {
    return moment(this.get("createdAt")).format("MMM Do");
  }.property("createdAt"),
  fullFormattedDate: function() {
    return moment(this.get("createdAt")).format('MMMM Do YYYY, h:mm a');
  }.property("createdAt")
});
