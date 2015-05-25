import Ember from "ember";
import DS from 'ember-data';
import config from '../config/environment';

var AppAdapter = DS.ActiveModelAdapter.extend({
  namespace: "api",
  host: config.apiUrl
});

var inflector = Ember.Inflector.inflector;
inflector.uncountable('timeline'); //only makes call to /timeline

export default AppAdapter;
