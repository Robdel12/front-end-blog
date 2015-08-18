/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'front-end',
    environment: environment,
    baseURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    'apiUrl': "http://dry-fjord-5394.herokuapp.com",

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  ENV.contentSecurityPolicy = {
    'default-src': "'none'",
    'script-src': "'self' http://dry-fjord-5394.herokuapp.com",
    'font-src': "'self' http://fonts.gstatic.com",
    'connect-src': "'self'",
    'img-src': "'self'",
    'style-src': "'self' 'unsafe-inline' http://fonts.googleapis.com",
    'media-src': "'self'"
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
    ENV.apiUrl = null;
  }

  ENV['simple-auth'] = {
    authenticationRoute: "login",
    authorizer: 'simple-auth-authorizer:devise',
    store: 'simple-auth-session-store:local-storage'
  };

  ENV['simple-auth-devise'] = {
    tokenAttributeName: 'token',
    identificationAttributeName: 'email'
  };


  if (environment === 'test') {
    ENV.simple_auth = {
      store: 'simple-auth-session-store:ephemeral'
    };
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.apiUrl = null;

  }

  if (environment === 'production') {
    ENV.googleAnalytics = {
      webPropertyId: 'UA-40802317-1'
    };

    ENV['simple-auth-devise'] = {
      serverTokenEndpoint: 'http://dry-fjord-5394.herokuapp.com/users/sign_in'
    };
  }

  return ENV;
};
