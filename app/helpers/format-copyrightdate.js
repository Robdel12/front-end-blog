import Ember from "ember";

export default Ember.Helper.helper(function() {
  return new Date().getFullYear();
});
