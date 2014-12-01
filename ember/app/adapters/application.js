import DS from 'ember-data';

var AppAdapter = DS.ActiveModelAdapter.extend({
  namespace: "api"
});

export default AppAdapter;
