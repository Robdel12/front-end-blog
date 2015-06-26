import Ember from 'ember';

export default Ember.Component.extend({
  classNameBindings: [':dropdown'],
  tagName: "div",
  isOpen: false,

  didInsertElement: function() {
    this._super.apply(this, arguments);

    Ember.$('body').on('click', Ember.run.bind(this, "closeOnDocClick"));
  },

  closeOnDocClick: function(event) {
    if(!this.get('element')) {return;}

    if(!Ember.$.contains(this.get('element'), event.target)) {
      this.set('isOpen', false);
    }
  },

  click: function(event) {
    if(Ember.$(event.target).is('a') && Ember.$(event.target).parent().is('li')) {
      this.set('isOpen', false);
    }
  },

  actions: {
    openDropdown: function() {
      this.toggleProperty('isOpen');
    }
  }
});
