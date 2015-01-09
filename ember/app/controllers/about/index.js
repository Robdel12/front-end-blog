import Ember from 'ember';

export default Ember.ArrayController.extend({
  sortProperties: ['event_date'],
  sortAscending: false
});
