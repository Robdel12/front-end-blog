import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route("portfolio");
  this.route("login");
  this.route("dashboard");
  this.route("contact");

  this.route("posts", function() {
    this.route("show", { path: "/:postSlug" });
    this.route("edit", { path: "/:post_id/edit" });
    this.route("new");
  });

  this.route("about", function(){
    this.route("new");
    this.route("edit", { path: "/:timeline_id/edit" });
  });
  this.route('error404', { path: '/*path' }); //404s son
  this.route('analytics');
});

if(config.environment === "production") {
  Router.reopen({
    notifyGoogleAnalytics: function() {
      return window.ga('send', 'pageview', {
        'page': this.get('url'),
        'title': this.get('url')
      });
    }.on('didTransition')
});
}

export default Router;
