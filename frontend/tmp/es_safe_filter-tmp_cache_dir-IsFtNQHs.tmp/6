import DS from "ember-data";

export default DS.Model.extend({
  post_slug: DS.attr("string"),
  title: DS.attr("string"),
  published_date: DS.attr("date"),
  formatted_date: function() {
    return moment(this.get("published_date")).format("MMM Do");
  }.property("published_date"),
  excerpt: DS.attr("string"),
  body: DS.attr("string")
});
