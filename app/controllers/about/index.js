import Ember from 'ember';

export default Ember.Controller.extend({
  session: Ember.inject.service('session'),
  sortedProperties: ['createdAt:desc'],
  sortedModel: Ember.computed.sort('model', 'sortedProperties')
});
