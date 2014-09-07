import Ember from "ember";

export default Ember.View.extend({
  click: function(){
    this.get("controller").send("more");
  }
});
