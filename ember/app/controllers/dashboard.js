import Ember from "ember";

var DashboardController = Ember.ArrayController.extend({
  sortProperties: ["createdAt"],
  sortAscending: false
});

export default DashboardController;
