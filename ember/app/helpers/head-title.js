import Ember from 'ember';

export default Ember.Handlebars.makeBoundHelper(function(title) {
  Ember.$('head').find('title').text("Robert DeLuca - " + title);
}, 'title');
