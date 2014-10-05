import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route("portfolio");
  this.route("login");
  this.route("dashboard");
  this.resource("posts", function() {
    this.route("show", { path: "/:post_slug" });
    this.route("edit", { path: "/:post_slug/edit" });
    this.route("new");
  });
  this.resource("about", function(){
    this.route("new");
    this.route("edit", { path: "/:timeline_id/edit" });
  });
  this.route('error404', { path: '/*path' }); //404s son
});

export default Router;
