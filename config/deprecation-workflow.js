window.deprecationWorkflow = window.deprecationWorkflow || {};
window.deprecationWorkflow.config = {
  workflow: [
    { handler: "throw", matchId: "ember-application.app-initializer-initialize-arguments" },
    { handler: "throw", matchId: "ember-application.injected-container" },
    { handler: "throw", matchId: "ember-application.app-instance-container" }
  ]
};
