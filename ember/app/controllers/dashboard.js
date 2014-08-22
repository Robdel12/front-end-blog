import Ember from 'ember';

var DashboardController = Ember.ArrayController.extend({
  sortProperties: ['id'],
  sortAscending: false
});

export default DashboardController;
