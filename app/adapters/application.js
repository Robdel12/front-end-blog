import Ember from "ember";
import config from '../config/environment';
import ActiveModelAdapter from 'active-model-adapter';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

var inflector = Ember.Inflector.inflector;
inflector.uncountable('timeline'); //only makes call to /timeline

export default ActiveModelAdapter.extend(DataAdapterMixin, {
  namespace: "api",
  host: config.apiUrl,
  authorizer: 'authorizer:devise',
  shouldReloadAll() {
    return true;
  }
});
