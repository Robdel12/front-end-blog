import DS from "ember-data";

export default DS.Model.extend({
  name: DS.attr("string"),
  email: DS.attr("string"),
  reason: DS.attr("string"),
  comments: DS.attr("string"),
  honeypot: DS.attr("string"),
});
