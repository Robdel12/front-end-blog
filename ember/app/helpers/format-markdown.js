/* global hljs, Handlebars */
import Ember from "ember";

export default Ember.Handlebars.makeBoundHelper(function(value, options) {
  if(!value || !options){ return; }

  window.marked.setOptions({
    highlight: function(code) {
      return hljs.highlightAuto(code).value;
    }
  });

  return new Handlebars.SafeString(window.marked(value));
});
