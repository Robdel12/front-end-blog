import Ember from "ember";
import DS from 'ember-data';

var AppAdapter = DS.ActiveModelAdapter.extend({
  namespace: "api"
});

var inflector = Ember.Inflector.inflector;
inflector.uncountable('timeline'); //only makes call to /timeline

export default AppAdapter;
