import Ember from "ember";

var NewController = Ember.ObjectController.extend({
  published: [true, false],
  selectedState: null,
  init: function() {
    this.set("post",  Ember.Object.create());
  },

  actions: {

    publishPost: function() {
      var newPost = this.store.createRecord("post", {
        title: this.get("post.title"),
        excerpt: this.get("post.excerpt"),
        body: this.get("post.body"),
        post_slug: this.get("post.title").replace(/\s+$/g,'').replace(/\s+/g, '-').toLowerCase(),
        is_published: this.get("selectedDate")
      });
      newPost.save();
      this.setProperties({
        "post.title": "",
        "post.excerpt": "",
        "post.body": ""
      });
      this.transitionToRoute("posts"); // Do I want this, or the post that was just made?
    }

  }

});

export default NewController;
