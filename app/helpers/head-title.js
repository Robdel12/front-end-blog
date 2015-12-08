import Ember from 'ember';

export default Ember.Helper.helper(function(title) {
  Ember.$('head').find('title').text("Robert DeLuca - " + title);
}, 'title');
