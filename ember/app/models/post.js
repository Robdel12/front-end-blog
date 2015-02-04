import DS from "ember-data";

export default DS.Model.extend({
  postSlug: DS.attr("string"),
  title: DS.attr("string"),
  createdAt: DS.attr("date"),
  publishedDate: DS.attr("date"),
  excerpt: DS.attr("string"),
  body: DS.attr("string"),
  isPublished: DS.attr("boolean"),
  formattedDate: function() {
    return moment(this.get("publishedDate")).format("MMM Do");
  }.property("publishedDate"),
  fullFormattedDate: function() {
    return moment(this.get("publishedDate")).format('MMMM Do YYYY, h:mm a');
  }.property("publishedDate")
});
