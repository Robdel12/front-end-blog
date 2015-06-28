import Ember from 'ember';

export default Ember.Controller.extend({
  sortedModel: Ember.computed('model', function() {
     return Ember.ArrayProxy.createWithMixins(Ember.SortableMixin, {
      sortProperties: ['eventDate'],
      sortAscending: false,
      content: this.get('model')
    });
  })
});
