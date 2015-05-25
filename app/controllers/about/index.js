import Ember from 'ember';

export default Ember.ArrayController.extend({
  sortProperties: ['eventDate'],
  sortAscending: false
});
