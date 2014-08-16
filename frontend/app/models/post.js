import DS from "ember-data";

export default DS.Model.extend({
  post_slug: DS.attr("string"),
  title: DS.attr("string"),
  published_date: DS.attr("date"),
  excerpt: DS.attr("string"),
  body: DS.attr("string")
});
