import Ember from "ember";

var DashboardController = Ember.ArrayController.extend({
  sortProperties: ["publishedDate"],
  sortAscending: false
});

export default DashboardController;
