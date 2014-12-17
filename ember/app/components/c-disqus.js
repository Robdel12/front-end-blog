import Ember from "ember";

var CDisqusComponent = Ember.Component.extend({
  elementId: "disqus_thread",
  classNames: ["comments"],
  timer: null,

  setupDisqus: function() {
    var controller = this.get("parentView.controller");
    var title = controller.get("title");

    window.disqus_title = title;

    if(!window.DISQUS) {
      var disqusShortname = "robertdeluca";

      window.disqus_shortname = disqusShortname;

      var dsq = document.createElement("script"); dsq.type = "text/javascript"; dsq.async = true;
      dsq.src = "//" + disqusShortname + ".disqus.com/embed.js";
      (document.getElementsByTagName("head")[0] || document.getElementsByTagName("body")[0]).appendChild(dsq);
    }

  }.on("didInsertElement"),

  loadNewPostComments: function() {
    if(window.DISQUS) {
      this.reset();
    } else {
      this.set("timer", Ember.run.debounce(this, this.loadNewPostComments, 100));
    }
  }.on("willInsertElement"),

  reset: function() {
    var controller = this.get("parentView.controller");
    var postIdentifier = controller.get("urlString");
    var postUrl = window.location.href;

    Ember.run.scheduleOnce("afterRender", function() {
      window.DISQUS.reset({
        reload: true,
        config: function () {
          this.page.identifier = postIdentifier;
          this.page.url = postUrl;
        }
      });
    });
  },
});

export default CDisqusComponent;
