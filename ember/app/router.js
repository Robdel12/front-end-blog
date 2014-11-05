import Ember from "ember";
import config from "./config/environment";

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route("about");
  this.route("portfolio");
  this.route("login");
  this.route("dashboard");
  this.route("contact");
  this.resource("posts", function() {
    this.route("show", { path: "/:post_slug" });
    this.route("edit", { path: "/:post_id/edit" });
    this.route("new");
  });
  this.route("error404", { path: "/*path" }); //404s son
});

export default Router;
