import Ember from 'ember';

var DashboardController = Ember.ArrayController.extend({
  sortProperties: ['created_at'],
  sortAscending: false
});

export default DashboardController;
