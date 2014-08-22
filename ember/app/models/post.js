import DS from "ember-data";

export default DS.Model.extend({
  post_slug: DS.attr("string"),
  title: DS.attr("string"),
  created_at: DS.attr("date"),
  excerpt: DS.attr("string"),
  body: DS.attr("string"),
  is_published: DS.attr("boolean"),
  formatted_date: function() {
    return moment(this.get("created_at")).format("MMM Do");
  }.property("created_at")
});
