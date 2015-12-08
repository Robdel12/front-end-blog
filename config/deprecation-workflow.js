window.deprecationWorkflow = window.deprecationWorkflow || {};
window.deprecationWorkflow.config = {
  workflow: [
    { handler: "throw", matchMessage: "Ember.Handlebars.helper is deprecated, please refactor to Ember.Helper.helper" },
    { handler: "throw", matchMessage: "`Ember.Handlebars.makeViewHelper` and `Ember.HTMLBars.makeViewHelper` are deprecated. Please refactor to normal component usage." },
    { handler: "throw", matchMessage: "`lookup` was called on a Registry. The `initializer` API no longer receives a container, and you should use an `instanceInitializer` to look up objects from the container." },
    { handler: "throw", matchMessage: "Ember.keys is deprecated in favor of Object.keys" },
    { handler: "throw", matchMessage: "Using store.find(type) has been deprecated. Use store.findAll(type) to retrieve all records for a given type." },
    { handler: "throw", matchMessage: "The default behavior of shouldReloadAll will change in Ember Data 2.0 to always return false when there is at least one \"timeline\" record in the store. If you would like to preserve the current behavior please override shouldReloadAll in your adapter:application and return true." },
    { handler: "throw", matchMessage: "Using Ember.Handlebars.makeBoundHelper is deprecated. Please refactor to using `Ember.Helper.helper`." },
    { handler: "throw", matchMessage: ".createWithMixins is deprecated, please use .create or .extend accordingly" }
  ]
};
