import Ember from "ember";
import config from '../config/environment';
import ActiveModelAdapter from 'active-model-adapter';

var inflector = Ember.Inflector.inflector;
inflector.uncountable('timeline'); //only makes call to /timeline

export default ActiveModelAdapter.extend({
  namespace: "api",
  host: config.apiUrl,
  shouldReloadAll() {
    return true;
  }
});
