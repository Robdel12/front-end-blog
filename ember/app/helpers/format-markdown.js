import Ember from "ember";

export default Ember.Handlebars.makeBoundHelper(function(value, options) {
  if (!value || !options){ return; }
  return window.marked(value);
});
